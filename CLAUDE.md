# jagd-website

JAG team portfolio, live on Vercel (project `wood`). Remote `jagdteam/JAG-Website` (public, org repo). `main` is the Astro rebuild with per-person pages (`/johnny`, `/andrew`, `/giuseppi`); the old 2026-01 Lovable/React site is archived on branch `archive/lovable-site` and tag `lovable-site-2026-01`.

Stack: Astro (static output), npm, Node 22. No CMS, no live data: team projects and people are content collections under `src/content/`. All three member pages share one set of code, `src/components/member/` (page, cards, side-panel showcase, gallery, styles) plus `src/layouts/MemberLayout.astro`; a member's own words live only in `src/people/<name>/`: `data.ts` and Markdown in `content/projects/` and `content/experience/` (collections `memberProjects` and `memberExperience` in `src/content.config.ts`). Change a card's look once, in the shared code, not per member.

Layout: `/` fixed team page, `/projects/<slug>` one per project, `/<name>` one per member. Each member owns `src/people/<name>/` and `src/pages/<name>.astro` (CODEOWNERS enforces it). Shared files, including all member page code, need one other member's review. Johnny's CliCR demo tests: `node --test src/people/johnny/tests/clicr-demo/*.test.mjs`.

Members: Johnny (JohnFok119), Andrew (adespinosa14), Giuseppi (giuseppi).

- Pushes to this org repo need Johnny's explicit go every time (not covered by the JohnFok119 standing go).
- State and history: `C:\Users\johnn\personal\private\projects\jagd-website\context.md`.
- Secrets: none expected. `.env*` is git-ignored anyway.

## Issue Log

- **Project page "← Back" can send visitors to /johnny.** Found 2026-11-02. Resolved: Open. `src/pages/projects/[slug].astro` only calls `history.back()` when `document.referrer` is same-origin; a visitor who arrives in a new tab (links with `target="_blank" rel="noreferrer"`) or directly lands on the hardcoded fallback `/johnny`, even if they came from `/andrew` or `/giuseppi`. No member page links there anymore (every project and BeesEye opens in place, in the side panel); the fallback itself is still open in the shared file.
