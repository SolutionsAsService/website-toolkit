# crit_use_krug, R2 (website-toolkit after the R1 colour fixes)

- **Anchor used:** *Don't Make Me Think* (Krug): the five-second test, and the rule that the most important thing should be the most prominent. A cue signals only when it means one thing.
- **Observed:** index-signal-desk.png, index-signal-phone.png; src/site.css lines 126 and 291–292; checks.json (`"marker": true`).
  - Desk: "Start here" is now the one filled yellow door, and doors 2–5 are rows with discs. The 10px yellow frame is still the largest bright mass. The pressed "Signal" and "Built" toggles are filled yellow pills too.
  - Phone: "All 18 parts →" is now an outline, and "Start here" is a filled pill at about y=679, inside 812. Above it are two filled yellow pills ("Signal", "Built"), and they are seen first.
- **Findings:**
  - F1 [claim] The R1 F2 fix works. On desk, the eye goes from the headline to the filled "Start here" in under five seconds.
  - F2 [claim] The R1 F3 fix works. The outlined "All 18 parts" no longer outranks step 1.
  - F3 [claim] The R1 F4 fix holds. The markers now use `--ground`, and the probe now checks list markers.
  - F4 [defect] "Filled yellow pill" means two things: "start here" and "this toggle is on". On the phone the toggles come first, so the first yellow buttons a visitor meets are settings, not the door.
  - F5 [premise] The yellow frame still out-shouts the door on desk. It frames the kit rather than competing with a call to action, so I can live with it.
- **Verdict:** PASS, with F4 open as a small defect.
- **Requested change:**
  - F4: make the pressed toggles ink-on-white or yellow-outlined, so filled yellow belongs to "Start here" alone.
  - F1, F2, F3, F5: none.
