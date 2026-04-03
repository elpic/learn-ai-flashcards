# Learn AI Flashcards — Technical Spec

## Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14 (App Router) + TypeScript | Full-stack in one framework, Route Handlers for API, Vercel-native deployment |
| AI | `@anthropic-ai/sdk` with Zod schemas | Structured output via tool use enforces the flashcard schema at generation time |
| Content extraction | `@mozilla/readability` (v0.6.0) + `jsdom` | Battle-tested article extraction (powers Firefox Reader View) |
| Styling | Tailwind CSS | Utility-first, fast iteration, easy to hit the warm student-friendly vibe |
| Deployment | Vercel | Zero-config for Next.js, live URL for submission |

**Documentation links:**
- [Next.js App Router docs](https://nextjs.org/docs/app)
- [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Anthropic TypeScript SDK](https://github.com/anthropics/anthropic-sdk-typescript)
- [Claude tool use / structured output](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [@mozilla/readability](https://github.com/mozilla/readability)
- [jsdom](https://www.npmjs.com/package/jsdom)
- [Tailwind CSS docs](https://tailwindcss.com/docs)

## Runtime & Deployment

- **Runtime:** Web application (browser + Node.js server)
- **Deployment target:** Live Vercel URL for hackathon submission
- **Node version:** 18+ (Vercel default)
- **Environment variables:**
  - `ANTHROPIC_API_KEY` — required, server-side only
  - `NEXT_PUBLIC_APP_URL` — optional, for metadata/OG tags

## Architecture Overview

Hexagonal architecture (ports and adapters). The domain defines interfaces; infrastructure provides implementations. The frontend uses hooks as ports to separate UI components from domain logic.

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐      │
│  │ Components │──│   Hooks    │──│  API Client   │      │
│  │ (pure UI)  │  │  (ports)   │  │  (adapter)    │      │
│  └────────────┘  └────────────┘  └──────┬───────┘      │
│                                         │               │
├─────────────────────────────────────────┼───────────────┤
│                   API Layer             │               │
│                  Route Handlers ◄───────┘               │
│                       │                                 │
├───────────────────────┼─────────────────────────────────┤
│                 Domain Layer                            │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Models   │  │    Ports     │  │  Use Cases   │      │
│  │Card, Deck │  │(interfaces)  │  │(orchestrate) │      │
│  └──────────┘  └──────────────┘  └──────────────┘      │
│                       │                                 │
├───────────────────────┼─────────────────────────────────┤
│            Infrastructure Layer                         │
│  ┌───────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │  Anthropic    │ │ Readability  │ │  Anki Export  │   │
│  │  Adapter      │ │  Adapter     │ │   Adapter     │   │
│  └───────────────┘ └──────────────┘ └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Data flow for the core use case:**

```
User pastes input
  → useInputDetection() detects URL vs text
  → useCardGeneration() calls apiClient.generate(input)
    → POST /api/generate (Route Handler)
      → ContentExtractor port → Readability or PlainText adapter
      → CardGenerator port → Anthropic adapter (Claude tool use → Deck)
    → Returns Deck as JSON
  → Components render cards with scroll-reveal
  → useDeckExport() → downloads Anki-compatible file
```

## Domain Layer

Implements `prd.md > Card Generation` and provides the core types all other layers depend on.

### Models

#### Card

```typescript
type CardType = "question" | "fact";

interface Card {
  id: string;
  type: CardType;
  front: string;        // question or key concept
  back: string;         // answer or explanation
  topic: string;        // e.g. "Photosynthesis"
  cardNumber: number;   // position in deck (1-indexed)
}
```

- `QuestionCard`: `type = "question"` — front is a question, back is the answer
- `FactCard`: `type = "fact"` — front is a key concept/fact, back is deeper explanation

#### Deck

```typescript
interface Deck {
  id: string;
  title: string;          // derived from content by Claude
  cards: Card[];
  source: {
    type: "url" | "text";
    value: string;         // the original URL or first 200 chars of text
  };
  totalCards: number;
  generatedAt: string;     // ISO 8601
}
```

### Ports

#### ContentExtractor

```typescript
interface ContentExtractor {
  extract(input: string): Promise<ExtractedContent>;
}

interface ExtractedContent {
  text: string;           // cleaned article/passage text
  title?: string;         // page title if available
  sourceUrl?: string;     // original URL if applicable
}
```

Implements `prd.md > Content Input` — handles both URL and plain text inputs.

#### CardGenerator

```typescript
interface CardGenerator {
  generate(content: ExtractedContent): Promise<Deck>;
}
```

Implements `prd.md > Card Generation` — takes extracted content and produces a Deck of 2-20 cards.

#### DeckExporter

```typescript
interface DeckExporter {
  export(deck: Deck): ExportedFile;
}

interface ExportedFile {
  data: string;
  filename: string;
  mimeType: string;
}
```

Implements `prd.md > Export` — converts a Deck into a downloadable file.

## Infrastructure Layer

### Anthropic Card Generator

Implements `CardGenerator` port. Uses Claude via `@anthropic-ai/sdk` with tool use to enforce the card schema.

**Approach:** Define a Zod schema matching the `Deck` type, pass it as a tool definition. Claude returns structured JSON that matches the schema exactly. This guarantees type-safe output without post-processing.

**Claude system prompt strategy:**
- Role: "You are a study material expert creating flashcards for high school students (ages 15-17)"
- Constraints: clear language, no unnecessary jargon, 10-20 cards for substantial content, minimum 2 cards for short input
- Card mix: determine question vs. fact ratio based on content (not a fixed split)
- Quality rule: prioritize understanding and depth over surface-level recall — distillation, not duplication
- Topic tagging: derive a short topic label from the content

**Short input handling** (implements `prd.md > Content Input`, short text story): When input is very short (a sentence or two), the system prompt instructs Claude to infer additional context and expand where possible. If it can't meaningfully expand, it generates at least 2 cards from whatever is available. The app never errors on short input.

**Tool definition (conceptual):**

```typescript
const flashcardTool = {
  name: "generate_flashcards",
  description: "Generate a structured flashcard deck from the provided content",
  input_schema: {
    // Matches Deck type — title, cards array with type/front/back/topic/cardNumber
  }
};
```

**Docs:** [Claude structured output](https://platform.claude.com/docs/en/build-with-claude/structured-outputs), [TypeScript SDK](https://github.com/anthropics/anthropic-sdk-typescript)

### Readability Content Extractor

Implements `ContentExtractor` port for URL inputs. Uses `@mozilla/readability` + `jsdom` to fetch and parse web pages.

**Flow:**
1. Fetch the URL server-side (Node `fetch`)
2. Parse HTML into a DOM with `jsdom`
3. Run `Readability` to extract article content
4. Return `ExtractedContent` with cleaned text and page title

**Edge cases:**
- Non-article pages (homepages, login walls): Readability returns null — fall back to raw text content or return an error
- Unreachable URLs: caught at the API layer, returns a clear error message

**Docs:** [@mozilla/readability](https://github.com/mozilla/readability)

### Plain Text Content Extractor

Implements `ContentExtractor` port for pasted text. Minimal — wraps the input text into `ExtractedContent` with no title and no sourceUrl. Acts as a passthrough.

### Anki Export Adapter

Implements `DeckExporter` port. Exports as **tab-separated CSV** — this is Anki's native import format and requires no plugins or extensions.

**Format:**
```
front\tback\ttags
What is photosynthesis?\tThe process by which plants convert light energy into chemical energy\tPhotosynthesis question
```

- Column 1: front (question or concept)
- Column 2: back (answer or explanation)
- Column 3: tags (topic + card type, space-separated for Anki tag format)
- File extension: `.txt` (Anki's expected extension for text import)
- Encoding: UTF-8

**Why CSV over JSON:** Anki's built-in importer handles tab-separated text natively. JSON import requires a third-party plugin (like CrowdAnki or JsonImporter). For a zero-friction student experience, the format that works out of the box wins.

**Import instructions:** The export button downloads the file. Students open Anki → File → Import → select the file. Fields auto-map. No configuration needed.

## API Layer

### POST /api/generate

The single Route Handler that orchestrates the core flow.

Implements `prd.md > Content Input` and `prd.md > Card Generation`.

**Request:**
```typescript
{
  input: string;       // URL or pasted text
  type: "url" | "text"; // detected by frontend
}
```

**Response (success):**
```typescript
{
  deck: Deck;          // full deck with all cards
}
```

**Response (error):**
```typescript
{
  error: string;       // user-friendly message
  code: "UNREACHABLE_URL" | "EXTRACTION_FAILED" | "GENERATION_FAILED";
}
```

**Flow:**
1. Determine which `ContentExtractor` to use based on `type`
2. Extract content
3. Pass extracted content to `CardGenerator`
4. Return the generated `Deck`

**Error handling:** Each step can fail independently. The Route Handler catches errors from each adapter and returns appropriate error codes with student-friendly messages (e.g., "I couldn't reach that URL — double-check the link and try again").

## Frontend

### Hooks (Ports)

#### useInputDetection

Implements `prd.md > Content Input` — auto-detection and inline validation.

**State:**
```typescript
{
  value: string;
  inputType: "url" | "text" | "empty";
  isValidating: boolean;
  validationResult: "valid" | "invalid" | null;
}
```

**Behavior:**
- Detects URL vs text using a URL regex pattern
- When a URL is detected, triggers inline validation (HEAD request to `/api/validate-url` or similar lightweight check)
- Exposes `inputType` so the generation hook knows which extractor to request
- Manages the auto-expanding textarea behavior (tracks content length)

#### useCardGeneration

Implements `prd.md > Card Generation` and `prd.md > Waiting Experience`.

**State machine:**
```
idle → extracting → generating → done → error
                                  ↓
                                idle (reset)
```

**Exposes:**
- `status`: current state
- `deck`: the generated Deck (when done)
- `error`: error message (when error)
- `generate(input, type)`: triggers the flow
- `reset()`: returns to idle

#### useDeckExport

Implements `prd.md > Export`.

**Behavior:**
- Takes a `Deck`, runs the export logic client-side (no API call needed — CSV generation is trivial)
- Creates a Blob, triggers a download via `URL.createObjectURL`
- Filename: `{deck.title}-anki.txt`

### Components (Pure UI)

#### LandingHero

Implements `prd.md > First-Run Experience`.

- Short, warm explanation of what the app does
- Friendly tone aimed at 15-17 year olds
- Sits above the input field — no scrolling needed to start

#### InputField

Implements `prd.md > Content Input`.

- Single input that auto-expands into a textarea as content grows
- Inline URL validation feedback (checkmark/error icon)
- "Generate" button below the input
- Disabled state while generating

#### LoadingState

Implements `prd.md > Waiting Experience`.

- Placeholder card shapes appear during generation
- If time allows: draggable placeholder cards (stretch goal, see PRD "What We'd Add")
- Minimum: animated placeholders with a warm loading message ("Cooking up your study cards...")
- Playful feel — reinforces that studying can be enjoyable

#### CardGrid

Implements `prd.md > Card Display`.

- Scrollable layout of FlashCard components
- Scroll-reveal animation: cards appear one by one as the student scrolls
- Uses Intersection Observer API for scroll detection

#### FlashCard

Implements `prd.md > Card Display`.

- Displays front side by default
- Tap/click to flip with animation (CSS transform, stretch goal: spring animation)
- Shows topic tag and card number ("3 of 15")
- Small icon indicating question card vs. fact card
- Warm visual design — rounded corners, soft shadows, approachable colors

#### StickyHeader

Implements `prd.md > Export`.

- Appears after cards are generated
- Contains "Export to Anki" button
- Sticks to top of viewport while scrolling through cards
- If it conflicts with scroll-reveal animations, the header yields (animations take priority per PRD)

### URL Validation Endpoint

#### GET /api/validate-url

Lightweight endpoint for inline URL validation.

**Request:** `?url=https://...`

**Response:**
```typescript
{ reachable: boolean }
```

**Implementation:** Server-side HEAD request to the URL. Returns `reachable: true/false`. Timeout: 5 seconds. This runs server-side to avoid CORS issues with client-side URL checking.

## Data Model

No database. The app is stateless — all data lives in React state during a session.

| Data | Where it lives | Lifecycle |
|------|---------------|-----------|
| User input | `useInputDetection` hook state | Until page refresh |
| Generated Deck | `useCardGeneration` hook state | Until page refresh or reset |
| Export file | Generated on-demand, downloaded | Browser download |

## File Structure

```
learn-ai-flashcards/
├── src/
│   ├── domain/
│   │   ├── models/
│   │   │   ├── card.ts                    # Card, CardType, QuestionCard, FactCard types
│   │   │   └── deck.ts                   # Deck, ExportedFile types
│   │   └── ports/
│   │       ├── card-generator.ts          # CardGenerator interface
│   │       ├── content-extractor.ts       # ContentExtractor, ExtractedContent interfaces
│   │       └── deck-exporter.ts           # DeckExporter interface
│   ├── infrastructure/
│   │   ├── anthropic/
│   │   │   └── anthropic-card-generator.ts  # Claude tool use implementation
│   │   ├── readability/
│   │   │   ├── readability-extractor.ts     # URL → article text via Readability
│   │   │   └── plain-text-extractor.ts      # Passthrough for pasted text
│   │   └── export/
│   │       └── anki-csv-exporter.ts         # Deck → tab-separated Anki file
│   ├── app/
│   │   ├── layout.tsx                     # Root layout, fonts, metadata
│   │   ├── page.tsx                       # Landing page (LandingHero + InputField + CardGrid)
│   │   ├── globals.css                    # Tailwind base + custom styles
│   │   └── api/
│   │       ├── generate/
│   │       │   └── route.ts               # POST: orchestrates extract → generate → return deck
│   │       └── validate-url/
│   │           └── route.ts               # GET: lightweight URL reachability check
│   ├── hooks/
│   │   ├── useCardGeneration.ts           # State machine for generation flow
│   │   ├── useInputDetection.ts           # URL vs text detection + validation
│   │   └── useDeckExport.ts               # Client-side export + download
│   ├── services/
│   │   └── api-client.ts                  # Typed fetch wrapper for Route Handlers
│   └── components/
│       ├── LandingHero.tsx                # Explanatory header text
│       ├── InputField.tsx                 # Auto-expanding input + validation
│       ├── LoadingState.tsx               # Placeholder cards during generation
│       ├── CardGrid.tsx                   # Scrollable card layout + scroll-reveal
│       ├── FlashCard.tsx                  # Flip card with type icon + topic tag
│       └── StickyHeader.tsx               # Sticky export button bar
├── docs/                                  # Hackathon artifacts
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   └── spec.md
├── process-notes.md
├── .env.local                             # ANTHROPIC_API_KEY (not committed)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Key Technical Decisions

### 1. Tab-separated CSV over JSON for Anki export
**Decided:** Export as tab-separated `.txt` file
**Why:** Anki's built-in importer handles this natively. JSON import requires third-party plugins (CrowdAnki, JsonImporter). For high school students who may have never imported anything into Anki, the zero-plugin path wins.
**Tradeoff:** Loses some metadata (card type, topic as structured data). Mitigated by encoding topic + type in Anki tags column.

### 2. Tool use for structured output over prompt-and-parse
**Decided:** Use Claude's tool use with a Zod schema to enforce the Deck structure
**Why:** Guarantees valid JSON matching the schema. No regex parsing, no retry loops, no malformed output handling. The SDK + Zod peer dependency handles validation automatically.
**Tradeoff:** Slightly more setup than a raw prompt, but eliminates an entire class of runtime errors.

### 3. Client-side export over server-side
**Decided:** Generate the export file in the browser via `useDeckExport`
**Why:** The Deck is already in client state. CSV generation is trivial string concatenation. No reason to round-trip to the server.
**Tradeoff:** None meaningful — this is strictly simpler.

### 4. Hooks as frontend ports
**Decided:** Hooks (`useCardGeneration`, `useInputDetection`, `useDeckExport`) act as the port layer between UI components and services
**Why:** Keeps components pure (receive state, render UI). Hooks own state machines and side effects. Services handle API communication. Clean testability boundary.
**Tradeoff:** Adds a layer of indirection, but for an app with real state management needs (generation flow, validation, export), this pays for itself immediately.

## Dependencies & External Services

| Dependency | Purpose | Docs |
|-----------|---------|------|
| `next` (14.x) | Framework | [nextjs.org/docs](https://nextjs.org/docs) |
| `react`, `react-dom` (18.x) | UI library | [react.dev](https://react.dev) |
| `@anthropic-ai/sdk` | Claude API client | [GitHub](https://github.com/anthropics/anthropic-sdk-typescript) |
| `zod` (^3.25.0) | Schema validation for structured output | [zod.dev](https://zod.dev) |
| `@mozilla/readability` (0.6.0) | Article content extraction | [GitHub](https://github.com/mozilla/readability) |
| `jsdom` | DOM implementation for Readability | [npm](https://www.npmjs.com/package/jsdom) |
| `tailwindcss` | Utility CSS | [tailwindcss.com](https://tailwindcss.com) |

**External services:**
- **Anthropic API** — requires `ANTHROPIC_API_KEY`. Rate limits apply per API tier. No cost concerns for hackathon-scale usage.
- **Vercel** — free tier is sufficient. Automatic deployments from GitHub.

## Open Issues

1. **URL validation endpoint vs. client-side check:** The spec includes a `/api/validate-url` endpoint to avoid CORS issues. But this adds a server round-trip for every URL paste. Alternative: skip validation and let the generate endpoint return the error. Simpler, but the inline validation UX from the PRD is nicer. **Recommendation:** Keep the endpoint — the UX benefit justifies the minimal complexity.

2. **Readability fallback for non-article pages:** If a student pastes a URL to a page that isn't an article (homepage, app, etc.), Readability returns null. The spec currently treats this as an extraction error. Alternative: fall back to raw `document.body.textContent`. This would give Claude *something* to work with, but it might be garbage. **Recommendation:** Try Readability first, fall back to body text, let Claude decide if there's enough signal to generate cards.

3. **Scroll-reveal + sticky header conflict:** The PRD says animations win if there's a conflict. Practically, this means the sticky header might need to be hidden or transparent during the initial reveal sequence and become sticky only after the first few cards are visible. Worth testing during build — may be a non-issue in practice.
