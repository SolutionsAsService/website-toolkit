# R4: Critic: Evidence (Cairo)

**Anchor used:** *How Charts Lie*: a figure is honest only if it covers the cases it claims.

**Observed:** I ran `node build/check.mjs` and got 14/14 checks and 18/18 parts, exit 0, matching checks.json. I restored checks.json with git checkout. I fed crafted rings to `__ring` and clicked the header Calm on three inner pages. My temporary probe scripts in build/ are deleted.

**Findings:**
- F1 [claim] R3 F4 is fixed: the two-tone path needs `oc.a >= 1` (check.mjs:115), and the Alpha fixture fails (:173). An 8% outline scores 1.15.
- F2 [claim] R3 F5 is fixed: spread ≥ max(1, offset) (:115). Offset 6 with spread 1 is now sampled (4.69), not given 99.
- F3 [claim] R3 F6 and F7 are fixed: :113 says 9:1, and the probe clicks `.top .calm` (:248, :257). The ✓ and aria-pressed are confirmed.
- F4 [defect] On parts/index.html, calm leaves 7 `.gl` spines coloured. `.pgroup[data-group] .gl` (site.css:288-289) outranks `html[data-calm] .gl` (:389). This contradicts DESIGN-LOG:331.
- F5 [defect] The spine probe covers only the landing and omits `.gl` (check.mjs:261), so the label at :267 overclaims.
- F6 [premise] On inner pages, nothing asserts that the click set `data-calm`.
- F7 [defect, minor] A negative outline-offset with spread 1 still scores 99.

**Verdict:** OBJECT. The instrument fixes hold, but the calm claim fails on parts/index.

**Requested change:** F4: raise the calm `.gl` specificity. F5: probe `.gl` on every page. F6: assert `data-calm`. F7: require offset ≥ 0.
