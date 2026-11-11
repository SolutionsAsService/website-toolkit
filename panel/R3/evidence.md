# R3 evidence: website-toolkit after the R2 resolutions (M8; commit e18947e)

Artifact: /home/user/website-toolkit. The built site is in site/; serve it with `python3 -m http.server <port> -d /home/user/website-toolkit/site`. **Do not run build.mjs.**

Screenshots in panel/R3/:
- index-{signal,riso,cobalt,mint}-{desk,phone}.png: the spines now follow each colourway.
- index-calm-{desk,phone}.png: the in-page Calm switch, pressed.
- part-pricing-calm-*.png: calm carried to an inner page (it is remembered).
- part-pricing-*.png: normal.

Measurements: `node build/check.mjs`, run after the last edit, gave 14/14 checks and 18/18 parts. Raw results are in panel/R3/checks.json.
- New probe: every site page under `prefers-contrast: more` and under the Calm switch. Text, list markers and the landing's focus rings hold.
- Focus probe:
  - A two-tone ring counts only with a band that has zero offset, zero blur, no inset, spread ≥ 1 px, and 9:1 from the outline (WCAG C40).
  - Ancestors count as what lies behind a ring; a ring with no sampled side fails.
  - Only part-preview iframes are skipped.
  - List markers: 4.5:1 unless large.
- The failing fixture now also fails: a drop-shadow "two-tone" ring, 3.35:1 tones, and a focusable iframe. On the first run the iframe case passed because the Tab budget did not count iframes; the budget was fixed.
- Parts: 18/18 in all 4 themes. Signal paper is #ebe3ff and Riso paper #ffd6e8; the Riso accent was darkened to #ad004a after measuring 3.98:1.
- First screen at 1280 and 375: complete above the fold (see checks.json).
- Pressed toggles: white with a ✓, not yellow. Filled yellow is the first door only.
