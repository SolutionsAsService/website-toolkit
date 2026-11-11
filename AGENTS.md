# For agents

This repository is a library of website parts. To build a page from it:

1. Read `site/registry.json` (deployed at `/registry.json`). Each part has `id`, `code`, `group`, `summary`, `slots`, `needs`, `a11y`, `raw`, `sha256` and `check`.
2. Take a part's file from `parts/<id>.html` (or `/raw/parts/<id>.html`). Remove the leading `<!--sr:part {…} -->` header and keep the `<style>` and the markup together.
3. Put the `:root` block from `tokens.css` in the page head. To theme, override its variables, for example with a preset from `themes.json`.
4. Replace the content of every element with `data-slot`. The part's `slots` object says what each slot holds.
5. Do not remove labels, `alt`, `aria-*` or `role`. Keep one `h1` per page; change heading levels to fit.
6. Meet `needs`. For example, a form needs an endpoint that accepts its fields.

## Adding a part

- One file in `parts/` named `<id>.html`, starting with `<!--sr:part {json} -->`. The JSON needs `id`, `title`, `category` (navigation, hero, content, forms, places, dividers, footers), `summary`, `slots`, `needs` and `a11y`.
- Scope every selector to `.sr-<short-name>`. Use only `var(--sr-…, fallback)` for colour, radius, space and fonts.
- Every slot named in the header must exist as a `data-slot` value in the markup (one element can carry several, space-separated: `data-slot="link current"`); the build fails otherwise.
- Run `npm run all`. The part must pass the check at 375, 768 and 1280 px in all 4 themes.
