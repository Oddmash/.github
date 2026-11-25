Write the title and description in English. Use a type-prefixed title, such as `fix: clarify focus`. Complete every heading before requesting review and remove instructional placeholders.

For a compact test-only example and help with metadata CI failures, see the [contribution guide](https://github.com/Oddmash/.github/blob/main/CONTRIBUTING.md#example-a-small-test-only-pr-targeting-develop).

Open as ready for review by default. If a draft is necessary, explain why and what must change before marking it ready. Pending remote CI or review alone is not a draft reason.

## Related issue

Refs #

Use `Refs #123` for an integration-branch PR or partial work. Use `Closes #123` only when the completed work merges into the repository's default branch. Cross-repository references may use `Refs owner/repo#123`. For topic and synchronization PRs, link exactly one scoped issue. For a develop-to-default release PR, list each distinct included issue on its own line; a multi-issue release requires manual merge after CI and review.

## Summary

- What changed and why?

## Verification

- List the actual commands or checks run and their results. Note checks not run and why.
- Which `AGENTS.md` and project-specific guidance did you follow?

## Product and design impact

- Describe user-facing behavior, screenshots or gameplay captures, localization, accessibility, and project-specific UI/design-rule impact. Write “None” when not applicable.

## Permissions and data

- Describe any change to permissions, captured fields, deployment, releases, or secrets. Use synthetic values in examples.
