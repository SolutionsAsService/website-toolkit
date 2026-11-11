# R4 · Critic: Inclusion (Holmes)

**Anchor used:** Holmes, *Mismatch*: a fix for one person extends to many only if people can reach it wherever they arrive and understand it before choosing it.

**Observed:**
- `button.calm` with `aria-describedby="calm-desc"` now sits in the header of index, start, agents, sandbox, 404 and parts/pricing.html. site.js reads `wt-calm` on load and turns it off in place.
- part-pricing-calm-phone.png: "✓ Calm" is remembered on the inner page. The pressed 1280 and Signal buttons and the C5 chip are white with an ink inset. "Copy code" stays blue, as the gloss promises.
- site.css:387–389 adds calm rules for the pressed states, `.pcode.big` and the chips.
- `#calm-desc` is `.sr` (visually hidden, site.css:391). "Bare", by contrast, has a visible gloss.

**Findings:**
- F1–F3 [resolved, unchanged from R3].
- F4 [resolved] The switch is on every page: calm can be turned on or off wherever someone lands.
- F5 [resolved] Pressed states and chips are no longer yellow in calm mode.
- F6 [defect→mostly resolved] Screen readers now announce the gloss. Sighted touch newcomers still see the bare word "Calm" with no hint, and a phone has no hover title.
- F7 [claim] I could not check the evidence's 14/14 result myself. I relied on checks.json and the screenshots.

**Verdict:** PASS

**Requested change:**
- F1–F5: none.
- F6 (optional): Show a short visible gloss once, under the switch or in the footer, such as "Calm: pale frame, ink type". "Bare" already has one.
