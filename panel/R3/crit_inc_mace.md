# R3 — Critic: Inclusion (Mace)

**Anchor used:** Principles of Universal Design (Mace et al.), Principle 4 "Perceptible Information": the essential cue must survive every mode the user picks.

**Observed:** Served site/ on :8947. Playwright pressed real Tab keys through index and parts/pricing at 1280 and 375 in three modes: Calm switch pressed, `contrast:'more'`, and Cobalt. That made 222 stops. At each stop I compared focused and blurred pixels 1–7px outside each side, then zoomed into the C1 card.

**Findings**
- F1 [claim] Calm: `.hero .piece:focus-within` is a 3px ink ring with a 2px white band, 14.7:1 on the lavender. pricing: 0 failing stops in either mode.
- F2 [claim] Cobalt: a volt ring on navy (16:1) with an ink band.
- F3 [defect] With `contrast:'more'`, the same card gets a volt ring on #e6e1f5: 1.13:1. Only the 2px ink band shows, and it reads as a thicker card border. Rule 328 asks for ink, but 360–361 come later with equal specificity and override it. The mode for low vision gets a weaker ring than Calm does.
- F4 [claim] R2 F4/F5 fixed. `.gloss code` is ink. Pressed toggles are white with an ink border and a ✓. In forced colours, the pressed Calm switch is SelectedItem.
- F5 [premise] The evidence says the landing's rings "hold" under contrast more. That is true only by the C40 band rule, not by rule 328.

**Verdict:** OBJECT

**Requested change**
- F3: after line 361, add `@media (prefers-contrast: more)` containing the `html[data-calm]` ring rules (ink outline, `0 0 0 2px #fff`).
- F1, F2, F4, F5: none.
