# R1 evidence: website-toolkit, WHOLE round on the colour version (moves M1–M5)

The owner's brief, verbatim: "Site repo is b plus good design boring colors do a new color version in this repo". This run changes colour; the design (sprue, parts, X-ray, sandbox) is held constant by that brief.

Artifact: /home/user/website-toolkit
- Source: parts/, templates/, tokens.css, themes.json, build/, src/ (src/site.css ends with a "Toolkit colourway" block).
- Built site: site/. Serve it with `python3 -m http.server <port> -d /home/user/website-toolkit/site`.
- **Do not run build.mjs.** check.mjs is safe.
- The previous version, for comparison, is /home/user/site-repo (its panel/R2/*.png are the old palette).

Screenshots in panel/R1/:
- index_html-desk.png and index_html-phone.png: first screens with web fonts.
- index-riso-*.png, index-cobalt-*.png and index-mint-*.png: the landing after each theme button.
- index-bare-*.png.
- parts_pricing_html-*.png, parts_index_html-*.png, start_html-*.png, sandbox_html_t_lagos-event-*.png and templates_index_html-*.png.

Measurements: `node build/check.mjs`, run after the last edit, gave 12/12 checks and 18/18 parts. Raw results are in panel/R1/checks.json.
- Every part was rendered alone at 375, 768 and 1280 in each new theme (Signal, Riso, Cobalt, Mint), against these probes: no sideways scroll; every field labelled; every stat with a source line (new); targets; focus ring of 2 px or more at 3:1 or better against the surface behind it, in every theme; text contrast of 4.5:1, or 3:1 for large text. 18/18 pass.
- New: the site's own 25 pages pass the text-contrast probe at 1280 and 375. That covers the ultramarine header and band, the yellow frame, the group colours, the content pages and the footer. Disabled controls are exempt (WCAG 1.4.3). The first run flagged the disabled ↑/↓ in the sandbox at 1.98:1.
- The failing fixture fails every probe, including both focus branches (no ring, and a faint ring) and the stat-source probe.
- First screen at 1280x800: the bottom is at 749. At 375x812 it is at 795 with fallback fonts and 746 with web fonts. Each shows all 7 groups and 5 doors.
- The theme switch re-themes 18 of 18 to Cobalt. Bare X-rays 18 of 18, and Built restores them.
- Sandbox: the preview equals the copy, X-ray is preview-only, and the Riso preset rewrites the tokens.
- Templates: in-page links resolve; Lagos "Voices" leads to #voices.

Palette (src/site.css :root and themes.json):
- Chrome: ultramarine ground #2330d6, deep #151d92, acid yellow #e4ff3a, ink #0d0f2b, page #f7f5ff, muted #474a6b.
- Group colours: A #ff6a52, B #ff86dc, C #3fe0a6, D #67cdff, E #ffad47, F #c2b0ff, G #e4ff3a. All carry ink text.
- Part themes:
  - Signal: violet #5a2ee5 on #fffdf8
  - Riso: #d6005f on #fff6d6 / #ffe27a
  - Cobalt: #e4ff3a on #101a5c
  - Mint: #007a52 on #f0fff8

Inherited fixes (see DESIGN-LOG M5):
- The stat-source probe.
- Exact slot tokens.
- Bare glossed on the phone, and the doors after the frame in the DOM (no visual reorder).
- "Theme"/"View" labels on the phone; narrower virtual widths for sparse miniatures.
- "step by step" in place of "five minutes"; Lagos "Voices".
- Step numerals inside the margin, `text-wrap: pretty`, and .chk at 34em.
