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
  const warnings = [];
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
  const core = { setFailed: message => failures.push(message), warning: message => warnings.push(message), info: () => {} };
  await validate(github, context, core);
  assert.deepEqual(failures, options.eventHead === 'old' ? ['PR head changed; wait for the current revision check.'] : []);
  return { failures, warnings, issueCalls, commitCalls };
};

test('valid integration PR, local issue, conventional commit', async () => {
  const result = await check(makePr());
  assert.deepEqual(result.warnings, []);
  assert.deepEqual(result.issueCalls, [123]);
  assert.equal(result.commitCalls, 1);
});

test('template placeholders and malformed title produce warnings', async () => {
  const result = await check(makePr({
    title: 'fix focus',
    body: body.replace('Refs #123', 'Closes #').replace('- Fix keyboard focus.', '- What changed and why?')
      .replace('- pnpm test passed.', '- List the actual commands or checks run and their results. Note checks not run and why.')
  }));
  assert.match(result.warnings.join(' '), /type-prefixed title/);
  assert.match(result.warnings.join(' '), /valid issue reference/);
  assert.match(result.warnings.join(' '), /Fill in the Summary/);
  assert.match(result.warnings.join(' '), /Fill in the Verification/);
});

test('links in comments and fenced blocks do not satisfy the template', async () => {
  const result = await check(makePr({ body: body.replace('Refs #123', '<!-- Refs #123 -->\n~~~text\nRefs #123\n~~~') }));
  assert.match(result.warnings.join(' '), /valid issue reference/);
  assert.deepEqual(result.issueCalls, []);
});

test('heading order and duplicates produce warnings', async () => {
  const result = await check(makePr({ body: body.replace('## Summary', '## Verification\ncontent\n## Summary') }));
  assert.match(result.warnings.join(' '), /once, in template order/);
});

test('integration closes and missing or PR references produce warnings', async () => {
  const closed = await check(makePr({ body: body.replace('Refs #123', 'Closes #123') }));
  assert.match(closed.warnings.join(' '), /Use Refs for an integration branch/);
  const missing = await check(makePr(), { missingIssue: true });
  assert.match(missing.warnings.join(' '), /could not be verified/);
  const pull = await check(makePr(), { issue: { pull_request: {} } });
  assert.match(pull.warnings.join(' '), /not an issue/);
});

test('default-branch release permits multiple references and skips historical subjects', async () => {
  const result = await check(makePr({
    title: 'release: update product',
    body: body.replace('Refs #123', 'Closes #123\nRefs Oddmash/.github#50\nRefs #124'),
    head: { ref: 'develop', sha: 'head', repo: { id: 1 } },
    base: { ref: 'main', repo: { id: 1, default_branch: 'main' } }
  }));
  assert.deepEqual(result.warnings, []);
  assert.deepEqual(result.issueCalls, [123, 124]);
  assert.equal(result.commitCalls, 0);
});

test('fork contributions use metadata validation without rewriting commit history', async () => {
  const result = await check(makePr({ author_association: 'CONTRIBUTOR', head: { ref: 'patch-1', sha: 'head', repo: { id: 2 } } }));
  assert.deepEqual(result.warnings, []);
  assert.equal(result.commitCalls, 0);
});

test('bad topic commit produces a warning, merge commit ignored', async () => {
  const result = await check(makePr({ commits: 3 }), {
    commits: [commit('Merge branch', [{}, {}]), commit('fix: change focus'), commit('misc updates')]
  });
  assert.match(result.warnings.join(' '), /Commit 3 needs a type-prefixed subject/);
});

test('old event head cannot validate a newer revision', async () => {
  const result = await check(makePr(), { eventHead: 'old' });
  assert.match(result.failures.join(' '), /head changed/);
  assert.deepEqual(result.warnings, []);
  assert.equal(result.commitCalls, 0);
});

test('recent local issue forms accept required headings and correct type', async () => {
  const result = await check(makePr(), { issue: {
    created_at: '2026-11-24T08:31:35Z',
    labels: [{ name: 'type: chore' }, { name: 'area: workflow' }],
    body: '### Context\n\nMaintain CI.\n\n### Proposed maintenance\n\nAdd checks.\n\n### Impact and risks\n\nNone.\n\n### Acceptance criteria\n\n- [ ] Checks pass.'
  } });
  assert.deepEqual(result.warnings, []);
});

test('recent API-created issue needs a supported type and filled fields', async () => {
  const issue = { created_at: '2026-11-25T00:00:00Z', body: 'Missing fields.' };
  const untyped = await check(makePr(), { issue: { ...issue, labels: [] } });
  assert.match(untyped.warnings.join(' '), /exactly one supported issue-form type label/);
  const malformed = await check(makePr(), { issue: { ...issue, labels: [{ name: 'type: fix' }], body: '## Problem\n\nConfirmed problem.\n\n## Scope\n\n_No response_' } });
  assert.match(malformed.warnings.join(' '), /must fill its Scope field/);
  assert.match(malformed.warnings.join(' '), /must fill its Acceptance criteria field/);
});

test('legacy local issues remain linkable without retroactive format enforcement', async () => {
  const result = await check(makePr(), { issue: { created_at: '2026-11-24T08:31:34Z', labels: [], body: 'Legacy issue.' } });
  assert.deepEqual(result.warnings, []);
});

test('topic PRs require a single issue and release links may not repeat an issue', async () => {
  const topic = await check(makePr({ body: body.replace('Refs #123', 'Refs #123\nRefs #124') }));
  assert.match(topic.warnings.join(' '), /exactly one scoped issue reference/);
  const duplicate = await check(makePr({
    body: body.replace('Refs #123', 'Closes #123\nRefs #123'),
    head: { ref: 'develop', sha: 'head', repo: { id: 1 } },
    base: { ref: 'main', repo: { id: 1, default_branch: 'main' } }
  }));
  assert.match(duplicate.warnings.join(' '), /List each linked issue once/);
});

test('default branch synchronization preserves historical commit subjects', async () => {
  const result = await check(makePr({ head: { ref: 'main', sha: 'head', repo: { id: 1 } } }), { commits: [commit('historical subject')] });
  assert.deepEqual(result.warnings, []);
  assert.equal(result.commitCalls, 0);
});

test('acceptance criteria support ordinary bullets and checkboxes but reject prose and empty items', async () => {
  const prefix = '### Context\nMaintain CI.\n### Proposed maintenance\nAdd checks.\n### Impact and risks\nNone.\n### Acceptance criteria\n';
  const issue = { created_at: '2026-11-25T00:00:00Z', labels: [{ name: 'type: chore' }] };
  const good = await check(makePr(), { issue: { ...issue, body: prefix + '- Existing tests pass.\n- [ ] New checks pass.' } });
  assert.deepEqual(good.failures, []);
  const bad = await check(makePr(), { issue: { ...issue, body: prefix + 'Existing tests pass.' } });
  assert.match(bad.warnings.join(' '), /Markdown bullets or checkboxes/);
  const empty = await check(makePr(), { issue: { ...issue, body: prefix + '- Existing tests pass.\n- [ ]' } });
  assert.match(empty.warnings.join(' '), /Markdown bullets or checkboxes/);
});
