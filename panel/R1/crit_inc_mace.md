# R1 — Critic: Inclusion (Mace)

**Anchor used:** The Principles of Universal Design (Mace et al.), Principle 4 "Perceptible Information": essential information shown in redundant modes, legible against its surroundings, in every mode.

**Observed:** Served site/ on :8817. Playwright Tabbed through index, parts/index, start, parts/pricing, templates/index, sandbox at 1280x800 and 375x812, normal and `forcedColors: 'active'`. I sampled ring pixels against the pixels just outside them.

**Findings**
- F1 [defect] Footer links ("Registry for agents", "Source"; `.foot a`) get the global `:focus-visible` ink #0d0f2b ring on the new ink `.foot` ground: 1.00:1 on all four sides, every page, both widths. The ring cannot be seen. The colourway overrides `.top` and `.hero` but not `.foot`.
- F2 [premise] The evidence's focus-ring probe covers the 18 parts alone. On the 25 site pages it ran only text contrast. That is why F1 got through.
- F3 [defect] Forced colours: `.tbtn[aria-pressed="true"]` and `.bare button[aria-pressed="true"]` show "pressed" only through a volt fill and border. That fill is lost, so Signal and Built look the same as the other buttons. The state is carried by colour alone.
- F4 [claim] The yellow rings work. Header nav at 375, the sprue `.tbtn` buttons and `.piece:focus-within` all show volt on ultramarine or ground-deep at about 8:1 or better. Next to a pressed yellow button it merges on one side; the 2px gap keeps it readable.
- F5 [claim] `.skip` has an ink ring on the ultramarine header, 2.2:1. The ink pill itself carries the focus, so this is minor.
- F6 [claim] Forced colours: the rings show on all six pages. Current nav item keeps bold weight, chips keep letters (A1, B1…), so group colour has a second channel.

**Verdict:** OBJECT

**Requested change**
- F1: `.foot :focus-visible { outline-color: var(--volt); }`.
- F2: run the focus-ring probe on the site pages too, including the footer.
- F3: give the pressed state a second channel that forced colours keep. Add `@media (forced-colors: active) { [aria-pressed="true"] { background: SelectedItem; color: SelectedItemText; } }`, or a ✓.
- F4–F6: none.
