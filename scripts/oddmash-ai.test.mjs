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
