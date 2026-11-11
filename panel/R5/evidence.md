# R5 evidence: re-judging Cairo's R4 objection after M10

The re-judge covers Cairo's R4 findings F4–F7 (panel/R4/crit_evid_cairo.md). The other five seats passed R4.

- F4: src/site.css now has `html[data-calm] .pgroup[data-group] .gl` and its media twin `.pgroup[data-group] .gl` set to white.
- F5: the calm probe in build/check.mjs checks `.runner-tag, .piece-link b, .gl` on every site page in both modes (prefers-contrast, and the clicked switch).
- F6: the probe asserts `data-calm` after each click.
- F7: the two-tone rule requires outline-offset ≥ 0.

`node build/check.mjs`, run after the last edit, gave 14/14 checks and 18/18 parts (panel/R5/checks.json).
