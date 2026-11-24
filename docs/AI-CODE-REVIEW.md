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
- Private repositories may use the central reviewer only under a separately approved repository identity allowlist and data-processing policy. New private repositories are not enrolled automatically. Internal and personal repositories remain excluded. Private auto-merge is available only after explicit maintainer approval under Phase 4; future private repositories remain manual until enrolled.
- Keep organization and personal installations separate so a repository transfer is not required for review coverage.
- Add a non-blocking status check only after the pilot demonstrates stable precision. For a maintainer-enabled independent App, approval requires zero validated findings, no omitted files, and passing current checks. Request changes only for high-confidence actionable findings; incomplete evidence requires a single advisory and maintainer review. Wait for the final aggregate verify check before publishing a formal outcome; update same-head advisory reviews instead of posting duplicates. Avoid a clean interim review while CI is pending or failing. Automatic release and secret access remain out of scope. The advisory reviewer does not merge.
- Follow the organization default of opening PRs ready for review. Draft PRs are deliberately excluded from official review until ready; pending remote CI alone is not a reason to use a draft. This does not relax the exact-head evidence or approval requirements.

Success means fewer escaped defects without adding noisy review work. Track accepted findings, dismissed findings, duplicate rate, review latency, cost per pull request, and any permission or data-handling incident.


## Cross-product quality and review dialogue

- Review visual clarity, accessibility, copyright/licensing and defensive security/privacy against the relevant product contract and actual changed-code evidence. Distinguish an actionable defect from a preference or missing context.
- WCAG 2.2.2 does not categorically prohibit intentional repeating demonstrations with a working pause, stop or hide mechanism. Respect reduced motion; evaluate actual behavior. Action buttons may change their labels; toggles using aria-pressed should have a stable name. Do not demand mutually incompatible control patterns.
- Require concrete provenance, license terms or distribution evidence for a licensing defect. Uncertain provenance merits a question, not a claim of infringement. Never request exploit reproduction, credentials or private values.
- Bounded work and fail-closed behavior are deliberate. Do not require unlimited pagination or speculate about unsupported API response formats without evidence. A limitation with a clear operational diagnostic is not automatically a blocking defect.
- The maintainer may mention `@oddmash-reviewer[bot]` in an existing inline thread to discuss evidence and request a fresh review using the documented command. Replies are advisory and do not change approval state. Group new inline findings under a single submitted review, retaining distinct threads. Preserve authorization, exact-head checks, redaction, deduplication and protected-branch requirements.

## Phase 4: maintainer-only auto-merge

- The same GitHub App uses a separate deterministic merge policy. All current Oddmash product projects are eligible: the five public repositories (Kowrap, Oddmash UI, Interaction Inspector, Vertactics, Boundra) and explicitly enrolled private repository identities. For product repositories only, eligibility is limited to maintainer-authored, same-repository PRs into protected `develop` or default `main`. Infrastructure repositories follow their documented main-only delivery exception and the exact repository-specific allowlist below; this does not authorize automatic merging into an infrastructure `develop` branch. New unapproved repositories, external contributors, and security-sensitive organization policy changes remain manual. Private review filtering remains mandatory; confidential filenames, issue text, omitted patches and incomplete evidence block automatic merging.
- Require a single independently validated same-repository reference to a maintainer-authored open issue with explicit acceptance criteria, zero review findings, exact-head App approval and all current checks passing. A standalone closing reference requires evidence for the full issue scope. A standalone `Refs #N` permits a coherent partial PR scope verified against the linked issue and current diff, using its acceptance checklist or Summary; it never closes the issue. Markdown issue-form headings and ordinary measurable bullets or checkboxes are accepted. Multi-issue release PRs and cross-repository references are valid contribution metadata but require manual merge; report that distinction rather than a missing-link error. Missing or ambiguous evidence leaves the PR open.
- The exact public `Oddmash/.github` repository (ID `1455305553`) is eligible for maintainer-authored same-repository PRs targeting protected `main` that change ordinary organization Markdown guidance: root `AGENTS.md`, `CONTRIBUTING.md`, `PULL_REQUEST_TEMPLATE.md`, existing English issue templates, the profile README and localized README and contributor guides. Workflows, configuration, CODEOWNERS, security and AI review policy documents and other non-allowlisted paths remain manual. All existing issue evidence, current CI, exact-head approval, branch protection and normal merge gates apply unchanged.
- Eligible changes include ordinary Markdown documentation, allowlisted product source paths, and additive tests that do not remove assertions or disable tests. Architecture, configuration, generated code, permissions, releases, sensitive paths, test rewrites and policy changes require manual review.
- Eligible source/test roots are explicit: Kowrap `src/`, `site/app/`, `site/components/`, `site/lib/` and additive `test/` or `site/test/`; Oddmash UI and Interaction Inspector `src/`, `demo/` and additive `tests/`; Vertactics `apps/editor/src/`, `apps/landing/app/` and additive `apps/editor/tests/`. Only added or modified JavaScript, TypeScript, CSS, and SCSS source files are eligible. For enrolled private repositories, use explicit product-specific source roots maintained in the private runtime; repositories with no approved source roots may merge only ordinary documentation. Agent and skill governance, runtime and instructions remain manual. Nested test files follow the additive-only rule; all excluded paths and the bounded review budget still apply.
- Boundra additionally permits `packages/runtime/src/` and `packages/ui/src/` ordinary supported source files and additive tests under `packages/runtime/tests/` and `packages/ui/tests/`. Rust core changes remain manual.
- Enforce GitHub Actions verify on develop and main and every required repository-specific CI check, require an up-to-date branch, never bypass branch protection, and scope the short-lived write token to the eligible repository only. Use the verified head SHA for a normal merge commit. Do not squash or rebase. Keep a deployment kill switch; failure leaves the PR open.
