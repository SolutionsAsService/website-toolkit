# Contributing to website-toolkit

Thanks for taking a look. Contributions of every size are welcome: bug reports, typo fixes,
docs, new parts, fixes to existing parts and ideas.

## Ways to help

- **Report a bug or a wrong fact.** Open an issue with what you did, what you expected and what
  happened instead. Screenshots, logs or a source link help a lot.
- **Suggest an idea.** Open an issue describing the problem it solves before writing a lot of code,
  so we can agree on the approach first.
- **Send a fix.** Small, focused pull requests are reviewed fastest.

## Getting set up

The parts are plain HTML and need nothing. The site around them is built by a small Node script with no dependencies, and checked with Playwright.

```bash
git clone https://github.com/SolutionsAsService/website-toolkit
cd website-toolkit
npm run all        # build, check, build again (the check needs Playwright's Chromium)
npx serve site     # or any static server
```

To add or change a part, follow the format in [AGENTS.md](AGENTS.md). A part must pass `npm run check` at 375, 768 and 1280 px in every theme before it is merged. Keep links relative so the site deploys from any host.

## Making a change

1. Fork the repo and create a branch from the default branch: `git checkout -b fix/short-description`.
2. Keep the change focused on one thing, and match the style of the surrounding code.
3. Run `npm run all` and make sure every check passes.
4. Write a clear commit message in the imperative: `Fix crash when config is missing`.
5. Open a pull request that says what changed and why, and link the issue it closes.

## Pull request checklist

- [ ] The change does one thing and the description explains it.
- [ ] `npm run all` passes (every part, every template, the site).
- [ ] Docs or README are updated if behaviour changed.
- [ ] No secrets, API keys or personal data are committed.

## Conduct

Be kind and constructive. Critique code, not people. Harassment of any kind is not tolerated.

## License

By contributing, you agree that your contributions are licensed under the MIT License of this
repository (see [LICENSE](LICENSE)).
