# R3 · Critic: Inclusion (Holmes)

**Anchor used:** Holmes, *Mismatch*: a fix for one extends to many only if it can be reached from wherever people arrive (WCAG 2.2 1.4.3).

**Observed:**
- site.css:13 adds `--brand`, which stays ultramarine in calm mode. `.btn` (237), `.kicker` (234), `.pcode` (240) and `.steps-h li::marker` (293) use it. checks.json adds a passing calm and prefers-contrast probe for every page.
- part-pricing-calm-phone.png: the kicker, C5 chip and "Copy code" are all legible.
- The `class="calm"` button exists only in site/index.html. site.js remembers the choice, but the inner pages have no switch.
- The same screenshot shows yellow pressed "1280" and "Signal" buttons and a yellow C5 chip, although the title promises "no saturated colour, on every page".

**Findings:**
- F1 [resolved] Group colours match their groups.
- F2 [claim, holds] Letter cues stay in calm mode, where all `--g-*` become paper.
- F3 [defect→resolved] Calm no longer erases buttons, kickers or numerals, and the check now tests it.
- F4 [defect, partly resolved] The Calm switch exists, but only on the landing. Someone who arrives from search on a part page cannot turn calm on. Someone who turned it on cannot turn it off where they are.
- F5 [defect, minor] Calm still shows yellow fills on inner pages, against its own promise.
- F6 [defect, minor] The only gloss for "Calm" is a `title`, which touch and most screen-reader users never hear.

**Verdict:** OBJECT (narrow)

**Requested change:**
- F1–F3: none.
- F4: Put the Calm switch in `.top` on every page.
- F5: Under `[data-calm]`, make the pressed states and `.pcode.big` white with an ink inset.
- F6: Add a visible one-line gloss, or an `aria-describedby`.
