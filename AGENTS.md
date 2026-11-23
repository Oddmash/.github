# Oddmash organization working agreements

Oddmash is a one-person independent software studio that builds web services, games, developer tools, and AI agents. Public projects may accept voluntary external contributions, but active recruitment and ongoing community operation are not default goals.

Use this file as the baseline for new Oddmash repositories. Every product repository should keep its own root `AGENTS.md` and add only the rules its product, runtime, privacy boundary, release process, UI, or visual identity requires.

## Product documentation

- Treat every public README as a product introduction, not a repository setup guide. Explain what the product does, who it helps, and one concrete use case.
- Show the real service, tool, or game with a screenshot, short recording, gameplay capture, or demo when one exists. Use descriptive alt text, label previews, and keep sensitive data out of visuals.
- Keep installation, local development, architecture, testing, release, and contributor workflows in `CONTRIBUTING.md` or `docs/`.
- Keep reader-facing README content in English, Korean, Japanese, and Simplified Chinese unless a repository documents a narrower approved scope. Synchronize claims, language links, and visuals.

## Engineering baseline

- Keep changes focused, reversible, and covered by the checks appropriate to the affected product.
- Use the package manager, lockfile, runtime, engine, and generated-file boundaries declared by the repository. Do not introduce a shared stack merely for organizational consistency.
- Give CI and deployment workflows the minimum permissions they need. Pin reusable cross-repository workflows to a reviewed commit.
- Keep secrets, signing material, private user data, and production-only values out of source, fixtures, logs, screenshots, prompts, and review comments.
- Preserve existing URLs, release channels, package names, permissions, privacy boundaries, and deployment behavior unless the task explicitly authorizes a migration.

## Git and repository workflow

- Verify repository identity, remote, base revision, branch and existing changes before editing. Preserve user work and contributor authorship. Use focused branches and follow local naming conventions; absent one, prefer `feat/`, `fix/`, `docs/`, `refactor/`, `test/` or `chore/` with a descriptive slug.
- Keep commits small and coherent, with concise English subjects for public repositories. Stage only intended changes; inspect diffs and exclude secrets, unrelated files and unnecessary generated artifacts.
- Credit Oddmash Reviewer when a commit materially implements its review finding: append `Co-authored-by: oddmash-reviewer[bot] <360059368+oddmash-reviewer[bot]@users.noreply.github.com>` after a blank line in the commit message. Include the trailer only for actual review contributions, not unrelated commits, and preserve existing authorship. Do not rewrite previously pushed history to add credit.
- Link relevant issues according to the repository workflow. Use PR templates and describe scope, actual verification, compatibility and release impact. Open pull requests as ready for review by default, including when remote CI or review is pending. Use a draft only when explicitly requested, implementation is materially incomplete, or review would be misleading because essential evidence is unavailable. State the draft reason and condition for becoming ready; mark it ready promptly when resolved. Follow current exact-head CI and review requirements before an authorized merge.
- Keep protected branches protected. Never force-push shared branches, bypass checks, rewrite contributor history or discard unrelated work without explicit maintainer authorization. Prefer corrective commits or revert PRs for shared history. Follow the merge rules under Collaboration and AI review.
- Tag and publish from the approved revision under the product's release policy; verify the published artifact. Use the reusable Git workflow skill in the skills catalog for execution guidance when available.

## UI and design

- Accessibility, keyboard operation, reduced motion, responsive behavior, and clear state feedback are product requirements where applicable.
- Keep product-specific layout, visual tokens, interaction patterns, and game presentation in the product repository.
- Reuse Oddmash UI only when it fits the product and runtime. Promote a token or component into a shared package only after more than one product needs the same stable behavior.

## Collaboration and AI review

- Use English for issue and pull request titles, bodies, public review discussions, contribution templates, commit messages, and changelog entries in all public repositories. Product READMEs and user-facing documentation retain their existing localization policies. Provide translation help when needed; do not rewrite historical contributions.

- External contributions are optional and scoped. A contribution does not imply recruitment, roadmap ownership, or an ongoing maintainer role.
- Follow the repository's `CONTRIBUTING.md`, issue templates, and pull request template. Record verification evidence and disclose permissions, data, deployment, release, and public API changes.
- AI-assisted review defaults to advisory and least-privileged. A maintainer-enabled, independently identified GitHub App may approve fully reviewed PRs with passing current checks or request changes for high-confidence actionable findings. Incomplete evidence requires a comment and human review. The advisory reviewer must never merge, publish, rotate secrets, execute contributed code, or make production changes automatically. A separately gated merge module in the same maintainer-authorized App may create normal merge commits for eligible maintainer-authored PRs in approved public or explicitly enrolled private repositories only within the explicit repository and path boundaries of [Phase 4](docs/AI-CODE-REVIEW.md#phase-4-maintainer-only-auto-merge), after exact-head approval, complete issue evidence, current CI, and enforced branch protection. Use normal merge commits for PR merges; do not squash or rebase unless the maintainer explicitly requests it. The merge module must never bypass rules or merge external contributions automatically. Private repository reviews require explicit maintainer approval of the repository identity and permitted model processing; private auto-merge requires explicit maintainer opt-in and the same Phase 4 evidence, path, and branch protection gates.
- Combine the repository's linter, implementation-language checks, and test results with AI analysis. Review actual bugs, performance, accessibility, security, and privacy before style preferences.
- Review design changes against the product's own design documents. Avoid duplicate comments, include severity, evidence and confidence, and let maintainers dismiss findings.

## AI tooling governance

- Keep organization policy, reusable skills, executable agent services, and product-specific contracts as distinct ownership layers. The organization baseline governs permissions and collaboration; product repositories govern their own behavior and release contracts.
- Skills provide reusable methods and verification criteria, not operational authority. Agent services own execution, authentication, data-handling boundaries, and deployment. Do not duplicate policy or skill text across repositories.
- Use a reviewed immutable commit and exact skill path for agent dependencies. Record the revision and relevant verification evidence in the consuming agent repository. Upgrade references through a reviewed PR; preserve the last known working revision for rollback.
- Keep skill installation and agent deployment independent. A skill update must not automatically change a deployed agent's behavior or expand permissions. Missing or inaccessible guidance must not be treated as permission to act.
- Do not publish private repository content or internal operational details in public documentation, prompts, or reviews. Apply the existing AI review policy to all automated review actions.
