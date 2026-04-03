# Learn AI Flashcards — Product Requirements

## Problem Statement
High school students (ages 15-17) struggle to break down dense study material into what they actually need to know. They stare at an article or textbook passage and freeze — not because they can't learn, but because they lack a structured process for decomposing content into digestible pieces. Existing tools (Scholarly, Jungle, Anki-Decks) solve this but wrap it in heavy platforms with accounts, progress tracking, and study modes. Students need a zero-friction path: paste material, get cards, export to Anki.

## User Stories

### Content Input

- As a high school student, I want to paste a URL or text into a single input field so that I don't have to figure out which mode to use.
  - [ ] A single input field is presented on the landing page below the explanatory text
  - [ ] If the input is a valid URL, the app detects it automatically — no mode toggle needed
  - [ ] If the student pastes a large block of text, the input gracefully expands into a textarea while maintaining the same visual style
  - [ ] If a URL is pasted, inline validation checks reachability immediately and shows feedback in place (valid/invalid) before the student triggers generation
  - [ ] If an invalid or unreachable URL is pasted, the student sees a clear, friendly inline error — no generation is attempted

- As a high school student, I want to paste short text and still get useful cards so that even a quick paragraph gives me something to study.
  - [ ] If the input text is very short (a sentence or two), the app attempts to supplement it with additional context to produce meaningful cards
  - [ ] If supplementing isn't possible, the app generates at least two cards from whatever content is available
  - [ ] The app never shows an error for "too little text" — it always tries to produce something

### Card Generation

- As a high school student, I want the app to generate 10-20 focused flashcards so that I get a distilled study set, not a wall of shallow facts.
  - [ ] Generation produces between 2 and 20 cards depending on input depth
  - [ ] Cards prioritize understanding and depth over surface-level recall
  - [ ] Cards use clear language appropriate for a 15-17 year old — no unnecessary jargon
  - [ ] Each card is tagged with a topic label (e.g., "Photosynthesis") and a card number (e.g., "3 of 15")

- As a high school student, I want cards that are a mix of questions and facts so that I get tested on some concepts and can memorize key information on others.
  - [ ] Some cards are question-type (front: question, back: answer)
  - [ ] Some cards are fact-type (front: key concept/fact, back: deeper explanation or context)
  - [ ] Each card displays a small icon indicating whether it's a question card or a fact card
  - [ ] The mix of question vs. fact cards is determined by the content — not a fixed ratio

### Waiting Experience

- As a high school student, I want something engaging to interact with while cards are being generated so that waiting doesn't feel boring.
  - [ ] During generation, placeholder cards appear on screen that the student can drag around
  - [ ] The wait state feels playful — reinforcing that studying can be enjoyable
  - [ ] When generation completes, the placeholder cards are replaced by real flashcards with a scroll-reveal animation (cards appear one by one as the student scrolls)

### Card Display

- As a high school student, I want to browse my flashcards in a clean, visual layout so that studying feels approachable, not overwhelming.
  - [ ] Cards are displayed in a scrollable layout with scroll-reveal animations (cards slide/fly into view as the student scrolls down)
  - [ ] Tapping/clicking a card flips it with a smooth animation to reveal the back side
  - [ ] The topic tag and card number are visible on each card
  - [ ] The question/fact icon is visible on each card

### Export

- As a high school student, I want to export my cards to Anki with one button so that I can study them with spaced repetition without figuring out file formats.
  - [ ] A sticky header remains visible as the student scrolls through cards
  - [ ] The header contains an "Export to Anki" button — no format choice, no jargon
  - [ ] The sticky header does not interfere with card reveal animations — if conflict arises, animations take priority
  - [ ] Clicking export downloads an Anki-compatible file that can be imported directly into Anki

### First-Run Experience

- As a first-time visitor, I want to immediately understand what the app does so that I can start using it without instructions.
  - [ ] The landing page shows a short, warm explanation of what the app does
  - [ ] The input field is directly below the explanation — no scrolling or navigation needed to start
  - [ ] The overall visual feel is warm and approachable (inspired by Jungle's design energy) — not developer-minimal, not academic-heavy
  - [ ] A 16-year-old can open the app and understand what to do within seconds

## What We're Building
- Single smart input field with auto-detection (URL vs. text) and inline URL validation
- Auto-expanding input that grows into a textarea for long text
- AI-powered card generation via Claude (structured output, 10-20 cards, high school reading level)
- Two card types: question cards and fact cards, each with a distinguishing icon
- Topic tags and card numbers on every card
- Scroll-reveal animations for card display
- Tap-to-flip card interaction with flip animation
- Sticky header with single "Export to Anki" button
- Anki-compatible export (format chosen by app, not the student)
- Warm, student-friendly visual design
- Short landing explanation + immediate input access
- Graceful handling of short input (supplement or generate minimal cards)
- Playful loading state with draggable placeholder cards

## What We'd Add With More Time
- **Draggable placeholder cards during loading** — the playful wait state where students can toss cards around. Core to the "joy of studying" vision but complex to build in time. A simpler animated loading state can substitute.
- **Card flip animation** — the satisfying flip when tapping a card. A simpler show/hide or fade transition works as a fallback.
- **YouTube URL support** — natural extension for students who learn from video, but adds transcript parsing complexity.
- **Quiz mode** — let students answer questions and get scored, like Scholarly/Jungle. Great future feature, but Anki export already gives the quiz experience.
- **Multiple export formats** — giving students a choice between JSON, CSV, or .apkg. One format is enough for now.

## Non-Goals
- **User accounts or saved decks** — no auth, no persistence. Paste and go. The app is stateless by design.
- **Spaced repetition engine** — Anki already does this. We feed Anki, we don't replace it.
- **Card editing UI** — students export and edit in Anki if they want to customize cards.
- **Paywalled or authenticated URLs** — public pages only. No login proxying.
- **Mobile native app** — responsive web is sufficient. No App Store deployment.
- **Image cards** — text-only cards for this version.

## Open Questions
- **Anki export format:** Should the default be JSON or CSV? Both are importable into Anki. CSV is simpler; JSON preserves more metadata (topic tags, card type). Needs answering before /spec.
- **"Supplement short input" behavior:** When the input is very short, how does the app find additional context — does Claude infer and expand, or does it search? This affects the generation prompt design. Can be resolved during /spec.
- **Sticky header vs. animation conflict:** If the sticky header visually conflicts with scroll-reveal animations, the animations win — but what does the header fallback look like? Can be resolved during build.
