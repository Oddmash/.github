# Contributing to Oddmash

**English** · [한국어](https://github.com/Oddmash/.github/blob/main/docs/ko/CONTRIBUTING.md) · [日本語](https://github.com/Oddmash/.github/blob/main/docs/ja/CONTRIBUTING.md) · [简体中文](https://github.com/Oddmash/.github/blob/main/docs/zh-CN/CONTRIBUTING.md)

Thanks for helping improve an Oddmash project.

Oddmash is a one-person independent software studio. Public repositories welcome focused, voluntary contributions, but there is no standing recruitment program or expectation that contributors join a long-term community. Maintainer priorities and each project's published scope determine what can be accepted.

## Contribution language

Use English for issue and pull request titles, bodies, public review discussions, contribution templates, commit messages, and changelog entries in all public repositories. Product READMEs and user-facing documentation retain their existing localization policies. Provide translation help when needed; do not rewrite historical contributions.

## Issue labels

Select one issue type from the shared template chooser: `type: bug`, `type: fix`, `type: feature`, `type: improvement`, `type: documentation`, `type: refactor`, `type: test`, or `type: chore`. Add relevant `area:` labels for filtering. Preserve project-specific labels; use `good first issue` only when intentionally inviting first-time contributors. Existing PR classification retains its legacy `type: bug` and `type: docs` labels.

The shared [issue label catalog](.github/workflows/oddmash-issue-labels.yml) creates or updates only its managed labels. Each repository calls the reusable workflow with `issues: write` and a reviewed immutable commit reference. The caller runs after adding or updating it on the repository's approved integration or main branch, and can also run manually when needed. It does not change issue assignments, reviewer labels, merge settings, or permissions beyond the caller's repository scope.

## Report a problem

Open an issue in the relevant project. Describe what you expected, what happened, and how to reproduce it. Include the project version and relevant environment details. Use public or local fixtures with synthetic values. Remove credentials, private page contents, and personal data from logs and screenshots.

## Propose a change

Open an issue first for a new feature or a change that affects several parts of a project. Even a small implementation change needs a focused issue and an explicit PR reference.

## Project README standard

- Use the README as the product introduction. Open with what the product does, who it helps, and one concrete use case.
- Show the product in action with a screenshot, short recording, gameplay capture, or demo. Add descriptive alt text. Label illustrations as previews and use sample data in visuals.
- Keep repository setup, installation, local-run commands, implementation notes, build steps, tests, releases, and contributor workflows out of the README.
- Put all development and verification instructions in the project's `CONTRIBUTING.md`. Link to it briefly from the README footer when useful.
- Keep the English, Korean, Japanese, and Simplified Chinese versions in sync, including language links and visuals.

## Shared Node checks

Use `.github/workflows/node-ci.yml` for repositories whose checks run through `pnpm run ci` after `pnpm install --frozen-lockfile`. Call `Oddmash/.github/.github/workflows/node-ci.yml@<commit-sha>` from a job with `contents: read`. The caller owns its triggers. Set `working-directory` when the independent pnpm project is below the repository root and commit its `package.json` with the shared `packageManager` pin and `pnpm-lock.yaml` there. `node-version` defaults to 24 and `ignore-install-scripts` defaults to false. Keep workflows with their own browser setup or compatibility matrix in the product repository. Existing pinned callers must migrate through separate reviewed PRs; consumer installation and npm registry publication are not affected.

## Shared development baseline

- Keep repository-specific working agreements in the root `AGENTS.md`. Start from the [organization baseline](AGENTS.md), then add only the product, privacy, release, engine, UI, and design rules that the project actually needs.
- Keep CI permissions minimal and pin reusable workflows to a reviewed commit. Product repositories own their runtime matrix, browser or engine setup, deployment, and release checks.
- Keep product-specific UI and visual rules in the project. Promote tokens or components to a shared package only after more than one product needs the same stable behavior.
- Never put credentials, signing material, user data, or production-only values in examples, fixtures, logs, screenshots, prompts, or review comments.
- Specialist reviews are advisory; Lead may issue a formal review under the [organization review policy](docs/AI-CODE-REVIEW.md). A separate authorized merge gate is not review authority. Let the initial review run automatically. For an authorized manual full review, use `/review` alone on the first non-empty line of a PR Conversation comment; optional context follows on later lines. See the [command table](https://github.com/Oddmash/oddmash-agents/blob/main/docs/agent-family.md#slash-commands).
- Reply in the original review thread with `Fixed in <full-current-head-sha>: <change and verification>` after a verified fix, `Not adopted: <reason and evidence>` when declining, or `Deferred: <reason and linked issue>` when postponing. Never claim an unmade fix. Resolve after verification or an explicit authorized maintainer decision; otherwise leave outstanding findings open. Check the actual thread state. Resolution is not CI success or approval. See [review follow-up](docs/AI-CODE-REVIEW.md#following-up-on-review-findings).

## Submit a pull request

- Open PRs as ready for review by default, even while remote CI or review is pending. Reserve drafts for an explicit request, materially incomplete implementation, or missing essential evidence that makes review misleading; state the reason and mark ready when resolved.
- Keep changes focused and link the related issue. Use `Refs #123` for integration branches or partial work and `Closes #123` only when the completed work merges into the default branch. Use one scoped reference for topic or synchronization PRs and list each distinct included issue in release PRs. Write measurable acceptance criteria as Markdown bullets or checkboxes. Multi-issue release PRs are valid and require manual merge after CI and review.
- Follow the project's `CONTRIBUTING.md` for setup and checks. Include the results in your pull request.
- Explain changes to permissions, captured data, public APIs, deployment, or release behavior.

## Contribution format checks

- Use the shared [PR template](PULL_REQUEST_TEMPLATE.md). Titles and maintainer topic-branch commit subjects use a type prefix, optionally with a scope: `fix: clarify focus`, `docs(api): update examples`. Existing history, merge commits, external fork commit subjects and the `develop` to default-branch release history are not rewritten.
- Fill every required section with issue references, scope, verification results, product/design impact, and permissions/data impact. Write `None` only when an impact section genuinely does not apply. A structural check can detect blank sections or template placeholders, not whether claims are true or whether prose is English. Review still verifies actual results.
- The shared issue forms preserve the eight issue types and require relevant fields in the public-repository web form. GitHub does not require form fields for private repositories; API and CLI creation, edits, and maintainer blank issues can bypass the form. Agents must read the selected form and validate the issue body and labels before creating or linking an issue; do not claim issue creation is blocked for every client.
- The change-aware [CI scope](.github/workflows/ci-scope.yml) validates PR metadata through read-only GitHub API calls before checking out source. It verifies local issue references actually identify issues; cross-repository references are checked structurally, not fetched outside the caller token's repository scope. Local issues created at or after 2026-11-24 08:31:35 UTC (the issue introducing this policy) must also have exactly one supported issue type label and the required form sections filled. Earlier issues remain linkable without retroactive formatting changes. Invalid metadata fails the same scope job whose result is required by the existing aggregate verification job.
- On each caller, pin the reviewed scope revision, grant only `contents: read`, `issues: read` and `pull-requests: read` to the scope call, and trigger PR workflows on `opened`, `reopened`, `synchronize`, `edited` and `ready_for_review`. Preserve existing checks, permission boundaries and required aggregate status names. Confirm required-status configuration on protected branches so a failed validation actually blocks merging. Previously pinned callers only adopt these checks after their own reviewed migration; the default community templates alone do not install workflows.
- Refs and Closes follow the branch policy above. The independently reviewed auto-merge policy accepts one same-repository standalone Refs or Closes reference with measurable acceptance evidence. Multi-issue releases and cross-repository references are valid for manual merging. Do not falsify an issue-closing reference merely to satisfy automation.
