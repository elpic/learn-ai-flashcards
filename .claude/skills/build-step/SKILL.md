---
name: build-step
description: Execute the next unchecked build step from docs/checklist.md. Use when the user wants to build the next checklist item.
---

# /build-step — Execute Next Checklist Item

You are a build partner executing one checklist item at a time. Follow this workflow exactly.

## Step 1: Identify the Current Item

1. Read `docs/checklist.md`
2. Find the first unchecked item (`- [ ]`)
3. If all items are checked, tell the user: "All checklist items are complete! Run `/iterate` if you want to polish, or `/reflect` to wrap up."
4. Display the item title and number to the user: "Starting item N: [title]"

## Step 2: Review Requirements

1. Read the **Spec ref** from the checklist item — open the referenced section in `spec.md`
2. Read the **Acceptance** criteria from the checklist item — cross-reference with `prd.md`
3. Read `docs/learner-profile.md` for experience level context
4. Summarize to the user what you're about to build — keep it brief (2-3 sentences). Mention key files that will be created or modified.

## Step 3: Implement

1. Write the code for this checklist item
2. Follow the architecture from `spec.md` (hexagonal, ports and adapters)
3. Follow the file structure defined in `spec.md > File Structure`
4. Keep changes scoped to this single checklist item — don't bleed into future items
5. If you encounter a decision not covered by the spec, ask the user before guessing

## Step 4: Verify

1. Run `mise run dev` (or `npm run dev` if mise isn't available) and guide the user on what to check
2. Walk through the **Verify** field from the checklist item — tell the user exactly what to look for
3. Ask: "Does everything look right?"
4. If the user reports an issue, fix it before moving on

## Step 5: Comprehension Check

After verification passes, ask one quick question about what was just built. Keep it conversational — something like:
- "Why did we put [X] in the domain layer instead of infrastructure?"
- "What would break if we skipped [Y]?"
- "How does [component] get its data right now vs. how it will work when we wire up the API?"

Wait for the user's answer, respond briefly, then move on.

## Step 6: Commit

1. Stage only the files changed in this step
2. Commit with message: `Complete step N: [checklist item title]`
3. Include `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`

## Step 7: Update Checklist

1. Mark the item as checked in `docs/checklist.md`: change `- [ ]` to `- [x]`
2. Tell the user: "Step N complete. Run `/clear`, then `/build-step` for the next item."

## Rules

- **One item per invocation.** Never build more than one checklist item.
- **Don't skip verification.** The user chose per-item verification.
- **Don't skip comprehension checks.** The user opted in.
- **Scope discipline.** Only build what the current item describes. If you notice something that needs fixing from a previous item, flag it but don't fix it unless it blocks the current item.
- **Balanced check-ins.** Brief explanations of what you're doing, but don't over-explain. The user is a senior architect.
