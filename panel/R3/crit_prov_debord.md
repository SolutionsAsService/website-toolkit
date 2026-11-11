# R3 — Critic: Provocateur (Debord)

**Anchor used:** *Society of the Spectacle*, thesis 10: the spectacle is "the affirmation of appearance". A label must not promise more than its effect.

**Observed:**
- The R2 resolutions hold. agents.html:49 matches PROBES at check.mjs:34, which now lists markers and asks for an unshifted, unblurred band at 9:1. A ring with no sampled side scores 0.
- The Calm title (index.html:37) promises "no saturated colour, on every page". css:312 concedes that `--brand` stays ultramarine.
- I measured Calm with Cobalt and Mint in Playwright: `--g-c` is #e4ff3a, and Cobalt's miniature paper is #101a5c. The spine sets at css:366–368 follow `html[data-calm]` at equal specificity, so they win (also under `prefers-contrast`).
- The calm probe (check.mjs:247) covers Signal only, and only contrast.
- check.mjs:115 keeps the old "3:1 away" comment above its replacement.

**Findings:**
- F1 [claim] "No saturated colour" is false: ultramarine stays, Cobalt and Mint keep an acid spine, and Cobalt keeps navy miniatures.
- F2 [defect] The colourway spines override calm, because they come later in the cascade.
- F3 [claim] DESIGN-LOG M8 says the calm blocks "share one rule set". They are two hand-copied blocks.
- F4 [defect] The stale 3:1 comment contradicts the 9:1 code.

**Verdict:** OBJECT. The Calm button promises more than it does.

**Requested change:**
- F1: reword the title ("pale ground, ink type; controls stay blue"), or calm the spines and miniatures.
- F2: scope the spines with `:not([data-calm])`, and probe calm in every colourway.
- F3: generate one block, or reword the log.
- F4: delete the comment.
