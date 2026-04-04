# Build Checklist

## Build Preferences

- **Build mode:** Step-by-step
- **Comprehension checks:** Yes
- **Git:** Commit after each item with message: "Complete step N: [title]"
- **Verification:** Yes — per-item verification
- **Check-in cadence:** Balanced — brief explanations, mostly building

## Checklist

- [x] **1. Project scaffolding + domain types**
  Spec ref: `spec.md > Architecture Overview` + `spec.md > Domain Layer` + `spec.md > File Structure`
  What to build: Initialize Next.js 14 with App Router and TypeScript. Install all dependencies from the spec (Anthropic SDK, Zod, Readability, jsdom, Tailwind). Create the full folder structure: `src/domain/models/`, `src/domain/ports/`, `src/infrastructure/anthropic/`, `src/infrastructure/readability/`, `src/infrastructure/export/`, `src/hooks/`, `src/services/`, `src/components/`. Implement all domain types — `Card`, `CardType`, `Deck` in models; `CardGenerator`, `ContentExtractor` (with `ExtractedContent`), `DeckExporter` (with `ExportedFile`) as port interfaces. Create a mock deck factory (`src/lib/mock-data.ts`) with 5-6 sample cards (mix of question and fact types, varied topics) for use in upcoming UI steps.
  Acceptance: `mise run typecheck` passes with zero errors. All domain types are importable. Mock data factory returns a valid `Deck` object. Folder structure matches the spec diagram.
  Verify: Run `mise run typecheck` and confirm zero errors. Open `src/domain/models/card.ts` and `deck.ts` — confirm the types match the spec. Open `src/lib/mock-data.ts` — confirm it exports a function that returns a `Deck` with mixed card types.

- [x] **2. LandingHero + InputField + useInputDetection**
  Spec ref: `spec.md > Frontend > Components > LandingHero` + `spec.md > Frontend > Components > InputField` + `spec.md > Frontend > Hooks > useInputDetection`
  What to build: Build the landing page layout in `src/app/page.tsx`. Create `LandingHero` component with a short, warm explanation targeting 15-17 year olds — approachable tone, not developer-minimal. Create `InputField` component with a single input that auto-expands into a textarea as content grows. Implement `useInputDetection` hook that detects URL vs text via regex, exposes `inputType` ("url" | "text" | "empty") and tracks validation state. Wire the hook into InputField so the UI reacts to input type changes (e.g., show a subtle URL indicator). Style with Tailwind — warm colors, rounded corners, the Jungle-inspired approachable vibe from the scope doc. Set up `globals.css` with Tailwind base and any custom font/color tokens. No generation logic yet — the "Generate" button should be visible but disabled.
  Acceptance: Landing page loads with hero text and input field visible without scrolling. Typing a URL shows URL detection feedback. Typing plain text shows text mode. Input auto-expands for long text. Visual design feels warm and student-friendly, not developer-minimal. Generate button is present but non-functional.
  Verify: Run `mise run dev` and open localhost. Confirm: hero text is visible and reads naturally for a teenager. Paste a URL — confirm the input detects it. Paste a long paragraph — confirm the input expands. Confirm the overall vibe feels warm and inviting.

- [x] **3. FlashCard component + tap-to-flip**
  Spec ref: `spec.md > Frontend > Components > FlashCard`
  What to build: Create `FlashCard` component that displays a card's front side by default. Implement tap/click to flip with a CSS transform animation (rotateY). Show the topic tag and card number ("3 of 15") on each card. Add a small icon differentiating question cards (e.g., "?" icon) from fact cards (e.g., lightbulb icon). Style with warm design — rounded corners, soft shadows, approachable colors consistent with the landing page. Render 2-3 mock cards directly on the page below the input (temporary layout for visual testing — will be replaced by CardGrid in next step).
  Acceptance: Cards render with front content visible. Clicking/tapping a card flips it with a smooth animation to show the back. Topic tag and card number are visible. Question and fact cards have distinct icons. Cards look warm and student-friendly.
  Verify: Run `mise run dev`. Confirm cards render below the input. Click a card — confirm it flips smoothly. Check that question cards show "?" and fact cards show a lightbulb (or similar). Confirm card styling matches the warm vibe.

- [x] **4. CardGrid + scroll-reveal animation**
  Spec ref: `spec.md > Frontend > Components > CardGrid`
  What to build: Create `CardGrid` component that renders an array of `FlashCard` components in a scrollable layout. Implement scroll-reveal animation using the Intersection Observer API — cards should slide or fade into view one by one as the user scrolls down. Replace the temporary card rendering from step 3 with the CardGrid component. Feed it the full mock deck (all 5-6 cards) so there's enough to scroll through. The reveal animation should be smooth and feel playful — this is one of the "wow moments."
  Acceptance: Cards appear in a scrollable grid layout. Scrolling down reveals cards one by one with animation. The animation feels smooth and polished. All mock cards render correctly within the grid.
  Verify: Run `mise run dev`. Scroll down the page — confirm cards animate into view one at a time. Confirm the animation feels smooth, not janky. Confirm all mock cards display correctly with flip still working.

- [x] **5. LoadingState + StickyHeader**
  Spec ref: `spec.md > Frontend > Components > LoadingState` + `spec.md > Frontend > Components > StickyHeader`
  What to build: Create `LoadingState` component with animated placeholder card shapes that appear during generation. Use CSS animations (pulse/shimmer) for a playful feel. Keep it simple — draggable placeholders are a stretch goal per the PRD. Add a warm loading message ("Cooking up your study cards..."). Create `StickyHeader` component that appears after cards are generated — contains the "Export to Anki" button. Sticks to top of viewport while scrolling. Style the button clearly — single action, no format jargon. For now, wire a temporary state toggle so you can switch between loading state and card display to see both. Export button is non-functional yet.
  Acceptance: Loading state shows animated placeholder cards with a warm message. Sticky header appears with "Export to Anki" button when cards are visible. Header stays fixed while scrolling through cards. Header doesn't interfere with scroll-reveal animations.
  Verify: Run `mise run dev`. Toggle to loading state — confirm placeholder cards animate with a shimmer/pulse. Toggle to cards state — confirm the sticky header appears and stays fixed while scrolling. Confirm the header doesn't cover or break the scroll-reveal animation.

- [x] **6. Anki export adapter + useDeckExport hook**
  Spec ref: `spec.md > Infrastructure Layer > Anki Export Adapter` + `spec.md > Frontend > Hooks > useDeckExport`
  What to build: Implement `AnkiCsvExporter` class in `src/infrastructure/export/anki-csv-exporter.ts` that implements the `DeckExporter` port. Output format: tab-separated text with columns for front, back, and tags (topic + card type). File extension: `.txt`, UTF-8 encoding. Implement `useDeckExport` hook that takes a `Deck`, runs the exporter client-side, creates a Blob, and triggers download via `URL.createObjectURL`. Filename pattern: `{deck.title}-anki.txt`. Wire the StickyHeader's "Export to Anki" button to the hook using the mock deck.
  Acceptance: Clicking "Export to Anki" downloads a `.txt` file. Opening the file shows tab-separated content with front, back, and tags columns. Tags include both the topic and card type. File is valid for Anki import (tab-separated, UTF-8).
  Verify: Run `mise run dev`. Click the "Export to Anki" button. Open the downloaded file in a text editor. Confirm it's tab-separated with three columns. Confirm tags column contains topic and card type (e.g., "Photosynthesis question").

- [x] **7. Content extraction adapters**
  Spec ref: `spec.md > Infrastructure Layer > Readability Content Extractor` + `spec.md > Infrastructure Layer > Plain Text Content Extractor`
  What to build: Implement `ReadabilityExtractor` in `src/infrastructure/readability/readability-extractor.ts` — takes a URL, fetches it server-side with Node `fetch`, parses HTML with `jsdom`, runs `@mozilla/readability` to extract article content, returns `ExtractedContent`. Handle edge cases: unreachable URLs (throw with clear message), non-article pages (try Readability, fall back to `document.body.textContent` per spec open issue #2). Implement `PlainTextExtractor` in `src/infrastructure/readability/plain-text-extractor.ts` — minimal passthrough that wraps input text into `ExtractedContent`. Write a quick integration test or script that extracts content from a known public URL (e.g., a Wikipedia article) to verify Readability works.
  Acceptance: `ReadabilityExtractor` can fetch and parse a Wikipedia article into clean text + title. `PlainTextExtractor` wraps raw text into `ExtractedContent`. Both implement the `ContentExtractor` port interface. Edge cases (unreachable URL, non-article page) return appropriate errors or fallback content.
  Verify: Run a test script: `npx tsx src/infrastructure/readability/readability-extractor.test.ts` (or similar). Confirm it logs extracted text and title from a Wikipedia URL. Confirm `PlainTextExtractor` returns the input text unchanged.

- [x] **8. Anthropic card generator adapter**
  Spec ref: `spec.md > Infrastructure Layer > Anthropic Card Generator`
  What to build: Implement `AnthropicCardGenerator` in `src/infrastructure/anthropic/anthropic-card-generator.ts` — implements the `CardGenerator` port. Define a Zod schema matching the `Deck` type. Create the Claude tool definition with the schema as `input_schema`. Write the system prompt: role as study material expert for 15-17 year olds, constraints on language clarity, 10-20 cards for substantial content, minimum 2 for short input, quality rule (distillation over duplication), topic tagging. Handle the short input case per spec — instruct Claude to supplement when possible, always produce at least 2 cards. Use `@anthropic-ai/sdk` to call Claude with tool use. Parse the tool use response and map to domain `Deck` type. Write a quick test script that generates cards from a sample text passage to verify the prompt + schema work.
  Acceptance: Given a text passage, the adapter returns a valid `Deck` with cards that match the schema. Cards are a mix of question and fact types. Language is clear and appropriate for high school students. Short input produces at least 2 cards. The Zod schema enforces the structure at generation time.
  Verify: Run a test script with a paragraph about photosynthesis. Confirm it returns a `Deck` with 5+ cards. Check that cards have `type`, `front`, `back`, `topic`, and `cardNumber` fields. Confirm language is student-friendly. Test with a very short input (one sentence) — confirm it still produces at least 2 cards.

- [x] **9. API route + frontend wiring**
  Spec ref: `spec.md > API Layer > POST /api/generate` + `spec.md > Frontend > Hooks > useCardGeneration` + `spec.md > Frontend > Services`
  What to build: Create the `POST /api/generate` Route Handler in `src/app/api/generate/route.ts`. It receives `{ input, type }`, selects the appropriate `ContentExtractor` (Readability for URLs, PlainText for text), extracts content, passes it to `AnthropicCardGenerator`, and returns the `Deck` as JSON. Implement error handling with the three error codes from the spec (`UNREACHABLE_URL`, `EXTRACTION_FAILED`, `GENERATION_FAILED`) and student-friendly messages. Create `api-client.ts` in `src/services/` — typed fetch wrapper for the Route Handler. Implement `useCardGeneration` hook with the state machine: `idle → extracting → generating → done → error`. Wire everything together: InputField → useInputDetection → useCardGeneration → api-client → API route → adapters → CardGrid. Remove all mock data rendering — the app now uses real generation. Connect the loading state to the `extracting`/`generating` status.
  Acceptance: Pasting a URL and clicking Generate fetches the article and produces real flashcards. Pasting text and clicking Generate produces flashcards from that text. Loading state shows during generation. Generated cards display in the CardGrid with scroll-reveal. Errors show friendly messages. The full flow works end-to-end.
  Verify: Run `mise run dev`. Paste a Wikipedia URL, click Generate. Confirm: loading state appears, then real cards render with scroll-reveal. Flip a card — confirm it works. Paste a paragraph of text, click Generate — confirm cards appear. Paste an invalid URL — confirm a friendly error message appears. Export the generated cards — confirm the Anki file contains real content.

- [x] **10. URL validation endpoint**
  Spec ref: `spec.md > Frontend > URL Validation Endpoint` + `spec.md > Frontend > Hooks > useInputDetection`
  What to build: Create `GET /api/validate-url` Route Handler in `src/app/api/validate-url/route.ts`. It takes a `?url=` query param, performs a server-side HEAD request with a 5-second timeout, and returns `{ reachable: boolean }`. Wire `useInputDetection` to call this endpoint when a URL is detected — debounce the call (300-500ms after typing stops). Show inline validation feedback on the InputField: checkmark icon for reachable URLs, error icon + message for unreachable ones. Disable the Generate button for invalid URLs.
  Acceptance: Pasting a valid URL shows a checkmark after a brief delay. Pasting an invalid/unreachable URL shows an error icon with a friendly message. Generate button is disabled for invalid URLs. Validation doesn't fire on every keystroke (debounced).
  Verify: Run `mise run dev`. Paste a valid URL (e.g., Wikipedia) — confirm checkmark appears after ~500ms. Paste `https://thisisnotarealurl12345.com` — confirm error feedback appears. Confirm Generate button is disabled for invalid URLs. Type a URL character by character — confirm validation doesn't fire until you stop typing.

- [ ] **11. Polish + edge cases**
  Spec ref: `spec.md > Infrastructure Layer > Anthropic Card Generator` (short input) + `prd.md > What We'd Add` (animation polish)
  What to build: Test and refine short input handling — paste a single sentence, confirm Claude supplements or generates 2 cards. Test and refine error states — ensure all error messages are student-friendly and actionable. Responsive design check — confirm the layout works well on mobile viewport sizes (cards stack, input is usable, sticky header works). Fine-tune animations — scroll-reveal timing, flip animation smoothness, loading shimmer. Ensure the sticky header doesn't conflict with scroll-reveal (per spec open issue #3 — header yields to animations if needed). Add the expanding input transition animation (smooth grow from input to textarea).
  Acceptance: Short input produces cards without errors. Error messages are clear and helpful. Layout is responsive on mobile. Animations are smooth and polished. Sticky header doesn't interfere with card reveal.
  Verify: Run `mise run dev`. Test: paste one sentence → confirm cards generate. Test: resize to mobile width → confirm layout adapts. Test: scroll through cards → confirm reveal animation + sticky header coexist. Test: flip multiple cards rapidly → confirm animation stays smooth. Overall: would a 16-year-old find this app inviting and easy to use?

- [ ] **12. GitHub repo + Vercel deployment**
  Spec ref: `spec.md > Runtime & Deployment`
  What to build: Create a GitHub repo on the user's personal account with a descriptive name, description, and topic tags (nextjs, typescript, ai, flashcards, hackathon, hexagonal-architecture). Push all code. Set up Vercel deployment connected to the GitHub repo — configure `ANTHROPIC_API_KEY` as an environment variable in Vercel. Deploy and verify the live URL works end-to-end. Add the live URL to `NEXT_PUBLIC_APP_URL`. Confirm the deployed app can generate cards from a URL and from pasted text.
  Acceptance: Code is on GitHub with a clean commit history. Vercel deployment is live with a working URL. The deployed app generates cards from URLs and text. Anki export works on the deployed version.
  Verify: Open the Vercel URL in an incognito browser. Paste a Wikipedia URL, generate cards, flip a few, export to Anki. Confirm everything works the same as localhost.

- [ ] **13. Submit to Devpost**
  Spec ref: `prd.md > What We're Building` (the core submission story)
  What to build: Walk through the Devpost submission form. Write a project name and tagline. Draft the project story using scope.md and prd.md as source material — explain what you built, why, and what you learned. Highlight the two wow moments: clean hexagonal architecture and the scroll-reveal effect. Add "built with" tags for the tech stack (Next.js, TypeScript, Claude API, Tailwind, Vercel). Take screenshots of the working app: landing page, card generation in progress, cards with scroll-reveal, card flip, Anki export. Upload docs/ folder artifacts (scope, PRD, spec, checklist). Link the GitHub repo and the live Vercel URL. Review everything and submit.
  Acceptance: Submission is live on Devpost with project name, tagline, description, built-with tags, screenshots, docs artifacts, and repo link. All required fields are complete.
  Verify: Open your Devpost submission page and confirm the green "Submitted" badge appears. Read the project description — would someone who knows nothing about your project understand what it does and why it matters?
