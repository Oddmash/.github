# Contributing to Oddmash

**English** · [한국어](https://github.com/Oddmash/.github/blob/main/docs/ko/CONTRIBUTING.md) · [日本語](https://github.com/Oddmash/.github/blob/main/docs/ja/CONTRIBUTING.md) · [简体中文](https://github.com/Oddmash/.github/blob/main/docs/zh-CN/CONTRIBUTING.md)

Thanks for helping us build better developer tools.

## Report a problem

Open an issue in the relevant project. Describe what you expected, what happened, and how to reproduce it. Include the project version and relevant environment details. Use public or local fixtures with synthetic values. Remove credentials, private page contents, and personal data from logs and screenshots.

## Propose a change

Open an issue first for a new feature or a change that affects several parts of a project. For small fixes, open a pull request and explain the behavior it changes.

## Project README standard

- Use the README as the product introduction. Open with what the service does, who it helps, and one concrete use case.
- Show the product in action with a screenshot, short recording, or demo. Add descriptive alt text. Label illustrations as previews and use sample data in visuals.
- Keep repository setup, installation, local-run commands, implementation notes, build steps, tests, releases, and contributor workflows out of the README.
- Put all development and verification instructions in the project's `CONTRIBUTING.md`. Link to it briefly from the README footer when useful.
- Keep the English, Korean, Japanese, and Simplified Chinese versions in sync, including language links and visuals.

## Shared Node checks

Use `.github/workflows/node-ci.yml` for repositories whose checks run through `npm run ci` after `npm ci`. Call `Oddmash/.github/.github/workflows/node-ci.yml@<commit-sha>` from a job with `contents: read`. The caller owns its triggers. Set `working-directory` when the npm project is below the repository root and keep a committed lockfile there. `node-version` defaults to 24 and `ignore-install-scripts` defaults to false. Keep workflows with their own browser setup or compatibility matrix in the product repository.

## Submit a pull request

- Keep changes focused and link the related issue when one exists.
- Follow the project's `CONTRIBUTING.md` for setup and checks. Include the results in your pull request.
- Explain changes to permissions, captured data, or public APIs.
