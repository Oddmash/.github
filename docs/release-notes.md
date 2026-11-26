# Release notes

Apply this baseline to every Oddmash GitHub Release. Keep each product's required release sections, version rules, artifact checks and publication authorization. Do not rewrite historical tags or republish artifacts solely to apply this format. Correct verified attribution omissions in existing release descriptions in place when authorized, preserving all other content.

## Content and ordering

- Write concise English release titles and notes for public repositories. Use the repository's existing title convention and the exact released tag.
- Start with a short summary of user-visible outcomes. Group actual changes under relevant headings (Features and improvements, Fixes, Documentation, Maintenance and tests). Omit empty optional categories.
- Preserve product-required installation, breaking changes, migration, known limitations and verification sections. Report observed checks and distinguish pending deployment from confirmed deployment.
- Link relevant merged pull requests and the previous-to-current tag comparison when available. Do not invent references or versions.

## External contributor attribution

GitHub automatically renders its native Contributors section with profile avatars for users mentioned in a published release description. See [GitHub release documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository).

- Determine the included change range from the previous published tag to the exact release revision. Verify external human authors of included merged PRs and other demonstrably included contributions; do not credit unrelated work, reviews alone, or guessed identities.
- Deduplicate verified GitHub logins. Exclude the maintainer (qtaghdi), organization accounts, and automation or agent bots from this external-only acknowledgment. Git co-author credits remain governed by the separate attribution policy.
- Put one plain-text acknowledgment with real `@username` mentions at the very end of the release description, after the full changelog link if present. Do not add a Markdown Contributors heading or manually embed avatar images; GitHub renders the native section below the body.
- Use PR links or plain display names without @mentions elsewhere, including in generated notes, so internal or unrelated users do not appear in native Contributors.
- If no external contributor is verified, omit the acknowledgment entirely. Do not add placeholder accounts or a "None" section.
- After authorized publication or an authorized edit, verify on the GitHub release page that the Contributors heading and avatars match the intended external contributors. Do not claim verification before observing the published page.

## Release attribution checklist

Use this checklist for every public project, including documentation-only and patch releases.

- Resolve the previous published tag in the same release channel and the exact candidate revision (or actual published tag for an audit). Compare their ancestry, not PR creation dates, merge dates alone, or the current tip of develop.
- Inspect the complete commit range and included PRs, following pagination until all results are accounted for. For promotion PRs, inspect the constituent changes and original PR authors, including nested merges. Confirm cherry-picked or otherwise non-merge contributions against the actual released diff.
- Record each verified external contributor's GitHub login, included PR or commit, and concrete contribution in the release preparation evidence. Exclude bots, maintainer-only work, and PRs that are merged only into develop or otherwise absent from the released range.
- Reconcile that evidence with the release body before publishing. Include all verified external humans in the final acknowledgment; retain the relevant change and PR reference in the appropriate section. Recheck whenever the release candidate changes.
- After publishing, compare the final tag range and published body against the same evidence, then inspect the native Contributors section on GitHub. If an omission is confirmed, obtain authorization for an in-place release-description correction; do not create a new tag or republish a package for attribution alone.
- If no external contributors are present, record that the release range was checked and omit the acknowledgment from the public release body. If evidence is incomplete, report the attribution check as pending rather than claiming completion.

## Copyable baseline

Keep only applicable optional sections, fill placeholders and preserve product-required headings.

```markdown
## Highlights

<Short summary of the release>

## Features and improvements

- <User-facing change> (#PR)

## Fixes

- <Corrected behavior> (#PR)

## Verification

- <Actual checks or pending deployment>

**Full changelog:** <previous-to-current comparison URL, if available>

Thanks to <verified external GitHub @mentions, only when applicable>.
```
