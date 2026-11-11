# R1 — Critic: Provocateur (Debord)

**Anchor used:** *The Society of the Spectacle* (Debord), thesis 1 ("all that was directly lived has moved away into a representation") and thesis 193 (the commodity re-labelled, its old content intact).

**Observed:**
- `grep -i site-repo` over the repo (excluding node_modules, panel): hits only in DESIGN-LOG.md (lineage, honest) and the git commit message. None in site/, README, llms.txt, AGENTS.md or the deploy configs, and the GitHub links are updated.
- `src/site.css:1`, copied to `site/assets/site.css:1`: "website-toolkit: the kit. An injection-moulded sprue in signal orange on drafting paper." This is site-repo's line 1 with the name swapped. The palette is now ultramarine #2330d6 and acid yellow #e4ff3a.
- `build/check.mjs:247` names the Riso assertion `citrus` (a site-repo theme), and `checks.json` publishes `"citrus": true`.
- Contrast notes in `src/site.css`: muted on paper is 7.91 (claim 7.9, true); ink on volt is 16.66 (claim 17, rounded); white on ground is 8.52 (claim 7.7, wrong but understated).
- checks.json matches the evidence: 12 site checks, 18/18 parts, 25 pages at both widths, bottoms 749 and 795, Cobalt 18/18, Bare 18/18. 4 themes and 15 tokens confirmed.

**Findings:**
- F1 [claim] The stylesheet header still describes "signal orange on drafting paper" under the new name. The name changed and the description did not.
- F2 [defect] The check's Riso probe is still called `citrus`, and that name is published in checks.json.
- F3 [claim] The comment "white on it is 7.7:1" is wrong; the measured value is 8.52.
- F4 [premise] The `sr-` / `sr:part` namespace is site-repo's initials, kept as the public API. This is a defensible convention, but nothing explains it.

**Verdict:** OBJECT (F1 only; the rest is minor)

**Requested change:**
- F1: rewrite line 1 to match the ultramarine/yellow palette.
- F2: rename `citrus` to `riso`.
- F3: change the comment to 8.5:1.
- F4: one line in AGENTS.md saying what `sr` stands for, or none.
