import { NextRequest, NextResponse } from "next/server";
import { ContentExtractor } from "@/domain/ports/content-extractor";
import { CardGenerator } from "@/domain/ports/card-generator";
import { ReadabilityExtractor } from "@/infrastructure/readability/readability-extractor";
import { PlainTextExtractor } from "@/infrastructure/readability/plain-text-extractor";
import { AnthropicCardGenerator } from "@/infrastructure/anthropic/anthropic-card-generator";

// Composition root - adapters are wired to ports here
const extractors: Record<"url" | "text", ContentExtractor> = {
  url: new ReadabilityExtractor(),
  text: new PlainTextExtractor(),
};
const cardGenerator: CardGenerator = new AnthropicCardGenerator();

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
      extracted = await extractors[type].extract(input);
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
