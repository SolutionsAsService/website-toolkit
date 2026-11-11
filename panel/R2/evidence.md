# R2 evidence: website-toolkit after the R1 resolutions (M6, M7; commit 3db7305)

Artifact: /home/user/website-toolkit (built site in site/; serve with `python3 -m http.server <port> -d /home/user/website-toolkit/site`). **Do not run build.mjs.**

Screenshots in panel/R2/:
- index-signal-*, index-riso-*, index-cobalt-*, index-mint-*: the landing after each theme button, which now recolours the band, header and frame along with the parts.
- index-calm-desk.png: with prefers-contrast: more.

Measurements: `node build/check.mjs`, run after the last edit, gave 13/13 checks and 18/18 parts. Raw results are in panel/R2/checks.json.
- Focus is probed on all 25 site pages (real Tab, up to 160 stops). Each ring is judged against what is painted just outside each of its four sides; a two-tone ring passes when its tones differ by 3:1. Preview iframes are skipped, because their contents are probed as parts. Every focusable element passes.
- New probe: list markers at 3:1. The step numerals are now in the ground colour. The fixture fails the marker probe.
- The landing chrome keeps text contrast in all four colourways (Signal ultramarine, Riso #c4005a, Cobalt #101a5c, Mint #006b48).
- Parts: 18/18 in Signal (now a lilac ground #f4f0ff), Riso, Cobalt and Mint.
- First screen: 1280x800 bottom 749; 375x812 bottom ≤ 812 with fallback fonts (check.mjs blocks web fonts; the web-font case is shorter).

Changes:
- Two-tone focus rings: yellow and ink on the coloured surfaces, ink and white elsewhere.
- Forced colours: pressed buttons use SelectedItem.
- Parts index: colours keyed by group letter.
- prefers-contrast: a calm pale ground.
- "Start here" is the one filled yellow door; "All 18 parts" is an outline.
- Group G is white.
- The CSS comments are re-measured.
- The stylesheet header is rewritten; `citrus` is renamed `riso`; AGENTS.md explains the `sr` prefix.
