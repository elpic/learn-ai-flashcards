# Learn AI Flashcards 🃏

## What This Is
AI Flashcard Generator built for the "Learning Hackathon: Spec Driven Development" on Devpost.
Paste a URL or text → get a structured, exportable flashcard deck (JSON/CSV, Anki-compatible).

## Read First
All challenge context, roadmap, stack decisions, and scope boundaries are in `.brain/`:
- `.brain/challenge.md` — hackathon rules, judging criteria, what wins the feature callout
- `.brain/context.md` — project scope (in/out), core user flow, why this idea was chosen
- `.brain/roadmap.md` — phase-by-phase plan with deadline (Apr 29, submit by Apr 14)
- `.brain/stack.md` — tech stack, flashcard data model, Claude prompt strategy, file structure

## Stack
- Next.js 14 (App Router) + TypeScript
- Anthropic SDK (`@anthropic-ai/sdk`) — structured output via tool use
- `@mozilla/readability` + `jsdom` — URL parsing
- Tailwind CSS
- Vercel deployment

## Explicit Out of Scope
Do NOT add: user accounts, saved decks, spaced repetition engine, image cards, card editing UI.
Keep it simple — simple app + excellent docs is the winning strategy for this hackathon.

## Dev Commands
```bash
npm run dev
```

## Env Vars
```bash
ANTHROPIC_API_KEY=
NEXT_PUBLIC_APP_URL=
```
