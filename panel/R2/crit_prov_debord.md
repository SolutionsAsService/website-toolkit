# R2 — Critic: Provocateur (Debord)

**Anchor used:** *Society of the Spectacle*, thesis 9 ("the true is a moment of the false"). A probe's published wording is a representation of the test, so it has to say what the code actually tests.

**Observed:**
- The R1 fixes hold. css:1 describes the yellow sprue on ultramarine, and site/assets is identical. `citrus` survives only in the DESIGN-LOG history. AGENTS.md:3 explains `sr`. The comments read 8.5, 16.7 and 6.7.
- DESIGN-LOG rows 217–229 match the code: two-tone at css:317–318, group-keyed index at css:286–287, `--g-g:#fff`, SelectedItem at css:301, prefers-contrast at css:310, one filled door at css:293.
- check.mjs:34 PROBES is published verbatim on agents.html. It has no marker entry, although `pageProbes` (check.mjs:57–97) also tests the parts' markers at 3:1.
- check.mjs:114–115 calls a ring "two-tone" when its outline is 3:1 from the first opaque `box-shadow` colour. It ignores the shadow's offset, blur, inset, and whether it touches the ring.

**Findings:**
- F1 [claim] The published text says "a two-tone ring whose tones differ by 3:1", but the code passes any opaque shadow, drop or hover included.
- F2 [claim] The published probe list leaves out the marker probe now running, so the wording lags the code.
- F3 [defect] css:297 and css:319 are the same rule, written twice.
- F4 [premise] Off-screen sides are skipped. A ring with all four sides off-screen scores Infinity, so it passes, but the text says "each of its sides".

**Verdict:** PASS. Every R1 claim is kept. F1 is a probe that is too generous, and nothing uses that today.

**Requested change:**
- F1: count only shadows with zero offset and blur, spread ≥1px and not inset; or reword the published text to match.
- F2: add "list markers 3:1" to PROBES.
- F3: delete one of the two.
- F4: report a ring that has no measurable side.
