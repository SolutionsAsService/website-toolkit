# R1 — Critic: Evidence (Cairo)

**Anchor used:** *How Charts Lie* (Cairo): a figure is honest only if a reader can reproduce it from its source; omission misleads as much as a wrong number.

**Observed:** I ran `node build/check.mjs` myself: 12/12 checks, 18/18 parts, 375 bottom 795 (fallback fonts), 1280 bottom 749, 18/18 Cobalt, 18/18 Bare. build/checks.json restored. I recomputed every palette pair with the WCAG 2 luminance formula.

**Findings:**
- F1 [claim] src/site.css:8 "white on ultramarine 7.7:1" — measured 8.52:1. Unreproducible.
- F2 [claim] src/site.css:10 "ink on volt 17:1" — measured 16.66:1; rounds up past the truth.
- F3 [claim] src/site.css:11 "on-ground 6.4:1" — measured 6.68:1. :6 "muted 7.9:1" — 7.91:1, true.
- F4 [defect] Footer links: `.foot` is #0d0f2b (site.css:234) and no `.foot :focus-visible` override exists, so the ring is --focus #0d0f2b (site.css:15,26) — 1.00:1, invisible, on all 25 pages.
- F5 [defect] `.code .copy` sits over #12154a (site.css:242-243, :143) with the ink ring — 1.10:1 (parts/steps etc.).
- F6 [premise] Evidence says focus rings pass "in every theme": true only for parts. check.mjs:202 probes site pages for text contrast only; focusProbe (check.mjs:96) never runs on the site chrome. That omission hid F4/F5.
- F7 [claim] "746 with web fonts" at 375: check.mjs reproduces only 795 (fallback); 746 rests on screenshots alone.
- F8 [claim] Part palettes verified: accent/paper Signal 6.99, Riso 4.82, Cobalt 14.09, Mint 5.21; accent-ink 7.10/5.22/14.09/5.38; group tags with ink 6.64 (A) to 16.66 (G). Riso accent on surface #ffe27a is 4.08 — fails 4.5 for small text if ever used there.
- F9 [claim] site.css:1 still reads "signal orange on drafting paper" — stale.

**Verdict:** OBJECT

**Requested change:** F1–F3, F9 correct comments to measured values. F4 `.foot :focus-visible{outline-color:var(--volt)}` (16.66:1). F5 volt or white ring on `.copy`. F6 run focusProbe on site pages. F7 state font condition or measure it. F8 none.
