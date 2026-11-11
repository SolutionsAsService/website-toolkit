# R2 — Critic: Evidence (Cairo)

**Anchor used:** *How Charts Lie*: a measure is only as honest as its method; a test that cannot fail proves nothing.

**Observed:** I ran `node build/check.mjs`: 13/13, 18/18 parts, 1280 bottom 749, 375 bottom 807 (R1 795). checks.json restored. I re-tabbed all 25 pages myself and fed crafted rings to RING.

**Findings:**
- F1 [claim] Comments true: 7.91, 8.52, 16.66, 6.68 (site.css:6-11). R1 F1-F3, F9 closed.
- F2 [defect] Two-tone (check.mjs:112-113) reads the first shadow colour and ignores geometry: `4px 4px 0 #000` or `inset 0 -2px 0 #000` under a white ring on white returns 99, a pass.
- F3 [defect] "Differ by 3:1" guarantees nothing: #a3a3a3/#4d4d4d (3.35) on #707070 measures 1.96/1.71, and the probe passes it. WCAG C40 needs 9:1.
- F4 [claim] The real rings hold: 77 stops pass only through two-tone, at 16.66 or 18.74.
- F5 [premise] No fixture tests the exemptions; "fixture fails every probe" doesn't cover them.
- F6 [claim] 34 in-preview stops across 22 pages go unjudged in situ. check.mjs:133-134 contradicts :142.
- F7 [claim] elementsFromPoint excludes ancestors, so sides mostly fall back to parentElement, which ignores background-image and the hero's shadow band. With all sides off-screen the result is Infinity, a pass.
- F8 [premise] Numeral markers held to 3:1, but small text needs 4.5. Steps pass at 7.89.

**Verdict:** OBJECT (the instrument, not the site)

**Requested change:** F2/F3 require a spread ring (no offset or inset, spread ≥ outline-offset) and 9:1 tones. F5 add failing fixtures. F6 fix the comment. F7 fail when no side is sampled. F8 4.5 below large size.
