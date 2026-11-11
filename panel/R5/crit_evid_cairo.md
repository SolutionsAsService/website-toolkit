# R5: Critic: Evidence (Cairo), re-judging R4 F4–F7 after M10

**Anchor used:** *How Charts Lie*: a figure is honest only if it covers the cases it claims and a reader can get the same result again.

**Observed:** I ran `node build/check.mjs` and got 14/14 checks and 18/18 parts, exit 0, matching evidence.md. I restored build/checks.json with git checkout. I also probed site/parts/index.html myself (scratchpad script).

**Findings:**
- F1 [claim] F4 is fixed. With calm off, 6 of the 7 `.gl` are coloured. With prefers-contrast: more, or after clicking Calm, all 7 are white (site.css:390, and the media twin at :364). Clicking Calm again restores the colours.
- F2 [claim] F5 is fixed. Every page in both modes is probed for `.runner-tag, .piece-link b, .gl` (check.mjs:249). On parts/index the selector finds 7 `.gl`.
- F3 [claim] F6 is fixed. `data-calm` is asserted after the click (:248). I saw aria-pressed="true".
- F4 [claim] F7 is fixed. The rule now requires offset ≥ 0 (:115). A negative offset is now sampled, scoring 18.3 (black on white) and 1.18 (light grey), where it used to score 99.
- F5 [premise, minor] No failing fixture proves the spine probe catches a coloured `.gl`.

**Verdict:** PASS

**Requested change:** F5: optional, add a calm-spine fixture. Otherwise none.
