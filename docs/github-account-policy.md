# GitHub account policy

| Account | Responsibilities |
| --- | --- |
| `qtaghdi` (ID `135234546`) | Organization owner and maintainer. Manages access and branch rules, gives final approval to external PRs, and performs their manual merges. |
| `arvynoo` (ID `264418006`) | AI development and operations account. Uses the organization Member role and per-repository Write access where same-repository development is needed. Uses topic branches for commits and opens issues and pull requests. |
| `oddmash-lead[bot]` | Current identity of the Oddmash Reviewer GitHub App. Reviews and verifies pull requests. Its separate merge module follows the existing [Phase 4 gates](AI-CODE-REVIEW.md#phase-4-maintainer-only-auto-merge). |

Use each account for its assigned work. Grant `arvynoo` the organization Member role and keep Admin, Maintain, and branch-rule bypass out of its repository assignments. Reserve release and deployment authorization for `qtaghdi`. GitHub’s built-in Write role still permits creating and editing GitHub Releases. Verify an owner-only production gate where Write is granted, such as Oddmash Agents’ deployment workflow that checks the owner’s GitHub ID. Use Read and fork-based development wherever GitHub Release mutations themselves must be technically restricted. Keep organization base access at Read or below. Grant repository access explicitly and verify it using the account's effective GitHub permissions. Owner commands and approval of the issue acceptance criteria used by automatic merging stay with `qtaghdi`.

## Run an AI development session

1. Use an existing keychain-backed `arvynoo` credential scoped to the GitHub command. Verify the authenticated login with `gh api user --jq .login` using the same credential selection. Preserve the global GitHub CLI account and keep credentials out of files, Git settings, remote URLs, and trace output.
2. Use a separate checkout or worktree and topic branch. Verify the repository, branch, existing claims, and changed paths. Record the session and branch in the claim, since multiple sessions may use the same account.
3. Set the commit author and committer to `arvynoo <264418006+arvynoo@users.noreply.github.com>` for AI changes. Use a credential-free GitHub HTTPS destination, confirm its effective push URL, and verify Git is using the assigned account. Use the same account when creating issues or pull requests, and verify the resulting GitHub authorship.

## Set up an Oddmash repository

On GitHub Free, apply these steps per repository. Organization-wide repository rulesets and branch protection for private organization repositories require a plan that supports those features.

1. Before opening development, `qtaghdi` creates the repository, creates a root `AGENTS.md` linking the [organization baseline](../AGENTS.md) and this account policy. Keep integration, verification, release, and other repository-specific instructions in that local file.
2. Immediately after creating a public repository, `qtaghdi` opens **Settings → General → Pull Requests**. Enable **Allow merge commits** and disable **Allow squash merging** and **Allow rebase merging**. Reload the settings and verify that only **Allow merge commits** is enabled before granting Write access or accepting pull requests.
3. Confirm the Owner and Member roles. Apply and verify the product or infrastructure branch protections, trusted aggregate CI check, and production gates. Check that protected branches restrict updates to `qtaghdi` and, where authorized, the Lead merge module.
4. Grant explicit `arvynoo` Write only after these checks and only when same-repository development is needed. Verify effective permissions and the absence of bypass as the actual accounts. Use public fork-based development where appropriate. For an external PR, require `qtaghdi` to approve the current head and manually merge it. The reviewer may report findings.
5. Verify the review installation and exact repository eligibility before using conditional automatic merge. Public review coverage follows the organization installation. Private review and automatic merge use separate, explicitly approved enrollment. Keep manual review when a required protection is unavailable.

Check these steps during repository creation and after changing visibility, access, branch rules, or review-app enrollment.

Changes to this account policy and other governance documents require manual review and merge.
