# GitHub account policy

| Account | Responsibilities |
| --- | --- |
| `qtaghdi` (ID `135234546`) | Organization owner and default account for authorized GitHub work, including agent-assisted commits, pushes, issues and pull requests. Owns organization settings, final external PR approval, manual merges, and release and deployment authorization. |
| `arvynoo` (ID `264418006`) | Test account. Use only when an explicit test needs a second identity, in an isolated repository or fork scoped to that test. Use the least privilege required and remove temporary access after the test. |
| `oddmash-lead[bot]` | Independent review app. Publishes reviews and verification. Its separate merge module follows the [Phase 4 gates](AI-CODE-REVIEW.md#phase-4-maintainer-only-auto-merge). |

Continue already open PRs under their original authorship. Prior `arvynoo` contributions remain attributable to that account. Apply existing external PR review and merge rules when a prior PR comes from a fork.

## Run an authorized GitHub session

1. Verify `qtaghdi` and account ID `135234546` for the credential used by the command. Use the existing keychain entry with command-scoped authentication. Keep credentials out of files, Git settings, remote URLs and trace output.
2. Use a separate checkout or worktree and topic branch. Verify the repository, destination, claims and changed paths. Record the session and branch in the claim so sessions using the same account can coordinate.
3. Attribute new commits to `qtaghdi <135234546+qtaghdi@users.noreply.github.com>`. Verify the HTTPS push destination and GitHub authorship of issues and pull requests. Follow the maintainer's task authorization and the existing branch, review, issue acceptance and release gates.

### Command-scoped launcher

Run [`oddmash-ai`](../scripts/oddmash-ai) from the checkout using its absolute path. Run `oddmash-ai gh api user --jq .login` to verify the account. Run `oddmash-ai git commit -m "docs: update guidance"` for new commits and `oddmash-ai git push origin HEAD:refs/heads/<topic>` for a verified topic branch. The launcher requires a named remote with a single credential-free GitHub HTTPS URL, retains TLS verification, disables redirects and runs hooks without its credential helper.

For issue and pull request creation, put `--repo OWNER/REPO` immediately after `gh issue create` or `gh pr create`. Provide a title and body and, for a PR, the already pushed `--head`. The launcher reads the named GitHub CLI credential from macOS Keychain or Linux Secret Service and verifies the login and numeric ID. For commands outside the launcher, verify the same account with the actual command's credentials.

## Repository access and review

- Keep organization base access at Read or below. Grant any temporary second-account access only to isolated test resources for the stated test. Keep Admin, Maintain and branch-rule bypass out of test-account assignments.
- Enable only merge commits on public Oddmash repositories. Verify protected branches, the trusted aggregate CI check, and production gates before enabling shared development. Restrict protected branch updates to `qtaghdi` and the separately authorized Lead merge module where eligible.
- Approve and manually merge external PRs from `qtaghdi` after reviewing their exact head and required checks. Use the independent app for reviews of maintainer-authored PRs. Require a maintainer decision for governance changes and other work outside the automatic merge allowlist.
- Keep production deployment and release controls subject to the existing maintainer authorization and repository-specific gates. A test account never authorizes a real merge, release or deployment.
