# AI code review plan

Oddmash uses a maintainer-enabled central review service for public organization repositories and explicitly approved private organization repositories. Internal and personal repositories remain excluded. The service uses the smallest useful permission set.

## Phase 1: completed advisory pilot (historical)

- The initial pilot installed a GitHub App only on selected repositories. This was a pilot-only restriction, superseded by the maintainer-approved public organization rollout in Phase 3.
- Grant read access to repository metadata, pull requests, contents, and checks, plus write access to pull request review comments.
- Read the changed files, relevant root and nested `AGENTS.md` files, repository-specific review rules, the pull request description, and completed check results.
- Combine deterministic evidence from ESLint or the repository's equivalent linter, the implementation language's compiler or static checks, and test results with AI analysis. Reference existing failures instead of repeating their output.
- Prioritize actual bugs, security and privacy defects, performance regressions, and accessibility problems over style preferences. Review visual and interaction changes against the repository's design documents rather than a generic Oddmash aesthetic.
- Include file evidence, severity, confidence, and a concrete verification step for every finding. Avoid duplicate comments across reruns and overlapping tools.
- Do not approve or request changes in the report-only pilot. Never modify branches, expose secrets, publish artifacts, merge, or deploy.

Start with a low-risk public repository and run in report-only mode before posting comments. Compare findings with maintainer review, track false positives, redact sensitive content, and cap diff size and model spend.

## Phase 2: repository policies

- Let each repository define review focus and exclusions in `AGENTS.md` without copying product-specific rules into the organization baseline. Nested `AGENTS.md` files override broader guidance for their scope.
- Combine deterministic CI results with AI analysis. The bot should reference failing checks instead of rephrasing them.
- Deduplicate findings by repository, pull request, commit, file, line, and rule. Update or resolve its own stale comments when the code changes.
- Keep review logs minimal, define retention, and never store source or prompts longer than required to complete and audit the review.

## Phase 3: organization-wide review rollout

- The maintainer has enabled organization-wide installation and explicitly authorized automatic enrollment of current and future public Oddmash repositories, without requiring a separate review workflow in each repository. Validate the organization, installation, repository identity and permitted visibility at runtime; do not execute contributed code.
- Private repositories may use the central reviewer only under a separately approved repository identity allowlist and data-processing policy. New private repositories are not enrolled automatically. Internal and personal repositories remain excluded. Private auto-merge is prohibited.
- Keep organization and personal installations separate so a repository transfer is not required for review coverage.
- Add a non-blocking status check only after the pilot demonstrates stable precision. For a maintainer-enabled independent App, approval requires zero validated findings, no omitted files, and passing current checks. Request changes only for high-confidence actionable findings; incomplete evidence requires a comment and maintainer review. Automatic release and secret access remain out of scope. The advisory reviewer does not merge.

Success means fewer escaped defects without adding noisy review work. Track accepted findings, dismissed findings, duplicate rate, review latency, cost per pull request, and any permission or data-handling incident.

## Phase 4: maintainer-only auto-merge

- The same GitHub App uses a separate deterministic merge policy. It is limited to maintainer-authored, same-repository PRs into protected main in Kowrap, Oddmash UI, Interaction Inspector, and Vertactics. New repositories, private repositories, external contributors, and organization-policy changes remain manual.
- Require a single linked maintainer-authored open issue with explicit acceptance criteria, validated evidence for every criterion and the full issue scope, zero review findings, exact-head App approval, and all current checks passing. Missing or ambiguous evidence leaves the PR open.
- Eligible changes include ordinary Markdown documentation, allowlisted product source paths, and additive tests that do not remove assertions or disable tests. Architecture, configuration, generated code, permissions, releases, sensitive paths, test rewrites and policy changes require manual review.
- Enforce GitHub Actions verify on main, require an up-to-date branch, never bypass branch protection, and scope the short-lived write token to the eligible repository only. Use the verified head SHA for a normal merge commit. Do not squash or rebase. Keep a deployment kill switch; failure leaves the PR open.
