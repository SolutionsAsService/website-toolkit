# crit_use_krug, R4 (whole round, after the R3 fixes)

- **Anchor used:** *Don't Make Me Think* (Krug): the five-second test, the trunk test, "omit needless words", and one cue meaning one thing.
- **Observed:** index-signal-desk.png, index-cobalt-calm-phone.png, part-pricing-phone.png, part-pricing-calm-desk.png; evidence.md (checks 14/14, "check line is one sentence, with the probes in a details element").
- **Findings:**
  - F1 [claim] My R3 F4 is fixed. On part-pricing, the pressed "1280" and "Signal" are ink with a ✓. Under Calm they are white with a ✓. The ✓ marks "pressed" everywhere now.
  - F2 [claim] My R3 F5 is fixed. The box now reads "Passes every check at 375, 768, 1280 px in 4 themes", with "What was checked" folded. On the phone, Copy code moved up to y≈578 from y≈780.
  - F3 [claim] My R3 F6 is fixed. The pressed Calm shows "✓ Calm" on the landing and on part-pricing.
  - F4 [claim] The five-second test still passes at desk. Headline, kit, then the yellow "Start here".
  - F5 [claim] The trunk test still passes on part-pricing: logo, "Parts" underlined, the breadcrumb and "C5 Pricing table".
  - F6 [premise] Under Calm on the phone, "Start here" is an outlined box. Steps 2–5 have no box, so it still reads as first, but only just.
- **Verdict:** PASS
- **Requested change:** F1–F5: none. F6: none required. Watch it if more boxed items join the step list.
