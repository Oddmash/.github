# GitHub account policy

| Account | Responsibilities |
| --- | --- |
| `qtaghdi` | Organization owner and maintainer. Manages access and branch rules, gives final approval to external PRs, and performs their manual merges. |
| `arvynoo` | AI development and operations account. Uses the organization Member role and per-repository Write access where same-repository development is needed. Uses topic branches for commits and opens issues and pull requests. |
| `oddmash-lead[bot]` | Current identity of the Oddmash Reviewer GitHub App. Reviews and verifies pull requests. Its separate merge module follows the existing [Phase 4 gates](AI-CODE-REVIEW.md#phase-4-maintainer-only-auto-merge). |

Use each account for its assigned work. For `arvynoo`, keep Admin, Maintain, branch-rule bypass, and release or deployment authority out of its role assignments. Keep organization base access at Read or below. Grant repository access explicitly and verify it using the account's effective GitHub permissions. Owner commands and approval of the issue acceptance criteria used by automatic merging stay with `qtaghdi`.

## Run an AI development session

1. Obtain `scripts/oddmash-ai` from a reviewed revision of this repository. Use its absolute path in each session.
2. Run `oddmash-ai gh api user --jq .login` and confirm it returns `arvynoo`. The launcher reads the corresponding existing GitHub CLI credential from the keychain for each command.
3. Use a separate checkout or worktree and focused branch for each session. Check the remote owner, base branch, active claims and changed paths. Identify the session and planned branch in the claim, even if another AI session uses the same account.
4. Use `oddmash-ai git commit` and `oddmash-ai git push` for your branch. Use an HTTPS GitHub remote and verify the destination before pushing. Use `oddmash-ai gh issue create`, `oddmash-ai gh pr create`, or the corresponding API calls for GitHub writes. Check the published commit author and committer and the issue and PR authors.
5. Leave tokens in the keychain and command environment. Keep them out of logs, shell tracing, files, Git configuration and remote URLs. Use the launcher per command so other sessions can keep their own account and configuration.

## Set up an Oddmash repository

1. Before opening development, `qtaghdi` creates the repository, copies the organization baseline into the root `AGENTS.md` or links to it, and links this policy there. Add repository-specific integration, verification, and release instructions.
2. Confirm the Owner and Member roles and explicitly grant `arvynoo` Write only if the repository needs same-repository development and the applicable protected branches limit updates to the maintainer and the authorized merge app. Otherwise use public fork-based development where appropriate. Confirm access and the absence of bypass using the actual accounts.
3. Apply and verify the product or infrastructure branch protections, the trusted aggregate CI check, the existing deployment gates and the external PR approval requirement. For an external PR, only `qtaghdi` supplies final approval and manually merges after reviewing the current head. The reviewer may report findings. Do not count another account's review as the maintainer's final approval.
4. Verify the review installation and exact repository eligibility before using conditional automatic merge. Public review coverage follows the organization installation. Private review and automatic merge use separate, explicitly approved enrollment. Keep manual review when a required protection is unavailable.

Check these steps during repository creation and after changing visibility, access, branch rules, or review-app enrollment.
