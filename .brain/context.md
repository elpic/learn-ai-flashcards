# Project Context

## What We're Building
**AI Flashcard Generator** — paste a URL or block of text, get a structured exportable flashcard deck for studying.

## Why This Idea Wins the Feature Callout
- Tight natural scope boundary (text/URL in → flashcard deck out) — scope doc writes itself cleanly
- Visual demo loop — paste a Wikipedia article, watch cards generate instantly
- Anki-compatible export (JSON + CSV) is a concrete differentiator that fits easily in scope
- Deploys trivially to Vercel — live URL eliminates reviewer friction
- Simple enough to finish in 4-6 hours with zero risk of incomplete /build phase

## Explicit Scope
**In scope:**
- URL input (public, non-paywalled pages only)
- Raw text input
- Structured card generation (front/back + difficulty rating)
- JSON export (Anki-compatible format)
- CSV export
- Card preview UI before export

**Out of scope (document explicitly in scope doc):**
- User accounts / saved decks
- Spaced repetition scheduling engine
- Mobile app
- Image cards
- Paywalled or authenticated URLs
- Card editing UI

## Core User Flow
1. User pastes a URL or text into the input
2. App strips boilerplate (for URLs) using Readability.js or Cheerio
3. Claude generates structured flashcard objects (front, back, difficulty)
4. User previews generated cards in the UI
5. User exports as JSON or CSV

## Why Anki-Compatible Format Matters
Anki is the dominant spaced repetition app among students. Positioning the JSON export as Anki-importable makes the app immediately useful to a large existing user base and signals that the feature was designed with real users in mind — not just generated for the demo.
