# R2 — Critic: Inclusion (Mace)

**Anchor used:** Principles of Universal Design (Mace et al.), Principle 4 "Perceptible Information": legible in every mode, not just the default.

**Observed:** Served site/ on :8931. Playwright pressed real Tab keys through index in all four colourways (1280/375, normal and forced colours), index with `contrast:'more'`, contact-form and start. 420 stops on footer, Copy and frame controls. Pixels 1 to 5px outside each side compared with the pixel at 10px.

**Findings**
- F1 [claim] R1 F1 fixed: `.foot a` ring is volt plus a 2px ink band, 11.5:1 on four sides, every colourway, both widths.
- F2 [claim] Copy (`.code .copy`), "Copy code", `.tbtn` and `.bare` pass all sides. Next to a pressed yellow button the ink band gives 16.7:1.
- F3 [claim] R1 F3 fixed: in forced colours, pressed = SelectedItem `rgb(25,103,210)`, unpressed = transparent.
- F4 [defect] Under `prefers-contrast: more`, `.sprue-bar .gloss code` ("data-slot") stays volt on #ebe6ff: 1.08:1 text.
- F5 [defect] In the same mode the pressed `.tbtn` and `.bare` buttons lose their edge (volt on #ebe6ff, 1.08:1). Unpressed buttons keep an ink border, so the selected one is the faintest.
- F6 [premise] The evidence covers prefers-contrast only with a screenshot (index-calm-desk.png). No probe measured it.
- F7 [claim] The footer links are 15px tall, but they are inline and their centres are 91px apart, so WCAG 2.5.8 passes. Frame buttons are 32 to 36px.

**Verdict:** OBJECT

**Requested change**
- F4: under `@media (prefers-contrast: more)`, set `.sprue-bar .gloss code { color: var(--ink); }`.
- F5: there, set `[aria-pressed="true"] { border-color: var(--ink); }`.
- F6: run the contrast probes with `contrast:'more'`.
- F1–F3, F7: none.
