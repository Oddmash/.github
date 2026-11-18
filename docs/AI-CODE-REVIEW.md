# AI code review plan

Oddmash plans to use one review service across selected organization and personal repositories without requiring repositories to move owners. Adoption is opt-in and starts with the smallest useful permission set.

## Phase 1: advisory pilot

- Install a GitHub App only on selected repositories.
- Grant read access to repository metadata, pull requests, contents, and checks, plus write access to pull request review comments.
- Read the changed files, relevant root and nested `AGENTS.md` files, the pull request description, and completed check results.
- Report only high-confidence correctness, security, privacy, accessibility, performance, and release risks. Include file evidence, severity, confidence, and a concrete verification step.
- Do not approve, request changes as a blocking gate, modify branches, expose secrets, publish artifacts, merge, or deploy.

Start with a low-risk public repository and run in report-only mode before posting comments. Compare findings with maintainer review, track false positives, redact sensitive content, and cap diff size and model spend.

## Phase 2: repository policies

- Let each repository define review focus and exclusions in `AGENTS.md` without copying product-specific rules into the organization baseline.
- Combine deterministic CI results with AI analysis. The bot should reference failing checks instead of rephrasing them.
- Deduplicate findings by repository, pull request, commit, file, line, and rule. Update or resolve its own stale comments when the code changes.
- Keep review logs minimal, define retention, and never store source or prompts longer than required to complete and audit the review.

## Phase 3: broader opt-in

- Expand to private or personal repositories only after installation scope, billing ownership, data handling, and incident response are documented.
- Keep organization and personal installations separate so a repository transfer is not required for review coverage.
- Add a non-blocking status check only after the pilot demonstrates stable precision. Automated approval, merge, release, and secret access remain out of scope.

Success means fewer escaped defects without adding noisy review work. Track accepted findings, dismissed findings, duplicate rate, review latency, cost per pull request, and any permission or data-handling incident.
