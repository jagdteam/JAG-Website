# jagd-website

JAGD team portfolio, live on Vercel (project `wood`). Remote `jagdteam/JAGD-Website` (public, org repo). `main` is the Astro rebuild with per-person pages (`/johnny`, `/andrew`, `/giuseppi`); the old 2026-01 Lovable/React site is archived on branch `archive/lovable-site` and tag `lovable-site-2026-01`.

Stack: Astro (static output), npm, Node 22. No CMS, no live data: team projects and people are content collections under `src/content/`; each member page is self-contained in `src/people/<name>/` (own Layout, components, content, styles).

Layout: `/` fixed team page, `/projects/<slug>` one per project, `/<name>` one per member. Each member owns `src/people/<name>/` and `src/pages/<name>.astro` (CODEOWNERS enforces it). Shared files need one other member's review.

Members: Johnny (JohnFok119), Andrew (adespinosa14), Giuseppi (giuseppi).

- Pushes to this org repo need Johnny's explicit go every time (not covered by the JohnFok119 standing go).
- State and history: `C:\Users\johnn\personal\private\projects\jagd-website\context.md`.
- Secrets: none expected. `.env*` is git-ignored anyway.
