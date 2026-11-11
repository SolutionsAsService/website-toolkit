# R3: Critic: Evidence (Cairo)

**Anchor used:** *How Charts Lie*: a measure is only honest if it can fail, and its stated method matches what it does.

**Observed:** I ran `node build/check.mjs` myself and got 14/14 checks and 18/18 parts, exit 0. Bottom edge was 749 at 1280 and 807 at 375. The instrument fixture flags Drop, Tones and iframe. I restored checks.json with git checkout. I fed crafted rings to `__ring` and tabbed the landing (42 stops, every one judged).

**Findings:**
- F1 [claim] Strict two-tone holds: zero offset, zero blur, no inset, spread ≥1 and 9:1 (check.mjs:115-118). The site's bands (site.css:360-363) have spread 2 = offset 2, ink/volt at 16.7.
- F2 [claim] The fixtures cover R2 F2/F3/F6 (bad-part.html; check.mjs:174-176).
- F3 [claim] Only previews are skipped (:145, :148). A sampled side of 0 fails (:127). Markers need 4.5 unless large (:96-98).
- F4 [defect] Outline alpha goes unchecked: `rgba(0,0,0,.08)` with a white band returns 99.
- F5 [defect] A band that doesn't touch the outline passes: offset 6 with spread 1 returns 99. R2 asked for spread ≥ offset.
- F6 [claim] Stale comment at :113 ("3:1") contradicts :114 and PROBES (9:1).
- F7 [premise] The Calm probe sets `data-calm` itself (:249). It never presses the switch.

**Verdict:** PASS. The site's rings are measured honestly. F4 and F5 are holes the site doesn't use.

**Requested change:** F4: require outline alpha 1. F5: require spread ≥ outline-offset. F6: delete :113. F7: click the switch.
