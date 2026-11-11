# R4 — Critic: Inclusion (Mace)

**Anchor used:** Principles of Universal Design (Mace et al.), Principle 4 "Perceptible Information": the essential cue must survive every mode the user picks.

**Observed:** Served site/ on :8961. Playwright pressed real Tab keys, 78 per run, on index at 1280 and 375 under `contrast:'more'`, after a click on the header Calm switch, and with Cobalt plus Calm. It did the same on parts/pricing with Calm. I read the computed outline against the nearest painted background, then cropped the A1 card.

**Findings**
- F1 [claim] R3 F3 is fixed. Under contrast more, all 36 `.hero .piece:focus-within` stops (21 at phone width) show an ink ring at 14.69:1 on #e6e1f5, with a 2px white band. The crop shows a clear double ring. Line 354 now names the piece.
- F2 [claim] Header Calm switch: reached by Tab, and Space and Enter both toggle it. aria-pressed flips and the setting survives a reload. When pressed it is white, ink and ✓, a 30px-tall target. Its focus ring is ink. In forced colours the pressed state is a system highlight.
- F3 [claim] Calm and Cobalt plus Calm give the same 14.69:1 once the 0.25s fill transition settles. The transition goes away under reduced motion.
- F4 [claim] `.skip` in Calm keeps a volt ring on #f7f5ff (1.04:1). The ink block that appears is still a visible cue. Minor.

**Verdict:** PASS

**Requested change**
- F4 (optional): in both Calm blocks, give `.skip:focus-visible` an ink outline.
- F1–F3: none.
