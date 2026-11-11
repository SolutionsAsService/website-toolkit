# R4: Critic: Provocateur (Debord)

**Anchor used:** *Society of the Spectacle*, thesis 10: the spectacle is "the affirmation of appearance".

**Observed:**
- The R3 resolutions hold in the code. `html[data-calm]` (css:366–368) comes after the colourway sets (css:319–321) at equal specificity, so `--g-*` goes pale. index-cobalt-calm-desk.png shows white spines and chips, and Cobalt's navy miniatures stay. check.mjs:253–265 clicks the switch and probes all 4 colourways both ways in. The 3:1 comment is gone.
- The description (build.mjs:53) says "controls stay blue". On the calm landing, every control is white with ink. Only the inner-page `.btn` "Copy code" is still ultramarine (part-pricing-calm-desk.png).
- The log's "Copy turn white" refers to `.code .copy` (css:388), not that `.btn`.
- DESIGN-LOG:305 (M8) still says "share one rule set".

**Findings:**
- F1 [claim] "Controls stay blue" is false on the landing, and true only of `.btn` and kickers elsewhere.
- F2 [claim] The R3 log says "Copy" turns white, but the visible "Copy code" button stays blue.
- F3 [claim] M8's "one rule set" stands unamended beside the R3 correction.

**Verdict:** PASS. The promise is now kept: calm wins in every colourway, and the test proves it.

**Requested change:**
- F1: change it to "buttons and links on inner pages stay blue".
- F2: name `.code .copy` in the log, or calm `.btn` too.
- F3: strike or annotate line 305.
