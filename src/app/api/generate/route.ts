import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ContentExtractor } from "@/domain/ports/content-extractor";
import { CardGenerator } from "@/domain/ports/card-generator";
import { ReadabilityExtractor } from "@/infrastructure/readability/readability-extractor";
import { PlainTextExtractor } from "@/infrastructure/readability/plain-text-extractor";
import { AnthropicCardGenerator } from "@/infrastructure/anthropic/anthropic-card-generator";
import { createRateLimiter } from "@/lib/rate-limit";

// 10 requests per minute per IP
const rateLimiter = createRateLimiter(10, 60_000);

const MAX_INPUT_LENGTH = 50_000;

const RequestBodySchema = z.object({
  input: z.string().min(1).max(MAX_INPUT_LENGTH),
  type: z.enum(["url", "text"]),
});

// Composition root - adapters are wired to ports here
const extractors: Record<"url" | "text", ContentExtractor> = {
  url: new ReadabilityExtractor(),
  text: new PlainTextExtractor(),
};
const cardGenerator: CardGenerator = new AnthropicCardGenerator();

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed } = rateLimiter.check(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "You're sending requests too fast - wait a moment and try again!", code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = RequestBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paste a URL or some text above and we'll turn it into flashcards for you!", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }
    const { input, type } = parsed.data;

    // Step 1: Extract content
    let extracted;
    try {
      extracted = await extractors[type].extract(input);
    } catch (err) {
      const isUrlType = type === "url";
      const fallback = isUrlType
        ? "We couldn't read that page - try pasting the text directly instead!"
        : "We had trouble reading that content - try pasting it again.";
      const message = err instanceof Error ? err.message : fallback;
      return NextResponse.json(
        { error: message, code: isUrlType ? "UNREACHABLE_URL" : "EXTRACTION_FAILED" },
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
        : "Our card-making engine hit a snag - give it another try!";
      return NextResponse.json(
        { error: message, code: "GENERATION_FAILED" },
        { status: 500 }
      );
    }

    return NextResponse.json({ deck });
  } catch {
    return NextResponse.json(
      { error: "Something unexpected happened - try again in a sec!", code: "GENERATION_FAILED" },
      { status: 500 }
    );
  }
}
