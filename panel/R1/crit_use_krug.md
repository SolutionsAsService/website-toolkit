# crit_use_krug, R1 (website-toolkit colour version)

- **Anchor used:** *Don't Make Me Think* (Krug): the five-second test, and the idea that visual hierarchy should show what matters most. Brighter, bigger things get looked at first.
- **Observed:** index_html-desk.png and index_html-phone.png; start_html-desk.png; src/site.css lines 10, 14, 126, 238, 254 and 265; compared against site-repo/panel/R2/index_html-desk.png.
  - At 1280, the loudest mass is the 10px acid-yellow frame on the right. The five doors sit on the left as white text on blue. "Start here" gets the same yellow disc as doors 2 to 5.
  - Yellow is used for six different things: pressed toggles (Signal, Built), the frame and runners, group G, door numbers, the active nav item, and the kicker.
  - At 375 the only button-shaped call to action is the yellow "All 18 parts →". It reads as the first thing to do, ahead of "Start here".
- **Findings:**
  - F1 [claim] The colour passes the five-second "what is this?" test. Blue and yellow say "kit, pieces, groups". The rainbow group pills help with scanning.
  - F2 [defect] The colour says nothing about where to start. At 1280 the yellow frame pulls the eye away from the doors, and "Start here" is no louder than "Fetch as an agent".
  - F3 [defect] At 375 the yellow "All 18 parts" button outranks "Start here". The colour puts browsing ahead of the brief's step 1.
  - F4 [defect] On start.html the step numerals use #b9d300 on #f7f5ff, which is 1.57:1. That fails the 3:1 large-text rule. The probe's 25/25 pass probably misses ::marker.
  - F5 [premise] One yellow meaning "pressed", "decoration" and "group G" all at once makes people decode it. It is small but real.
- **Verdict:** OBJECT
- **Requested change:**
  - F2: make "Start here" the one solid-yellow door (a filled pill with ink text) and keep doors 2 to 5 as they are now.
  - F3: on the phone, put that same filled "Start here" ahead of "All 18 parts", or make "All 18 parts" an outline button.
  - F4: give the numerals the ground colour (#2330d6).
  - F5: none required, but think about giving group G a non-yellow colour.
  - F1: none.
