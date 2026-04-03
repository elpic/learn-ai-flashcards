# Process Notes

## /onboard
- **Technical experience:** 20+ years software development, 5+ years architecture. Highly experienced. Also conducts technical interviews.
- **Learning goals:** Improve prompting skills; use AI to ship apps at much higher velocity. Wants a repeatable workflow, not just a one-off project.
- **Creative sensibility:** Developer tooling mindset. Recently working on a CLI for env setup. Utility-first, practical aesthetics.
- **Prior SDD experience:** Yes — structured planning is core to his architecture role. New angle is doing it with AI instead of human teams.
- **Energy/engagement:** Direct, concise answers. Knows what he wants. Move fast, skip basics, focus on the AI-collaboration dimension.

## /scope
- **Idea evolution:** Pablo arrived with a well-defined concept from `.brain/` pre-work. The conversation shifted the framing from "flashcard generator" to "study recipe generator" — the metaphor of recipes for learning emerged organically and became central to the scope doc. The user focus narrowed from generic "students" to specifically high school students (15-17), which sharpened the design and content decisions.
- **Pushback received:** Challenged the quiz/answer feature he liked from Scholarly and Jungle. Pablo immediately recognized it as scope creep and cut it himself: "no that might be after building that product." Also challenged YouTube support — again, Pablo self-cut without resistance. Strong instinct for scope discipline.
- **References that resonated:** Scholarly and Jungle's visual warmth and approachability. Pablo explicitly wanted the app to feel comfortable for high school students, not developer-minimal. Anki-Decks validated the Anki-compatible export angle as a gap in the market.
- **Key insight surfaced:** The card quality constraint — "if there are too many content we will be on the same position as reading from the article itself." This became a core design principle: distillation over duplication, 10-20 deep cards over 50 shallow ones.
- **Architecture preference:** Pablo wants hexagonal architecture (ports and adapters) in the codebase. This is a personal quality bar, not a hackathon requirement. He sees domain/infra separation as enabling future extensibility (quiz mode, YouTube, model swaps).
- **Deepening rounds:** 1 round. Surfaced the visual vibe (warm, student-friendly), frontend architecture approach (domain vs infra separation via hooks/services), target user refinement (high school specifically), and the card quality failure mode. All four points materially improved the scope doc.
- **Active shaping:** Pablo drove scope cuts decisively and unprompted. The "study recipe" framing, high school focus, and architecture constraint all came from him. He accepted research examples as input but filtered them through his own vision rather than adopting suggestions passively.

## /prd
- **Scope evolution:** No major additions to scope — Pablo stayed disciplined. The conversation expanded *within* scope rather than beyond it. Key refinements: the single auto-detecting input field, the expanding textarea behavior, inline URL validation, and the two card types (question vs. fact) were all new precision that the scope doc didn't have.
- **"What if" surprises:** The short-input edge case surfaced a non-obvious design decision — Pablo chose "try to supplement, and if you can't, generate two cards anyway" rather than showing an error. This reflects his "always give the student something" instinct.
- **Scope guard moments:** When challenged on the animation budget (draggable placeholders, flip animation, scroll-reveal, expanding input, inline validation), Pablo self-sorted immediately: scroll-reveal and expanding input are essential, draggable placeholders and flip animation are polish. Clean, fast prioritization.
- **Card model insight:** Pablo's note that "not all cards are about questions — maybe they are just facts" was an important refinement. This changed the card model from pure Q&A to a dual-type system (question + fact) with icon differentiation.
- **UX instincts:** Strong product sense throughout. The "associate enjoyment with studying" framing for the loading state, the single "Export to Anki" button (no format jargon), and the auto-detecting input all came from Pablo thinking about a 16-year-old's experience, not a developer's.
- **Deepening rounds:** 0 rounds. Pablo felt the mandatory questions covered enough ground and was ready to proceed. Given his experience level and the clarity of the scope doc, the mandatory pass was thorough enough to produce a detailed PRD.
- **Active shaping:** Pablo drove every UX decision. The expanding textarea, inline validation, draggable placeholders, and fact-card concept all originated from him. No passive acceptance — he evaluated each suggestion against his "what would a 16-year-old do" filter.

## /spec
- **Technical decisions made:** Hexagonal architecture with clear domain/infrastructure boundary. Card types (question, fact) are domain concepts, not infrastructure. Hooks serve as frontend ports. Tab-separated CSV chosen over JSON for Anki export (native import, no plugins). Tool use with Zod schemas for structured output from Claude. Client-side export generation.
- **What Pablo was confident about:** Domain boundary — immediately articulated that Card is domain. Hexagonal architecture pattern. Hooks-as-ports for frontend. Wanted to move fast through decisions.
- **What was uncertain:** Initially proposed card types as infrastructure implementations. Accepted the pushback that they're domain types quickly and without resistance — suggests he was thinking aloud rather than committed to the position.
- **Stack choices:** All pre-decided from scope phase (Next.js 14, Anthropic SDK, Readability, Tailwind, Vercel). No stack changes during /spec. Research confirmed all dependencies are actively maintained and current.
- **Deepening rounds:** 0 rounds. Pablo felt the mandatory questions covered enough ground to generate the spec. Given his architecture background and the pre-work in `.brain/`, the mandatory pass produced sufficient detail.
- **Active shaping:** Pablo drove the hexagonal architecture decomposition. The hooks-as-ports pattern was proposed by the agent and immediately confirmed by Pablo. The domain boundary discussion was the one moment of real dialogue — Pablo proposed card types as infrastructure, agent pushed back, Pablo agreed quickly. All other architecture proposals were accepted without modification, suggesting they matched his mental model closely.

## /checklist
- **Sequencing decisions:** Pablo proposed project structure → UI with visual review (Storybook-style) → infrastructure. Agent suggested mock-data-on-page instead of Storybook to save setup overhead — Pablo agreed immediately. Final sequence: scaffolding + domain types → UI components against mock data → infrastructure adapters → API wiring → polish → deploy → submit. Rationale: domain types first (everything imports them), UI second (visual feedback early), infrastructure third (isolated behind ports), wiring fourth (plug adapters into hooks), polish last.
- **Methodology preferences:** Step-by-step mode, per-item verification, comprehension checks on, balanced check-in cadence, commit after each item.
- **Items and estimate:** 13 items, each ~15-30 minutes. Fits within a focused build session.
- **Confidence vs guidance:** Pablo was confident on sequencing logic — his instinct (structure → UI → infrastructure) aligned well with the dependency chain. Accepted the mock-data-over-Storybook suggestion without resistance, showing pragmatism over tooling preference.
- **Submission planning:** Wow moments identified as clean hexagonal architecture and scroll-reveal effect. GitHub repo needs to be created (personal account). Vercel deployment planned. No demo video discussed.
- **Tooling additions:** Created a `/build-step` Claude Code skill to codify the per-item workflow (review → implement → verify → comprehension check → commit → update checklist). Created `mise.toml` with dev tasks (dev, build, lint, typecheck, check, clean) per Pablo's request to use mise as task runner.
- **Git workflow:** Initialized repo with initial commit on main, created `feat/project-scaffold` branch for build work. Trunk-based development.
- **Deepening rounds:** 0 rounds. Pablo was ready to proceed after the mandatory questions. The detailed checklist items provide sufficient specification for each build step.
- **Active shaping:** Pablo drove the Storybook idea (showing strong instinct for component isolation testing) and the mise integration (bringing his own tooling preferences). Accepted the simplified mock-data approach pragmatically. Requested more detailed checklist items and a build workflow skill — both reflect his architect mindset of wanting clear, repeatable processes.

## /build

### Step 1: Project scaffolding + domain types
- What was built: Next.js 14 project initialized with App Router, TypeScript, Tailwind CSS. All dependencies installed (Anthropic SDK, Zod, Readability, jsdom). Hexagonal architecture folder structure created. Domain types implemented: Card, CardType, Deck models + ContentExtractor, CardGenerator, DeckExporter port interfaces. Mock data factory with 6 Photosynthesis cards (3 question, 3 fact).
- Verification: `tsc --noEmit` passed with zero errors. All domain types importable. Mock data returns valid Deck. Folder structure matches spec.
- Comprehension check: "Which directory contains the interfaces that infrastructure adapters must implement?" → "src/domain/ports/" ✓ Correct.
- Issues: None. create-next-app required initialization in a temp directory due to existing files, then copied over.

### Step 2: LandingHero + InputField + useInputDetection
- What was built: Landing page with warm cream/orange design. LandingHero with approachable copy for teenagers. InputField with auto-expanding textarea, URL detection badge, and disabled Generate button. useInputDetection hook with regex-based URL/text/empty classification.
- Verification: Dev server confirmed hero text visible, URL detection badge appears on URL paste, textarea expands for long text, warm vibe achieved. Fixed right padding issue - was using pr-36 always, now conditional on URL badge visibility.
- Comprehension check: "What determines whether input is classified as a URL?" -> "Regex testing for http:// or https://" - Correct.
- Issues: Textarea had excessive right padding (pr-36) for non-URL text to accommodate the URL badge. Fixed to conditional padding.

### Step 3: FlashCard component + tap-to-flip
- What was built: FlashCard component with CSS rotateY flip animation, topic tag badge, card number display ("N of total"), and type icon (? for question, sparkle for fact). Front face is white with amber border, back face is orange-tinted. 3 mock cards rendered temporarily below the input for visual testing.
- Verification: Dev server confirmed cards render, flip animation works smoothly, question/fact icons display correctly, warm styling matches existing design.
- Comprehension check: "What CSS property creates the 3D flip effect?" - "transform: rotateY(180deg)" - Correct.
- Issues: `next build` has a pre-existing prerender error (useContext null during SSG), unrelated to this step. Dev server works fine.

### Step 4: CardGrid + scroll-reveal animation
- What was built: CardGrid component with RevealWrapper using Intersection Observer API. Cards fade and slide up into view (opacity 0 + translate-y-8 to visible) with 500ms ease-out transition. Staggered reveal delay (120ms per card index) for cards visible on initial load. Replaced temporary 3-card rendering in page.tsx with CardGrid showing all 6 mock cards.
- Verification: Dev server confirmed all 6 cards render, scroll-reveal animation triggers smoothly as cards enter viewport, flip animation still works on all cards, cards are centered and properly sized.
- Comprehension check: "Which browser API does the CardGrid use to detect when a card enters the viewport?" - "Intersection Observer" - Correct.
- Issues: Initial implementation had width/alignment issues - RevealWrapper div needed `w-full` and `flex justify-center` to properly size and center the cards within the grid.

### Step 5: LoadingState + StickyHeader
- What was built: LoadingState component with 3 shimmer/pulse placeholder cards and a warm loading message. StickyHeader component with frosted glass background and "Export to Anki" button that sticks to viewport top. Shimmer keyframe animation added to globals.css. Page wired with temporary state toggle (idle/loading/cards) for visual testing.
- Verification: Learner confirmed both components look great - loading shimmer animates, sticky header stays fixed while scrolling, scroll-reveal animations unaffected.
- Comprehension check: "What CSS technique makes the header stay visible at the top?" - "position: sticky" - Correct.
- Issues: None.
