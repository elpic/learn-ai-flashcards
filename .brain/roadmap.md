# Project Roadmap

## Aim
Complete the spec-driven development curriculum in one focused session, producing high-quality documentation artifacts that could earn a platform feature callout, while building a genuinely useful AI flashcard generator that deploys live to Vercel.

## Deadline: April 29, 2026 @ 5:00pm EDT
## Recommended Submit By: April 14, 2026

---

## Pre-Session Setup (Apr 3–5)
- [ ] Verify Claude Pro/Max subscription is active
- [ ] Install devpost-curriculum plugin from Claude Code marketplace
- [ ] Run /onboard to watch orientation and understand pacing
- [ ] Read plugin docs to understand what each command expects as input
- [ ] Optional dry run with a throwaway idea to understand flow

## Main Build Session — One 4-6 Hour Block (Apr 7–9, pick one day)
- [ ] /scope — define in/out boundaries clearly; explicitly list what is OUT of scope
- [ ] /prd — write user stories with acceptance criteria (not just a feature list)
- [ ] /spec — document real architecture decisions: why Next.js, why Anthropic SDK, why Readability.js
- [ ] /checklist — granular verifiable steps; each step should be a single action
- [ ] /build — implement the flashcard generator (URL + text input, Claude generation, JSON/CSV export, preview UI)
- [ ] /iterate — at least one polish pass (focus on export format or card preview UX)
- [ ] /reflect — write after the build, not during; be specific about what surprised you

## Post-Session Polish (next day after build)
- [ ] Review all docs/ artifacts for clarity and professional tone
- [ ] Push to public GitHub repo
- [ ] Write README with one-command setup and env var instructions
- [ ] Create .env.example with all required keys documented

## Deploy (within 2 days of build session)
- [ ] Deploy to Vercel free tier
- [ ] Test with production env vars (not just local)
- [ ] Verify live URL works end-to-end before submitting

## Submission Prep (Apr 12–14)
- [ ] Write project description for Devpost (fresh, not copied from docs)
- [ ] Write lessons learned (genuine reflection — what surprised you, what broke down)
- [ ] Zip the docs/ folder
- [ ] Final check: README works from scratch, live URL accessible, repo is public
- [ ] Submit before Apr 14 (2 weeks early buffer)

---

## Risk Register
| Risk | Mitigation |
|---|---|
| /build phase overruns time | Hard scope: max 3 features, stop at /iterate for one pass only |
| URL parsing fails for paywalled sites | Explicitly out of scope in scope doc; raw text input is the fallback |
| Anthropic API rate limits during build | Use claude-haiku during development, switch to sonnet for final demo only |
| Vercel env var issues | Test deployment before submission day, not on submission day |
| /reflect output reads as generic | Write it the day AFTER the build session, with real hindsight |
| Plugin pipeline fragmented across days | Do the entire /scope → /reflect in one session — this is non-negotiable |
