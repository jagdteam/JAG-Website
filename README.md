# JAGD website

## What this is

A team portfolio: one fixed team page, one page per project, and one free page per member.

## Run

```
npm install
npm run dev
npm run build
```

## Layout

- `/` team page
- `/projects/<slug>` one page per project
- `/johnny`
- `/andrew`
- `/giuseppi`

## Ownership

Each member owns `src/people/<name>/` and their `src/pages/<name>.astro`. This is enforced by CODEOWNERS.

Shared files need one other member's review: `src/layouts`, `src/components`, `src/styles`, `src/pages/index.astro`, `src/pages/projects/`.

## Status

Scaffold only. Every section is a labeled placeholder.
