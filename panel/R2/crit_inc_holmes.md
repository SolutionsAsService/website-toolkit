# R2 · Critic: Inclusion (Holmes)

**Anchor used:** Holmes, *Mismatch*: a fix for one extends to many and must not create a new exclusion (plus WCAG 2.2 1.4.3).

**Observed:**
- site.css:286–287 keys colour by `.pgroup[data-group]`, and parts/index.html carries data-group A–G. Letters stay on every pill.
- site.css:310–315 swaps `--ground` to #f7f5ff under `prefers-contrast: more`. That equals `--paper` (line 3). Only `.hero` and `.top` are repaired.
- Other rules still paint with `--ground`: `.btn` is white text on `--ground` (236), `.kicker` (233), and the step numerals on start.html (292). In calm mode the sandbox's "Add" and "Copy page" buttons are white on #f7f5ff, about 1.05:1. Kickers and numerals are about 1:1.
- check.mjs never emulates prefers-contrast, so "13/13" did not test the calm view.
- index-calm-desk.png: the band is calm, but the 10px acid-yellow frame stays. There is no in-page calm button.

**Findings:**
- F1 [defect→resolved] Group colours now match their groups.
- F2 [claim] Letter cues and contrast hold in all four colourways.
- F3 [defect, partly resolved] The landing is calmer, but on other pages the calm mode makes buttons, kickers and step numerals disappear. It fails people who asked for more contrast.
- F4 [defect] Calm is only an OS query; people with visual stress rarely set "increase contrast".
- F5 [premise] The saturated default stays. I ask for an option, not a retreat.

**Verdict:** OBJECT

**Requested change:**
- F1, F2: none.
- F3: In the contrast block, set ink for `.btn`, `.kicker` and `.steps-h li::marker`. Or add an `--accent` token that never becomes paper. Add an emulated `prefers-contrast: more` pass to check.mjs.
- F4: Add a "Calm" button beside the theme buttons that sets the same tokens.
- F5: none.
