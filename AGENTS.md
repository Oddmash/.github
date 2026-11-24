# Oddmash organization working agreements

Oddmash is a one-person independent software studio that builds web services, games, developer tools, and AI agents. Public projects may accept voluntary external contributions, but active recruitment and ongoing community operation are not default goals.

Use this file as the baseline for new Oddmash repositories. Every product repository should keep its own root `AGENTS.md` and add only the rules its product, runtime, privacy boundary, release process, UI, or visual identity requires.

## Product documentation

- Write direct, natural prose in new product copy, documentation, and collaboration messages. Do not use em dashes (U+2014), en dashes (U+2013) as sentence punctuation, or decorative punctuation as a substitute for clear sentences. Prefer periods, commas, colons, or parentheses. Preserve required code, identifiers, quotations, and literal source content. Avoid generic slogans, inflated claims, repeated rhetorical headlines, and filler.
- A public product website must explain the primary use case and provide the actionable usage documentation on the site itself, including relevant installation, examples, configuration, troubleshooting and limitations. GitHub links supplement source and contribution workflows; they must not replace the website's primary learning path.

- Treat every public README as a product introduction, not a repository setup guide. Explain what the product does, who it helps, and one concrete use case.
- Show the real service, tool, or game with a screenshot, short recording, gameplay capture, or demo when one exists. Use descriptive alt text, label previews, and keep sensitive data out of visuals.
- Keep installation, local development, architecture, testing, release, and contributor workflows in `CONTRIBUTING.md` or `docs/`.
- Keep reader-facing README content in English, Korean, Japanese, and Simplified Chinese unless a repository documents a narrower approved scope. Synchronize claims, language links, and visuals.

- For public libraries, SDKs, APIs and developer tools, generate an agent-readable `llms.txt` index and relevant clean Markdown/API artifacts from the same public, versioned sources as human documentation. Verify built URLs, content parity, runnable examples and privacy boundaries. Do not use an AI index as a substitute for usable human docs or an access control.

## Engineering baseline

- Name new source files, folders, assets, documentation files and internal route segments in lowercase kebab-case (`user-profile.tsx`, `use-user-profile.ts`, `user-profile.test.ts`, `user-profile.module.scss`). Preserve framework/tool-required names and syntax (`AGENTS.md`, `SKILL.md`, `README.md`, `package.json`, `page.tsx`, `[id]`), existing public API/import paths, external assets and generated files. For a rename, update references, imports, tests and links together; verify case-sensitive resolution and avoid unrelated mass renames.
- In JavaScript/TypeScript, use camelCase for variables, functions and hooks (`useUserProfile`), PascalCase for components and types (`UserProfile`), and UPPER_SNAKE_CASE for genuine constants or environment variables. Prefer typed contracts, explicit errors, small domain-focused modules, existing alias conventions and named exports for reusable code where compatible. Use const arrow-function React components without `React.FC`; avoid redundant comments, retain meaningful existing comments and explain nonobvious invariants only when needed. Respect framework-required exports and existing public contracts.
- Follow the repository's formatter, lint, type-check, import and test conventions; keep tests named after their subject and introduce no competing style/configuration. Use one declared dependency manager and reproducible lockfile or equivalent dependency metadata per independent installation root. For new JavaScript/TypeScript projects prefer pnpm unless the runtime or product has a documented reason otherwise. Do not migrate existing package managers as incidental work.

- Keep changes focused, reversible, and covered by the checks appropriate to the affected product.
- Use the package manager, lockfile, runtime, engine, and generated-file boundaries declared by the repository. Do not introduce a shared stack merely for organizational consistency.
- Give CI and deployment workflows the minimum permissions they need. Pin reusable cross-repository workflows to a reviewed commit.
- Keep secrets, signing material, private user data, and production-only values out of source, fixtures, logs, screenshots, prompts, and review comments.
- Preserve existing URLs, release channels, package names, permissions, privacy boundaries, and deployment behavior unless the task explicitly authorizes a migration.

## Ecosystem-aware package management

- Select the dependency manager appropriate to the repository's language, framework and existing tooling. Default to pnpm for JavaScript and TypeScript, Cargo for Rust, uv for new Python projects where compatible, Go Modules for Go, NuGet for .NET, and engine-native dependency management for Godot. These are defaults, not migration mandates. Document justified exceptions and do not introduce an unrelated tool solely for organizational consistency.
- For JS/TS roots using pnpm, use the shared pin `pnpm@11.25.0` in `package.json#packageManager`, a compatible Node.js runtime (Node.js 24 by default), and a committed reproducible `pnpm-lock.yaml` for each independent installation root. Document incompatible tooling or legacy project exceptions with the selected version and verification evidence.
- Declare the selected tool and version where supported. Commit ecosystem-appropriate lockfiles or equivalent reproducible dependency metadata; use locked or frozen installation in CI and deployment where supported. Keep workspace boundaries, cache keys, build-script permissions and release behavior consistent with that project.
- For JS/TS projects using pnpm, use pnpm for internal scripts and contributor setup. Preserve npm registry publishing and external npm, Yarn and Bun consumer examples. Do not change consumer packages or release channels merely to standardize internal tooling.
- Migrate only through focused reviewed pull requests. Preserve dependency versions, supported runtimes, generated-output boundaries and security permissions. Verify applicable install, lint, type, tests, build and non-publishing release checks; preserve in-flight PRs.

## Git and repository workflow

- For product repositories, use `develop` for integration and `main` for production releases. For organization infrastructure and reusable tooling repositories, use focused topic branches from `main` targeting `main` directly; document the exception in repository instructions. Preserve CI and independent review requirements, release authorization and normal merge commits. Do not delete or retarget in-flight branches without inspecting their changes.

- Run required CI on PRs, keep stable aggregate check names, cancel superseded runs, and use change-scope detection and dependency caches. Do not skip required checks to reduce cost. Keep production publishing restricted to the approved main revision or explicit release event.
- Before retrying CI, verify the current PR head, applicable merge revision, latest run ID and attempt for each required workflow. A PR metadata edit can start a new run even without a new commit; wait for that run to appear and do not retry an older superseded run. Retry only the latest applicable failed or cancelled run, once, and recheck the PR's actual required check state. An earlier successful run does not establish that a later cancelled, failed or pending required check is satisfied. If the merge gate still disagrees with the observed result, diagnose the current check and its source without weakening branch protection, bypassing verification, or reporting an unconfirmed merge as complete.
- Verify repository identity, remote, base revision, branch and existing changes before editing. Preserve user work and contributor authorship. Use focused branches and follow local naming conventions; absent one, prefer `feat/`, `fix/`, `docs/`, `refactor/`, `test/` or `chore/` with a descriptive slug.
- Keep commits small and coherent, with concise English subjects for public repositories. Use a type-prefixed subject for maintainer topic commits and PR titles, such as `fix: clarify focus` or `docs(api): update examples`. Preserve external contributor history and existing release merge commits. Stage only intended changes; inspect diffs and exclude secrets, unrelated files and unnecessary generated artifacts.
- Attribute substantive agent contributions using the [agent contribution attribution](#agent-contribution-attribution) convention below.
- Before implementing a change, find the existing issue or create a scoped issue with acceptance criteria. No implementation PR may be opened without an explicit `Refs #123`, `Closes #123`, or cross-repository reference in its body. Use `Refs` when merging to an integration branch or when work is partial; use `Closes` only when the default-branch merge completes the issue. Use one scoped issue per topic or branch synchronization PR; a `develop` to default-branch release PR may list multiple distinct issues, closing only completed work. Write measurable acceptance criteria as Markdown bullets or checkboxes. Release PRs with multiple issues and cross-repository references remain manually merged after CI and review. Protect both `develop` and `main` in product repositories and require the trusted aggregate `verify` check. Synchronize the existing default-branch history into `develop` through a normal PR, without rewriting historical subjects. Verify the actual linked issue and PR body before handoff. Use PR templates and describe scope, actual verification, compatibility and release impact. Open pull requests as ready for review by default, including when remote CI or review is pending. Use a draft only when explicitly requested, implementation is materially incomplete, or review would be misleading because essential evidence is unavailable. State the draft reason and condition for becoming ready; mark it ready promptly when resolved. Follow current exact-head CI and review requirements before an authorized merge.
- Complete every required heading in the shared PR template and remove placeholder text. Validate issue format, issue existence, title, branch-specific reference, actual verification and impact before requesting review. The pinned shared CI scope checks contribution metadata; callers must listen for PR edits and include the scope result in required verification. Structural checks do not replace review. Public issue forms require fields in the web UI; maintainers, private repositories, and API-created issues still require explicit preflight validation.
- Keep protected branches protected. Never force-push shared branches, bypass checks, rewrite contributor history or discard unrelated work without explicit maintainer authorization. Prefer corrective commits or revert PRs for shared history. Follow the merge rules under Collaboration and AI review.
- Tag and publish from the approved revision under the product's release policy; verify the published artifact. Use the reusable Git workflow skill in the skills catalog for execution guidance when available.

## Agent contribution attribution

Credit each Oddmash agent whose verified review or advisory materially contributes to a commit. Add one Git `Co-authored-by` trailer per actual attributed GitHub account after a blank line at the end of the commit message. Use the authenticated source comment or review author's identity, not merely the role named in its text. Record the source role or discussion in the commit body or PR evidence when coordinated advice is posted by Lead (formerly Reviewer) instead of a dedicated role account. Deduplicate trailers by account; do not credit an agent merely for running, approving, or producing an unused recommendation. Preserve human authorship and do not rewrite previously published history.

| Agent account | Verified Git trailer |
| --- | --- |
| Lead (formerly Reviewer) | `Co-authored-by: oddmash-lead[bot] <360059368+oddmash-lead[bot]@users.noreply.github.com>` |
| Impact | `Co-authored-by: oddmash-impact[bot] <360494540+oddmash-impact[bot]@users.noreply.github.com>` |
| Triage | `Co-authored-by: oddmash-triage[bot] <360494678+oddmash-triage[bot]@users.noreply.github.com>` |
| QA | `Co-authored-by: oddmash-qa[bot] <360494749+oddmash-qa[bot]@users.noreply.github.com>` |
| Release | `Co-authored-by: oddmash-release[bot] <360494807+oddmash-release[bot]@users.noreply.github.com>` |
| Docs | `Co-authored-by: oddmash-docs[bot] <360494869+oddmash-docs[bot]@users.noreply.github.com>` |
| Architect | `Co-authored-by: oddmash-architect[bot] <360494928+oddmash-architect[bot]@users.noreply.github.com>` |

Lead is the verified renamed account; historical Reviewer trailers remain valid for their historical commits. For any renamed or newly configured bot, verify its actual authenticated GitHub account and no-reply identity before changing the registered trailer. Do not rewrite historical commits. Attribution does not grant approval, execution, merge, or deployment authority.

## UI and design

- Design each public landing and documentation site around its actual audience, principal task and product identity. A library should prioritize working examples and clear native documentation; a product should communicate its real workflow and value; a game should convey actual gameplay and atmosphere. Do not impose one organization-wide visual template. Require actual product evidence, readable copy, responsive renders and a verified first-use path before handoff.

- Use Kowrap on eligible Korean prose when compatible with the actual framework and layout. Verify natural line breaks, fallback, semantics and rendering; reproduce and fix confirmed library defects through a separate authorized upstream issue, regression test and reviewed release rather than hiding them with hardcoded breaks.
- Accessibility, keyboard operation, reduced motion, responsive behavior, and clear state feedback are product requirements where applicable.
- Keep product-specific layout, visual tokens, interaction patterns, and game presentation in the product repository.
- Reuse Oddmash UI only when it fits the product and runtime. Promote a token or component into a shared package only after more than one product needs the same stable behavior.

## Collaboration and AI review

- After pushing and verifying a change that addresses review feedback, reply in the original GitHub thread. Address human reviewers and bots without automatic thread routing by their authenticated account. This applies to maintainers, contributors, and coding agents. State what changed and give the current head and actual verification evidence. For Oddmash bot findings, use the exact-head follow-up format in [AI code review](docs/AI-CODE-REVIEW.md#following-up-on-review-findings).
- Use `@oddmash-lead[bot]` for explicit Lead commands. When automatic inline routing is available, the thread identifies the owning bot. For explicit replies to a specialist, mention its own GitHub account. Leave the thread open for the reviewer to verify or resolve. Record disagreement and deferral with a reason in the same thread.

- Use English for issue and pull request titles, bodies, public review discussions, contribution templates, commit messages, and changelog entries in all public repositories. Product READMEs and user-facing documentation retain their existing localization policies. Provide translation help when needed; do not rewrite historical contributions.

- External contributions are optional and scoped. A contribution does not imply recruitment, roadmap ownership, or an ongoing maintainer role.
- Follow the repository's `CONTRIBUTING.md`, issue templates, and pull request template. Record verification evidence and disclose permissions, data, deployment, release, and public API changes.
- AI-assisted review defaults to advisory and least-privileged. A maintainer-enabled, independently identified GitHub App may approve fully reviewed PRs with passing current checks or request changes for high-confidence actionable findings. Incomplete evidence requires a comment and human review. The advisory reviewer must never merge, publish, rotate secrets, execute contributed code, or make production changes automatically. A separately gated merge module in the same maintainer-authorized App may create normal merge commits for eligible maintainer-authored PRs in approved public or explicitly enrolled private repositories only within the explicit repository and path boundaries of [Phase 4](docs/AI-CODE-REVIEW.md#phase-4-maintainer-only-auto-merge), after exact-head approval, complete applicable issue or partial PR-scope evidence, current CI, and enforced branch protection. Use normal merge commits for PR merges; do not squash or rebase unless the maintainer explicitly requests it. The merge module must never bypass rules or merge external contributions automatically. Private repository reviews require explicit maintainer approval of the repository identity and permitted model processing; private auto-merge requires explicit maintainer opt-in and the same Phase 4 evidence, path, and branch protection gates.
- Combine the repository's linter, implementation-language checks, and test results with AI analysis. Review actual bugs, performance, accessibility, security, and privacy before style preferences.
- Review design changes against the product's own design documents. Avoid duplicate comments, include severity, evidence and confidence, and let maintainers dismiss findings.

## AI tooling governance

- Keep organization policy, reusable skills, executable agent services, and product-specific contracts as distinct ownership layers. The organization baseline governs permissions and collaboration; product repositories govern their own behavior and release contracts.
- Skills provide reusable methods and verification criteria, not operational authority. Agent services own execution, authentication, data-handling boundaries, and deployment. Do not duplicate policy or skill text across repositories.
- Use a reviewed immutable commit and exact skill path for agent dependencies. Record the revision and relevant verification evidence in the consuming agent repository. Upgrade references through a reviewed PR; preserve the last known working revision for rollback.
- Keep skill installation and agent deployment independent. A skill update must not automatically change a deployed agent's behavior or expand permissions. Missing or inaccessible guidance must not be treated as permission to act.
- Do not publish private repository content or internal operational details in public documentation, prompts, or reviews. Apply the existing AI review policy to all automated review actions.
