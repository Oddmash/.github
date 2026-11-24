import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const workflow = readFileSync(new URL('../.github/workflows/ci-scope.yml', import.meta.url), 'utf8');
const script = workflow.split('          script: |\n')[1].split('\n      - uses: actions/checkout')[0]
  .split('\n').map(line => line.slice(12)).join('\n');
const run = new Function('return Object.getPrototypeOf(async function () {}).constructor')();
const validate = new run('github', 'context', 'core', script);

const body = [
  '## Related issue', '', 'Refs #123', '', '## Summary', '', '- Fix keyboard focus.',
  '', '## Verification', '', '- pnpm test passed.',
  '', '## Product and design impact', '', 'None.',
  '', '## Permissions and data', '', 'None.'
].join('\n');
const makePr = (overrides = {}) => ({
  title: 'fix(ui): clarify focus', body, number: 12, commits: 1, author_association: 'MEMBER',
  head: { ref: 'fix/focus', sha: 'head', repo: { id: 1 } },
  base: { ref: 'develop', repo: { id: 1, default_branch: 'main' } },
  ...overrides
});
const commit = (message, parents = [{}]) => ({ commit: { message }, parents });

const check = async (pr, options = {}) => {
  const failures = [];
  const issueCalls = [];
  let commitCalls = 0;
  const github = {
    rest: {
      pulls: { get: async () => ({ data: pr }), listCommits: 'commits' },
      issues: { get: async ({ issue_number }) => {
        issueCalls.push(issue_number);
        if (options.missingIssue) throw new Error('not found');
        return { data: options.issue || {} };
      } }
    },
    paginate: async () => {
      commitCalls += 1;
      return options.commits || [commit('fix(ui): clarify focus')];
    }
  };
  const context = {
    repo: { owner: 'Oddmash', repo: 'example' },
    payload: { pull_request: { number: 12, head: { sha: options.eventHead || pr.head.sha } } }
  };
  const core = { setFailed: message => failures.push(message), info: () => {} };
  await validate(github, context, core);
  return { failures, issueCalls, commitCalls };
};

test('valid integration PR, local issue, conventional commit', async () => {
  const result = await check(makePr());
  assert.deepEqual(result.failures, []);
  assert.deepEqual(result.issueCalls, [123]);
  assert.equal(result.commitCalls, 1);
});

test('template placeholders and malformed title are rejected', async () => {
  const result = await check(makePr({
    title: 'fix focus',
    body: body.replace('Refs #123', 'Closes #').replace('- Fix keyboard focus.', '- What changed and why?')
      .replace('- pnpm test passed.', '- List the actual commands or checks run and their results. Note checks not run and why.')
  }));
  assert.match(result.failures.join(' '), /type-prefixed title/);
  assert.match(result.failures.join(' '), /valid issue reference/);
  assert.match(result.failures.join(' '), /Fill in the Summary/);
  assert.match(result.failures.join(' '), /Fill in the Verification/);
});

test('links in comments and fenced blocks do not satisfy the template', async () => {
  const result = await check(makePr({ body: body.replace('Refs #123', '<!-- Refs #123 -->\n~~~text\nRefs #123\n~~~') }));
  assert.match(result.failures.join(' '), /valid issue reference/);
  assert.deepEqual(result.issueCalls, []);
});

test('heading order and duplicates are rejected', async () => {
  const result = await check(makePr({ body: body.replace('## Summary', '## Verification\ncontent\n## Summary') }));
  assert.match(result.failures.join(' '), /once, in template order/);
});

test('integration closes is rejected and missing or PR references fail', async () => {
  const closed = await check(makePr({ body: body.replace('Refs #123', 'Closes #123') }));
  assert.match(closed.failures.join(' '), /Use Refs for an integration branch/);
  const missing = await check(makePr(), { missingIssue: true });
  assert.match(missing.failures.join(' '), /could not be verified/);
  const pull = await check(makePr(), { issue: { pull_request: {} } });
  assert.match(pull.failures.join(' '), /not an issue/);
});

test('default-branch release permits multiple references and skips historical subjects', async () => {
  const result = await check(makePr({
    title: 'release: update product',
    body: body.replace('Refs #123', 'Closes #123\nRefs Oddmash/.github#50\nRefs #124'),
    head: { ref: 'develop', sha: 'head', repo: { id: 1 } },
    base: { ref: 'main', repo: { id: 1, default_branch: 'main' } }
  }));
  assert.deepEqual(result.failures, []);
  assert.deepEqual(result.issueCalls, [123, 124]);
  assert.equal(result.commitCalls, 0);
});

test('fork contributions use metadata validation without rewriting commit history', async () => {
  const result = await check(makePr({ author_association: 'CONTRIBUTOR', head: { ref: 'patch-1', sha: 'head', repo: { id: 2 } } }));
  assert.deepEqual(result.failures, []);
  assert.equal(result.commitCalls, 0);
});

test('bad topic commit is rejected, merge commit ignored', async () => {
  const result = await check(makePr({ commits: 3 }), {
    commits: [commit('Merge branch', [{}, {}]), commit('fix: change focus'), commit('misc updates')]
  });
  assert.match(result.failures.join(' '), /Commit 3 needs a type-prefixed subject/);
});

test('old event head cannot validate a newer revision', async () => {
  const result = await check(makePr(), { eventHead: 'old' });
  assert.match(result.failures.join(' '), /head changed/);
  assert.equal(result.commitCalls, 0);
});
