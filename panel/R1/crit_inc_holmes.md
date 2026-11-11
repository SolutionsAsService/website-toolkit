# R1 · Critic: Inclusion (Holmes)

**Anchor used:** Kat Holmes, *Mismatch*: an exclusion is a mismatch; fix it for one person and the fix extends to many. Measured against WCAG 2.2 1.4.1 and 1.4.3.

**Observed:**
- Text contrast holds. I recomputed it: white on #2330d6 is 8.5:1, #e4ff3a on #2330d6 is 7.6:1, #474a6b on the page is 7.9:1. This matches checks.json.
- Every group fill carries its letter (A–G) in ink, so colour is never the only cue. Hue alone would fail: coral A against orange E is 1.5:1, and pink B against lilac F is 1.1:1.
- parts_index_html-desk.png shows A pink, B green and C blue. The landing shows A coral, B pink and C green. The cause is src/site.css:279–280: `.pgroup:nth-of-type(n)` also counts `section.pagehead`, so every group takes the next group's colour and G gets none.
- The landing's first screen is a full-bleed ultramarine band with an acid-yellow frame and seven high-chroma pills. There is no `prefers-contrast` rule and no calmer view, only reduced-motion and forced-colors.

**Findings:**
- F1 [defect] On the parts index, every group colour belongs to the next group, so colour points to the wrong group for anyone who learned it on the landing.
- F2 [claim] Contrast and the letter cues work for people with low vision and colour-vision differences.
- F3 [defect] People with migraine or visual stress have no lower-chroma way in. Nothing flashes, so WCAG 2.3 is met, but static glare remains a mismatch.
- F4 [premise] The brief asks for colour, so the saturation is legitimate. My blind spot is sanding it down. I ask for an option, not a retreat.

**Verdict:** OBJECT

**Requested change:**
- F1: Key each colour to its group with `.pgroup[data-group="A"]`, not to its position.
- F2: None.
- F3: Add `@media (prefers-contrast: more)` or a "Calm" view that keeps ink on paper and turns the ground down to a tint.
- F4: None.
