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
  const authorization = 'Authorization: Basic fixture';
  const result = spawnSync(launcher, ['git', 'push', '--dry-run', 'https://github.com/Oddmash/fixture.git'], {
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_CONFIG_GLOBAL: '/dev/null',
      GIT_CONFIG_NOSYSTEM: '1',
      GIT_CONFIG_COUNT: '1',
      GIT_CONFIG_KEY_0: 'http.https://github.com/Oddmash/.extraHeader',
      GIT_CONFIG_VALUE_0: authorization,
      GIT_ALLOW_PROTOCOL: 'file',
    },
  });

  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /no Git HTTP extra headers/);
  assert.equal(result.stderr.includes(authorization), false);
  assert.equal(result.stdout, '');
});
