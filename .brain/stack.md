# Tech Stack

## Chosen Stack
| Layer | Choice | Rationale |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript | Fast setup, Vercel-native, Claude Code knows it well |
| AI | Anthropic SDK (`@anthropic-ai/sdk`) | Structured output via tool use for card generation |
| URL parsing | `@mozilla/readability` + `jsdom` | Strips boilerplate from articles before passing to Claude |
| Export | JSON + CSV (built-in, no lib needed) | Two formats, minimal extra work, high user value |
| Styling | Tailwind CSS | Fast, no design decisions needed |
| Deployment | Vercel free tier | Zero config, HTTPS, instant |

## Flashcard Data Model
```ts
interface Flashcard {
  front: string        // question / term
  back: string         // answer / definition
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]       // topic tags for Anki deck organization
}
```

## Anki-Compatible JSON Format
```json
{
  "deck": "Generated Deck",
  "cards": [
    {
      "front": "What is ...",
      "back": "It is ...",
      "tags": ["topic1", "topic2"]
    }
  ]
}
```

## Claude Prompt Strategy
Use tool use / structured output to enforce the flashcard schema:
- System prompt: "You are a flashcard generation expert. Generate study cards from the provided text."
- Tool: `generate_flashcards` with typed parameters matching the Flashcard interface
- Aim for 10-20 cards per generation; let user re-generate if unsatisfied

## Environment Variables
```bash
ANTHROPIC_API_KEY=        # required
NEXT_PUBLIC_APP_URL=      # set to Vercel URL in production
```

## File Structure (planned)
```
src/
  app/
    page.tsx              # main input + preview UI
    api/
      generate/route.ts   # POST: text/url → flashcards
      export/route.ts     # POST: flashcards → JSON or CSV download
  lib/
    claude.ts             # Anthropic client + generate_flashcards tool
    parser.ts             # URL fetch + Readability extraction
    export.ts             # JSON and CSV formatters
  components/
    InputForm.tsx         # URL / text toggle input
    CardPreview.tsx       # card grid preview
    ExportButtons.tsx     # JSON + CSV download buttons
```
