# R4 evidence: website-toolkit after the R3 resolutions (M9; commit e3b7f66)

Artifact: /home/user/website-toolkit. The built site is in site/; serve it with `python3 -m http.server <port> -d /home/user/website-toolkit/site`. **Do not run build.mjs.**

Screenshots in panel/R4/:
- index-signal-*, index-cobalt-*: the default and one colourway.
- index-cobalt-calm-*: the header Calm switch pressed over Cobalt.
- part-pricing-calm-* and part-pricing-*: calm is remembered onto an inner page, then switched off there.
- index-contrast-more-desk.png: with the OS setting.

Measurements: `node build/check.mjs`, run after the last edit, gave 14/14 checks and 18/18 parts. Raw results are in panel/R4/checks.json.
- Calm: every site page is probed under prefers-contrast and under the clicked header switch.
- On the landing, calm is probed in each of the 4 colourways, both ways in. Spine, chip and runner fills must be white, and focus is probed.
- The instrument: the outline must be opaque (an 8%-alpha fixture fails); the two-tone band must reach the outline; the stale comment is gone.
- Pressed toggles are ink with a ✓ outside the frame and white with a ✓ in the frame; the pressed Calm shows a ✓.
- The part-page check line is one sentence, with the probes in a details element.
- Overruled: the Signal spines stay seven-hue (wayfinding on the default); see DESIGN-LOG R3 resolutions.
