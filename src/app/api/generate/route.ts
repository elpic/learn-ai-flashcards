import { NextRequest, NextResponse } from "next/server";
import { ReadabilityExtractor } from "@/infrastructure/readability/readability-extractor";
import { PlainTextExtractor } from "@/infrastructure/readability/plain-text-extractor";
import { AnthropicCardGenerator } from "@/infrastructure/anthropic/anthropic-card-generator";

const readabilityExtractor = new ReadabilityExtractor();
const plainTextExtractor = new PlainTextExtractor();
const cardGenerator = new AnthropicCardGenerator();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, type } = body as { input: string; type: "url" | "text" };

    if (!input || !type) {
      return NextResponse.json(
        { error: "Please provide some content to generate flashcards from.", code: "EXTRACTION_FAILED" },
        { status: 400 }
      );
    }

    // Step 1: Extract content
    let extracted;
    try {
      const extractor = type === "url" ? readabilityExtractor : plainTextExtractor;
      extracted = await extractor.extract(input);
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "Something went wrong while reading that content - try again or paste the text directly.";
      return NextResponse.json(
        { error: message, code: type === "url" ? "UNREACHABLE_URL" : "EXTRACTION_FAILED" },
        { status: 422 }
      );
    }

    // Step 2: Generate cards
    let deck;
    try {
      deck = await cardGenerator.generate(extracted);
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "Something went wrong while generating your flashcards - please try again.";
      return NextResponse.json(
        { error: message, code: "GENERATION_FAILED" },
        { status: 500 }
      );
    }

    return NextResponse.json({ deck });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong - please try again.", code: "GENERATION_FAILED" },
      { status: 500 }
    );
  }
}
