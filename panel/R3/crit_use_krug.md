# crit_use_krug, R3 (whole round, after the R2 fixes)

- **Anchor used:** *Don't Make Me Think* (Krug): the five-second test, the trunk test, and "omit needless words". A visual cue should mean one thing.
- **Observed:** index-signal-desk/phone.png, index-calm-phone.png, part-pricing-desk/phone.png; evidence.md ("Pressed toggles: white with a ✓ … Filled yellow is the first door only").
- **Findings:**
  - F1 [claim] My R2 F4 is fixed on the landing. The pressed Signal and Built are white with a ✓. On the phone, "Start here" (y≈679) is now the only filled yellow button.
  - F2 [claim] The five-second test passes at both widths: headline, then kit, then the door.
  - F3 [claim] The trunk test passes on part-pricing. It shows the logo, "Parts" underlined, the breadcrumb "PARTS · C CONTENT" and the name "C5 Pricing table".
  - F4 [defect] On part-pricing, "1280" and "Signal" are pressed as filled yellow blocks with no ✓. The evidence's "first door only" is true of the landing, not the site. Minor: no door competes there.
  - F5 [defect] Needless words: the "Passes" box is about 85 words of spec. On the phone it pushes Copy code down to y≈780.
  - F6 [premise] Under Calm, "Start here" loses its fill and the pressed Calm shows no ✓, unlike its siblings. Quiet is fine; the missing ✓ is not.
- **Verdict:** PASS
- **Requested change:**
  - F4: use the landing's white-with-✓ for pressed toggles on part pages.
  - F5: cut the box to "Passes all checks at 3 widths × 4 themes", with a "details" link.
  - F6: add the ✓ to the pressed Calm.
  - F1–F3: none.
