import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

test('Git credential lookup fails without invoking an alternate askpass provider', t => {
  const fixture = mkdtempSync(join(tmpdir(), 'oddmash-ai-test-'));
  t.after(() => rmSync(fixture, { recursive: true }));
  const launcher = fileURLToPath(new URL('./oddmash-ai', import.meta.url));
  const askpass = join(fixture, 'askpass');
  const marker = join(fixture, 'askpass-used');
  writeFileSync(join(fixture, 'gh'), '#!/bin/sh\n[ "$1 $2" = "auth status" ] || exit 1\nprintf "%s\\n" file\n', { mode: 0o700 });
  writeFileSync(askpass, '#!/bin/sh\n: > "$ASKPASS_MARKER"\nprintf "%s\\n" alternate\n', { mode: 0o700 });

  const result = spawnSync(launcher, ['git', 'credential', 'fill'], {
    cwd: fixture,
    encoding: 'utf8',
    env: {
      ...process.env,
      PATH: fixture + delimiter + process.env.PATH,
      GIT_CONFIG_GLOBAL: '/dev/null',
      GIT_CONFIG_NOSYSTEM: '1',
      GIT_ASKPASS: askpass,
      ASKPASS_MARKER: marker,
    },
    input: 'protocol=https\nhost=github.com\n\n',
  });

  assert.ifError(result.error);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /system keychain/);
  assert.equal(existsSync(marker), false);
  assert.equal(result.stdout, '');
});

test('Git push refuses configured HTTP headers without printing their values', () => {
  const launcher = fileURLToPath(new URL('./oddmash-ai', import.meta.url));
  const header = 'X-Oddmash-Test: fixture';
  const result = spawnSync(launcher, ['git', 'push', '--dry-run', 'https://github.com/Oddmash/fixture.git'], {
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_CONFIG_GLOBAL: '/dev/null',
      GIT_CONFIG_NOSYSTEM: '1',
      GIT_CONFIG_COUNT: '1',
      GIT_CONFIG_KEY_0: 'http.https://github.com/Oddmash/.extraHeader',
      GIT_CONFIG_VALUE_0: header,
      GIT_ALLOW_PROTOCOL: 'file',
    },
  });

  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /no Git HTTP extra headers/);
  assert.equal(result.stderr.includes(header), false);
  assert.equal(result.stdout, '');
});

test('Git push refuses an inherited netrc file before accessing the remote', () => {
  const launcher = fileURLToPath(new URL('./oddmash-ai', import.meta.url));
  const result = spawnSync(launcher, ['git', 'push', '--dry-run', 'https://github.com/Oddmash/fixture.git'], {
    encoding: 'utf8',
    env: { ...process.env, NETRC: '/dev/null', GIT_ALLOW_PROTOCOL: 'file' },
  });

  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /without netrc credentials/);
  assert.equal(result.stdout, '');
});

test('Git push rejects a rewritten transport and preserves GitHub HTTPS', t => {
  const directory = mkdtempSync(join(tmpdir(), 'oddmash-ai-transport-'));
  t.after(() => rmSync(directory, { recursive: true }));
  const launcher = fileURLToPath(new URL('./oddmash-ai', import.meta.url));
  const git = spawnSync('sh', ['-c', 'command -v git'], { encoding: 'utf8' });
  assert.equal(git.status, 0);
  const gitPath = git.stdout.trim();
  const destination = 'https://github.com/Oddmash/fixture.git';
  const marker = join(directory, 'push-called');
  const env = {
    ...process.env,
    GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_COUNT: '0',
    NETRC: '',
    HOME: directory,
  };
  const gitCommand = (...arguments_) => {
    const run = spawnSync('git', arguments_, { cwd: directory, env, encoding: 'utf8' });
    assert.ifError(run.error);
    assert.equal(run.status, 0, run.stderr);
  };
  gitCommand('init', '--quiet');
  gitCommand('remote', 'add', 'origin', destination);
  writeFileSync(join(directory, 'git'), [
    '#!/bin/sh',
    'case "$1" in config|remote) exec "$REAL_GIT" "$@" ;; esac',
    '[ "$GIT_ALLOW_PROTOCOL" = https ] || exit 2',
    ': > "$PUSH_MARKER"',
    '',
  ].join('\n'), { mode: 0o700 });

  const launch = () => spawnSync(launcher, ['git', 'push', 'origin', 'HEAD'], {
    cwd: directory,
    env: {
      ...env,
      PATH: directory + delimiter + process.env.PATH,
      REAL_GIT: gitPath,
      PUSH_MARKER: marker,
    },
    encoding: 'utf8',
  });

  gitCommand('config', 'url.ssh://git@github.com/.pushInsteadOf', 'https://github.com/');
  let result = launch();
  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /credential-free github.com HTTPS/);
  assert.equal(existsSync(marker), false);

  gitCommand('config', '--unset', 'url.ssh://git@github.com/.pushInsteadOf');
  result = launch();
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(existsSync(marker), true);
});

test('GitHub CLI writes reject alternate hosts before invoking gh', t => {
  const directory = mkdtempSync(join(tmpdir(), 'oddmash-ai-host-'));
  t.after(() => rmSync(directory, { recursive: true }));
  const launcher = fileURLToPath(new URL('./oddmash-ai', import.meta.url));
  const marker = join(directory, 'gh-called');
  writeFileSync(join(directory, 'gh'), [
    '#!/bin/sh',
    ': > "$GH_MARKER"',
    'case "$1 $2" in',
    '  "auth status") printf "%s\\n" keyring ;;',
    '  "auth token") printf "%s\\n" fixture-token ;;',
    '  "issue create"|"pr create") test "$3 $4" = "--repo github.com/Oddmash/fixture" ;;',
    '  "api repos/Oddmash/fixture/issues") test "$3 $4" = "--hostname github.com" ;;',
    '  *) exit 2 ;;',
    'esac',
    '',
  ].join('\n'), { mode: 0o700 });
  const launch = (...arguments_) => spawnSync(launcher, ['gh', ...arguments_], {
    cwd: directory,
    env: {
      ...process.env,
      GH_HOST: 'git.example.invalid',
      PATH: directory + delimiter + process.env.PATH,
      GH_MARKER: marker,
    },
    encoding: 'utf8',
  });

  for (const arguments_ of [
    ['issue', 'create', '--repo', 'git.example.invalid/owner/repo', '--title', 'fixture'],
    ['api', 'repos/owner/repo/issues', '--hostname', 'git.example.invalid', '-X', 'POST'],
    ['api', 'https://git.example.invalid/repos/owner/repo/issues', '-X', 'POST'],
  ]) {
    const result = launch(...arguments_);
    assert.ifError(result.error);
    assert.equal(result.status, 1, result.stderr);
    assert.equal(existsSync(marker), false);
  }

  for (const arguments_ of [
    ['issue', 'create', '--repo', 'Oddmash/fixture', '--title', 'fixture'],
    ['pr', 'create', '--repo', 'Oddmash/fixture', '--head', 'topic', '--title', 'fixture'],
    ['api', 'repos/Oddmash/fixture/issues', '-X', 'POST', '-f', 'title=fixture'],
  ]) {
    const result = launch(...arguments_);
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(existsSync(marker), true);
  }
});
