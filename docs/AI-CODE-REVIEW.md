# AI code review plan

Oddmash uses a maintainer-enabled central review service for public organization repositories. Private, internal, and personal repositories remain excluded unless separately approved. The service uses the smallest useful permission set.

## Phase 1: advisory pilot

- Install a GitHub App only on selected repositories.
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

## Phase 3: organization-wide public repository rollout

- The maintainer may enable a central GitHub App webhook for public Oddmash repositories, including future public repositories, without a per-repository review workflow. Validate the organization, installation and public repository at runtime; do not execute contributed code.
- Private and internal repositories remain outside the central reviewer. Expansion to them or personal repositories requires separate explicit approval and data-handling review.
- Keep organization and personal installations separate so a repository transfer is not required for review coverage.
- Add a non-blocking status check only after the pilot demonstrates stable precision. For a maintainer-enabled independent App, approval requires zero validated findings, no omitted files, and passing current checks. Request changes only for high-confidence actionable findings; incomplete evidence requires a comment and maintainer review. Automated merge, release, and secret access remain out of scope.

Success means fewer escaped defects without adding noisy review work. Track accepted findings, dismissed findings, duplicate rate, review latency, cost per pull request, and any permission or data-handling incident.
