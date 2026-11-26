import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

test('Only the internal Git helper can supply credentials for the assigned HTTPS host', t => {
  const { directory, env } = gitRepository(t);
  const launcher = fileURLToPath(new URL('./oddmash-ai', import.meta.url));
  const git = spawnSync('sh', ['-c', 'command -v git'], { encoding: 'utf8' });
  assert.equal(git.status, 0);
  const askpassMarker = join(directory, 'askpass-used');
  const credentialProtocol = join(directory, 'git-credential-response');
  const lookupMarker = join(directory, 'keychain-used');
  writeFileSync(join(directory, 'uname'), '#!/bin/sh\nprintf "%s\\n" Linux\n', { mode: 0o700 });
  writeFileSync(join(directory, 'secret-tool'), [
    '#!/bin/sh',
    ': > "$LOOKUP_MARKER"',
    '[ "$FIXTURE_KEYCHAIN_AVAILABLE" = yes ] || exit 1',
    'printf "%s\\n" fixture_ai_token',
    '',
  ].join('\n'), { mode: 0o700 });
  writeFileSync(join(directory, 'gh'), '#!/bin/sh\nprintf "%s\\n" arvynoo:264418006\n', { mode: 0o700 });
  writeFileSync(join(directory, 'askpass'), '#!/bin/sh\n: > "$ASKPASS_MARKER"\n', { mode: 0o700 });
  writeFileSync(join(directory, 'git'), [
    '#!/bin/sh',
    'case " $* " in *" config "*|*" remote "*) exec "$REAL_GIT" "$@" ;; esac',
    'while [ "$1" = -c ]; do',
    '  case "$2" in credential.https://github.com.helper=*) helper_option=$2 ;; esac',
    '  shift 2',
    'done',
    '[ "$*" = "push origin HEAD" ] && [ -n "${helper_option:-}" ] || exit 2',
    'printf "protocol=https\\nhost=github.com\\nusername=arvynoo\\n\\n" |',
    '  "$REAL_GIT" -c credential.helper= -c "$helper_option" credential fill > "$CREDENTIAL_PROTOCOL"',
    '',
  ].join('\n'), { mode: 0o700 });
  const childEnv = {
    ...env,
    PATH: directory + delimiter + process.env.PATH,
    REAL_GIT: git.stdout.trim(),
    GIT_ASKPASS: join(directory, 'askpass'),
    ASKPASS_MARKER: askpassMarker,
    CREDENTIAL_PROTOCOL: credentialProtocol,
    LOOKUP_MARKER: lookupMarker,
  };
  const launch = (available, ...arguments_) => spawnSync(launcher, arguments_, {
    cwd: directory,
    env: { ...childEnv, FIXTURE_KEYCHAIN_AVAILABLE: available },
    encoding: 'utf8',
  });

  for (const arguments_ of [['credential', 'get'], ['git', 'credential', 'fill']]) {
    const result = launch('yes', ...arguments_);
    assert.ifError(result.error);
    assert.notEqual(result.status, 0);
    assert.equal(result.stdout, '');
    assert.equal(existsSync(lookupMarker), false);
  }

  const helper = fileURLToPath(new URL('./oddmash-ai-keychain.sh', import.meta.url));
  const unsupportedHost = spawnSync('sh', ['-c', '. "$1"; git_github_credential', 'helper', helper], {
    env: { ...childEnv, FIXTURE_KEYCHAIN_AVAILABLE: 'yes' },
    input: 'protocol=https\nhost=git.example.invalid\n\n',
    encoding: 'utf8',
  });
  assert.ifError(unsupportedHost.error);
  assert.equal(unsupportedHost.status, 1);
  assert.equal(unsupportedHost.stdout, '');
  assert.equal(existsSync(lookupMarker), false);

  const missingKeychain = launch('no', 'git', 'push', 'origin', 'HEAD');
  assert.ifError(missingKeychain.error);
  assert.notEqual(missingKeychain.status, 0);
  assert.match(missingKeychain.stderr, /system keychain/);
  assert.equal(existsSync(askpassMarker), false);
  assert.equal(readFileSync(credentialProtocol, 'utf8'), '');

  const approved = launch('yes', 'git', 'push', 'origin', 'HEAD');
  assert.ifError(approved.error);
  assert.equal(approved.status, 0, approved.stderr);
  assert.equal(approved.stdout, '');
  assert.match(readFileSync(credentialProtocol, 'utf8'), /^password=fixture_ai_token$/m);
});

function gitRepository(t) {
  const directory = mkdtempSync(join(tmpdir(), 'oddmash-ai-repository-'));
  t.after(() => rmSync(directory, { recursive: true }));
  const env = {
    ...process.env,
    GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_COUNT: '0',
    NETRC: '',
    HOME: directory,
  };
  delete env.GIT_SSL_NO_VERIFY;
  const gitCommand = (...arguments_) => {
    const result = spawnSync('git', arguments_, { cwd: directory, env, encoding: 'utf8' });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  const destination = 'https://github.com/Oddmash/fixture.git';
  gitCommand('init', '--quiet');
  gitCommand('remote', 'add', 'origin', destination);
  return { directory, env, gitCommand, destination };
}

test('Git push refuses configured HTTP headers without printing their values', t => {
  const { directory, env, gitCommand } = gitRepository(t);
  const launcher = fileURLToPath(new URL('./oddmash-ai', import.meta.url));
  const header = 'X-Oddmash-Test: fixture';
  gitCommand('config', 'http.https://github.com/Oddmash/.extraHeader', header);

  const result = spawnSync(launcher, ['git', 'push', '--dry-run', 'origin', 'HEAD'], {
    cwd: directory,
    encoding: 'utf8',
    env: { ...env, GIT_ALLOW_PROTOCOL: 'file' },
  });

  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /no Git HTTP extra headers/);
  assert.equal(result.stderr.includes(header), false);
  assert.equal(result.stdout, '');
});

test('Git push refuses an inherited netrc file before accessing the remote', t => {
  const { directory, env } = gitRepository(t);
  const launcher = fileURLToPath(new URL('./oddmash-ai', import.meta.url));
  const result = spawnSync(launcher, ['git', 'push', '--dry-run', 'origin', 'HEAD'], {
    cwd: directory,
    encoding: 'utf8',
    env: { ...env, NETRC: '/dev/null', GIT_ALLOW_PROTOCOL: 'file' },
  });

  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /without netrc credentials/);
  assert.equal(result.stdout, '');
});

test('Git push rejects a rewritten transport and disables destination-specific redirects', t => {
  const { directory, env, gitCommand, destination } = gitRepository(t);
  const launcher = fileURLToPath(new URL('./oddmash-ai', import.meta.url));
  const git = spawnSync('sh', ['-c', 'command -v git'], { encoding: 'utf8' });
  assert.equal(git.status, 0);
  const gitPath = git.stdout.trim();
  const marker = join(directory, 'push-called');
  writeFileSync(join(directory, 'git'), [
    '#!/bin/sh',
    'case " $* " in *" config "*|*" remote "*) exec "$REAL_GIT" "$@" ;; esac',
    '[ "$GIT_ALLOW_PROTOCOL" = https ] || exit 2',
    '[ "$GIT_TRACE_REDACT" = 1 ] || exit 5',
    '[ -z "${GIT_TRACE_CURL+x}${GIT_CURL_VERBOSE+x}" ] || exit 6',
    'while [ "$1" = -c ]; do',
    '  case "$2" in http.*.followRedirects=false) redirect_setting=$2 ;; esac',
    '  shift 2',
    'done',
    '[ "$*" = "push origin HEAD" ] || exit 3',
    '[ -n "${redirect_setting:-}" ] || exit 4',
    '"$REAL_GIT" -c "$redirect_setting" config --type=bool --get-urlmatch http.followRedirects "$PUSH_URL" > "$PUSH_MARKER"',
    '',
  ].join('\n'), { mode: 0o700 });

  const launch = () => spawnSync(launcher, ['git', 'push', 'origin', 'HEAD'], {
    cwd: directory,
    env: {
      ...env,
      PATH: directory + delimiter + process.env.PATH,
      REAL_GIT: gitPath,
      PUSH_MARKER: marker,
      PUSH_URL: destination,
      GIT_TRACE_REDACT: '0',
      GIT_TRACE_CURL: '1',
      GIT_CURL_VERBOSE: '1',
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
  gitCommand('config', '--add', 'remote.origin.pushurl', destination);
  gitCommand('config', '--add', 'remote.origin.pushurl', 'https://github.com/Oddmash/other.git');
  result = launch();
  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /one credential-free github.com HTTPS destination/);
  assert.equal(existsSync(marker), false);
  gitCommand('config', '--unset-all', 'remote.origin.pushurl');
  gitCommand('config', 'remote.origin.pushurl', 'https://fixture@github.com/Oddmash/fixture.git');
  result = launch();
  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /credential-free github.com HTTPS/);
  assert.equal(existsSync(marker), false);
  gitCommand('config', '--unset', 'remote.origin.pushurl');

  gitCommand('config', `http.${destination}.followRedirects`, 'true');
  assert.equal(gitCommand('config', '--get-urlmatch', 'http.followRedirects', destination), 'true');
  result = launch();
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(readFileSync(marker, 'utf8').trim(), 'false');
});

test('Git push refuses disabled TLS verification before authenticating', t => {
  const { directory, env, gitCommand, destination } = gitRepository(t);
  const launcher = fileURLToPath(new URL('./oddmash-ai', import.meta.url));
  const marker = join(directory, 'auth-called');
  writeFileSync(join(directory, 'gh'), '#!/bin/sh\n: > "$AUTH_MARKER"\nexit 2\n', { mode: 0o700 });
  const launch = (overrides = {}) => spawnSync(launcher, ['git', 'push', 'origin', 'HEAD'], {
    cwd: directory,
    encoding: 'utf8',
    env: {
      ...env,
      PATH: directory + delimiter + process.env.PATH,
      AUTH_MARKER: marker,
      ...overrides,
    },
  });
  const assertRefused = result => {
    assert.ifError(result.error);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /requires TLS certificate verification/);
    assert.equal(existsSync(marker), false);
  };

  gitCommand('config', 'http.sslVerify', 'true');
  assertRefused(launch({ GIT_SSL_NO_VERIFY: '1' }));
  gitCommand('config', `http.${destination}.sslVerify`, 'false');
  assertRefused(launch());
});

test('Git commits set both identities and reject forms that reuse authorship', t => {
  const { directory, env, gitCommand } = gitRepository(t);
  const launcher = fileURLToPath(new URL('./oddmash-ai', import.meta.url));
  const launch = (...arguments_) => spawnSync(launcher, ['git', 'commit', ...arguments_], {
    cwd: directory,
    encoding: 'utf8',
    env,
  });

  writeFileSync(join(directory, 'initial.txt'), 'initial');
  gitCommand('add', 'initial.txt');
  gitCommand('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-m', 'initial');
  const previousHead = gitCommand('rev-parse', 'HEAD');

  writeFileSync(join(directory, 'changes.txt'), 'changes');
  gitCommand('add', 'changes.txt');
  for (const arguments_ of [
    ['--author=Fixture <fixture@example.invalid>', '-m', 'override'],
    ['--amend', '--no-edit'],
    ['-C', 'HEAD'],
    ['--fixup=amend:HEAD'],
  ]) {
    const result = launch(...arguments_);
    assert.ifError(result.error);
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, /Author overrides and history reuse/);
    assert.equal(gitCommand('rev-parse', 'HEAD'), previousHead);
  }

  const cherryPickHead = join(directory, gitCommand('rev-parse', '--git-path', 'CHERRY_PICK_HEAD'));
  writeFileSync(cherryPickHead, previousHead + '\n');
  const cherryPick = launch('-m', 'reuse cherry-pick author');
  assert.ifError(cherryPick.error);
  assert.equal(cherryPick.status, 1, cherryPick.stderr);
  assert.match(cherryPick.stderr, /Complete history operations/);
  assert.equal(gitCommand('rev-parse', 'HEAD'), previousHead);
  rmSync(cherryPickHead);

  const commit = launch('-m', 'ordinary commit');
  assert.ifError(commit.error);
  assert.equal(commit.status, 0, commit.stderr);
  assert.equal(gitCommand('show', '-s', '--format=%an <%ae>|%cn <%ce>'), [
    'arvynoo <264418006+arvynoo@users.noreply.github.com>',
    'arvynoo <264418006+arvynoo@users.noreply.github.com>',
  ].join('|'));
});

test('GitHub CLI writes reject alternate hosts before invoking gh', t => {
  const directory = mkdtempSync(join(tmpdir(), 'oddmash-ai-host-'));
  t.after(() => rmSync(directory, { recursive: true }));
  const launcher = fileURLToPath(new URL('./oddmash-ai', import.meta.url));
  const marker = join(directory, 'gh-called');
  const keychain = join(directory, 'keychain-queries');
  writeFileSync(join(directory, 'uname'), '#!/bin/sh\nprintf "%s\\n" Linux\n', { mode: 0o700 });
  writeFileSync(join(directory, 'secret-tool'), [
    '#!/bin/sh',
    'printf "%s\\n" "$*" >> "$KEYCHAIN_QUERIES"',
    'case "$*" in',
    '  "lookup service gh:github.com username arvynoo") printf "%s\\n" fixture_ai_token ;;',
    '  "lookup service gh:github.com username qtaghdi") printf "%s\\n" fixture_owner_token ;;',
    '  *) exit 2 ;;',
    'esac',
    '',
  ].join('\n'), { mode: 0o700 });
  writeFileSync(join(directory, 'gh'), [
    '#!/bin/sh',
    ': > "$GH_MARKER"',
    '[ "$GH_TOKEN" = fixture_ai_token ] && [ -z "${GH_DEBUG+x}" ] || exit 3',
    'case "$1 $2" in',
    '  "api user")',
    '    [ "$3 $4 $5" = "--hostname github.com --jq" ] || exit 4',
    '    printf "%s\\n" arvynoo:264418006 ;;',
    '  "issue create"|"pr create") test "$3 $4" = "--repo github.com/Oddmash/fixture" ;;',
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
      KEYCHAIN_QUERIES: keychain,
      GH_DEBUG: 'api',
    },
    encoding: 'utf8',
  });

  for (const arguments_ of [
    ['issue', 'create', '--repo', 'git.example.invalid/owner/repo', '--title', 'fixture'],
    ['api', 'repos/owner/repo/issues', '--hostname', 'git.example.invalid', '-X', 'POST'],
    ['api', 'https://git.example.invalid/repos/owner/repo/issues', '-X', 'POST'],
    ['api', 'repos/Oddmash/fixture/actions/artifacts/1/zip'],
    ['api', 'repos/owner/repo/issues', '--hostname=git.example.invalid', '-X', 'POST'],
    ['issue', 'create', '--repo', 'Oddmash/fixture', '--repo', 'git.example.invalid/owner/repo'],
    ['pr', 'create', '--repo', 'Oddmash/fixture', '--head', ''],
    ['pr', 'create', '--repo', 'Oddmash/fixture', '--title', 'fixture'],
  ]) {
    const result = launch(...arguments_);
    assert.ifError(result.error);
    assert.equal(result.status, 1, result.stderr);
    assert.equal(existsSync(marker), false);
    assert.equal(existsSync(keychain), false);
  }

  const identity = launch('api', 'user', '--jq', '.login');
  assert.ifError(identity.error);
  assert.equal(identity.status, 0, identity.stderr);
  assert.equal(identity.stdout.trim(), 'arvynoo');

  for (const arguments_ of [
    ['issue', 'create', '--repo', 'Oddmash/fixture', '--title', 'fixture'],
    ['pr', 'create', '--repo', 'Oddmash/fixture', '--head', 'topic', '--title', 'fixture'],
  ]) {
    const result = launch(...arguments_);
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(existsSync(marker), true);
  }
  assert.deepEqual(readFileSync(keychain, 'utf8').trim().split('\n'), Array(3).fill(
    'lookup service gh:github.com username arvynoo',
  ));
});
