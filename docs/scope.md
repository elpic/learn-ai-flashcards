# Learn AI Flashcards

## Idea
A zero-friction AI flashcard generator: paste a URL or text, get a focused, Anki-compatible flashcard deck that distills the material into what actually matters for studying.

## Who It's For
**High school students (ages 15-17)** who struggle to break down study material into what they need to know. They stare at a dense article or textbook passage and freeze — not because they can't learn, but because they don't have a structured process (a "recipe") for decomposing material into digestible pieces. This app does that decomposition for them, turning raw content into a clear study roadmap.

## Inspiration & References
- **[Scholarly](https://scholarly.so/)** — Clean, approachable visual style. Takes URLs and generates flashcards. But wrapped in a heavy platform with study modes, progress tracking, accounts. Too much.
- **[Jungle](https://jungleai.com/)** — Warm, student-friendly design energy. Over 1M students. Comfortable feel that doesn't intimidate. Good model for the visual vibe.
- **[Anki-Decks](https://anki-decks.com/)** — Closest to the core mechanic (AI generates Anki-compatible decks), but again a full platform with accounts and saved decks.

**Design energy:** Warm, approachable, comfortable for high school students. Not developer-minimal, not academic-heavy. Think Jungle's visual warmth — inviting, not intimidating. The UI should feel like something a 16-year-old opens and immediately understands.

## Goals
- **For students:** Give them a "study recipe generator" — paste in raw material, get back a structured set of cards that tells them exactly what to know.
- **For the hackathon:** Produce a tight, simple app with excellent documentation that demonstrates spec-driven development. Simple app + great docs wins.
- **For Pablo:** Write clean, well-architected code following hexagonal architecture (ports and adapters). The codebase should be extensible — quiz mode, YouTube support, model swaps — without rewrites. Code quality matters as much as the demo.

## What "Done" Looks Like
A deployed Vercel app where you can:
1. Paste a URL (Wikipedia article, public web page) or raw text (copied textbook passage, lecture notes)
2. Watch Claude generate 10-20 focused, high-quality flashcards that distill the essential concepts
3. Preview the cards in a clean, student-friendly UI
4. Export as Anki-compatible JSON or CSV

The cards should test understanding, not just recall. Fewer, deeper cards beat many shallow ones — the whole point is distillation, not duplication. If the app generates 50 surface-level cards, it's failed.

The code follows ports and adapters: domain (flashcard model, generation logic, export formatting) is cleanly separated from infrastructure (Anthropic SDK, Readability parser, Next.js route handlers).

## What's Explicitly Cut
- **User accounts / saved decks** — no auth, no persistence. Paste and go.
- **Spaced repetition engine** — Anki already does this. We feed it, not replace it.
- **Quiz mode / answering questions** — great future feature, wrong phase. Export to Anki gives students the quiz experience.
- **YouTube URL support** — natural extension, but adds parsing complexity that doesn't fit in 3-4 hours.
- **Image cards** — text-only for now.
- **Card editing UI** — students export and edit in Anki if needed.
- **Paywalled / authenticated URLs** — public pages only.
- **Mobile app** — responsive web is fine; no native app.

## Loose Implementation Notes
- **Stack:** Next.js 14 (App Router) + TypeScript, Anthropic SDK, `@mozilla/readability` + `jsdom`, Tailwind CSS, Vercel deployment.
- **Architecture:** Hexagonal / ports and adapters. Domain layer defines the flashcard model and generation interface. Infrastructure adapters implement Anthropic API calls, URL parsing, export formatting. Frontend separates UI components from domain logic through clean boundaries.
- **Card generation strategy:** Claude via structured output (tool use) to enforce the flashcard schema. System prompt tuned for high school level — clear language, no unnecessary jargon. Target 10-20 cards per generation, prioritizing depth over breadth.
- **Export:** Anki-compatible JSON format + CSV. No external libraries needed.
