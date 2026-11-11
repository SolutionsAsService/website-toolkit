# website-toolkit

A kit of website parts for people and agents: 18 copy-paste parts in plain HTML and CSS, 4 templates built from them, a sandbox to assemble and theme them, and a JSON registry an agent can fetch.

- **No framework, no build, no keys.** Each part is one file: a JSON header, one scoped `<style>`, the markup. Every token has a fallback, so a part works pasted alone.
- **Themed by 15 tokens** in [`tokens.css`](tokens.css); [`themes.json`](themes.json) has 4 presets.
- **Slots, not placeholders.** The places to fill carry `data-slot="…"`. Each part's header says what goes in each slot, what the part needs, and its access notes.
- **Checked.** `npm run check` renders every part alone at 375, 768 and 1280 px in every theme. It probes overflow, labels, target size, focus after a real Tab, and text contrast. The results are published on each part page and in `registry.json`.

## Use a part

1. Open a part page (or `parts/<id>.html` here) and copy the code. Or fetch `raw/parts/<id>.html` from the site.
2. Paste it into your page. Add the `:root` block from `tokens.css` to the head to theme it.
3. Fill each `data-slot`. Keep the labels and `aria-*` attributes.

Agents: start at `registry.json` or `llms.txt` (see [AGENTS.md](AGENTS.md)).

## Layout

| Path | What |
|---|---|
| `parts/*.html` | The parts (the source of truth) |
| `templates/*.json` | Pages made of parts, with text overrides |
| `tokens.css`, `themes.json` | Tokens and presets |
| `build/build.mjs` | Builds the site into `site/`, including `registry.json` and `llms.txt` |
| `build/check.mjs` | Measures everything and writes `build/checks.json` |
| `src/` | The site's own CSS and scripts (sprue, part pages, sandbox) |
| `DESIGN-LOG.md`, `panel/` | Design decisions and critique rounds |

## Build

```bash
npm run all      # build, check (needs Playwright), build again to publish the results
```

The build needs Node 18+ and nothing else. The check needs Playwright (`npm install` installs the pinned devDependency; `npx playwright install chromium` if you have no browser). The built `site/` is committed and deployed as static files (`vercel.json`, `fluid.json`).
