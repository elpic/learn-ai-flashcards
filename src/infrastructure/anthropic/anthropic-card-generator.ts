import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { CardGenerator } from "@/domain/ports/card-generator";
import { ExtractedContent } from "@/domain/ports/content-extractor";
import { Deck } from "@/domain/models/deck";
import { CardType } from "@/domain/models/card";

const cardSchema = z.object({
  type: z.enum(["question", "fact"]),
  front: z.string(),
  back: z.string(),
  topic: z.string(),
});

const deckSchema = z.object({
  title: z.string(),
  cards: z.array(cardSchema),
});

type GeneratedDeck = z.infer<typeof deckSchema>;

const SYSTEM_PROMPT = `You are a study material expert creating flashcards for high school students (ages 15-17).

Your job is to distill the provided content into a focused set of flashcards that help students truly understand the material - not just memorize surface-level facts.

Rules:
- Use clear, simple language appropriate for a 15-17 year old. Avoid unnecessary jargon.
- For substantial content, generate 10-20 cards. For short input, generate at least 2 cards.
- If the input is very short (a sentence or two), infer additional context and expand where possible to create meaningful cards. Never refuse to generate cards - always produce something.
- Create a mix of question cards and fact cards based on the content:
  - Question cards: front is a question, back is the answer
  - Fact cards: front is a key concept or fact, back is a deeper explanation or context
- The ratio of question to fact cards should be determined by the content, not a fixed split.
- Prioritize understanding and depth over surface-level recall. Distill, don't duplicate.
- Each card should have a short topic label derived from the content (e.g., "Photosynthesis", "World War II").
- Generate a descriptive title for the deck based on the content.`;

export class AnthropicCardGenerator implements CardGenerator {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic();
  }

  async generate(content: ExtractedContent): Promise<Deck> {
    const userMessage = content.title
      ? `Title: ${content.title}\n\nContent:\n${content.text}`
      : content.text;

    const inputSchema = z.toJSONSchema(deckSchema);

    const response = await this.client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: [
        {
          name: "generate_flashcards",
          description:
            "Generate a structured flashcard deck from the provided content",
          input_schema: inputSchema as Anthropic.Tool.InputSchema,
        },
      ],
      tool_choice: { type: "tool", name: "generate_flashcards" },
      messages: [
        {
          role: "user",
          content: `Create flashcards from the following material:\n\n${userMessage}`,
        },
      ],
    });

    const toolUseBlock = response.content.find(
      (block) => block.type === "tool_use"
    );

    if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
      throw new Error("Claude did not return a tool use response");
    }

    const parsed = deckSchema.parse(toolUseBlock.input);

    return this.toDeck(parsed, content);
  }

  private toDeck(generated: GeneratedDeck, content: ExtractedContent): Deck {
    const now = new Date().toISOString();
    const deckId = crypto.randomUUID();

    return {
      id: deckId,
      title: generated.title,
      cards: generated.cards.map((card, index) => ({
        id: crypto.randomUUID(),
        type: card.type as CardType,
        front: card.front,
        back: card.back,
        topic: card.topic,
        cardNumber: index + 1,
      })),
      source: {
        type: content.sourceUrl ? "url" : "text",
        value: content.sourceUrl || content.text.slice(0, 200),
      },
      totalCards: generated.cards.length,
      generatedAt: now,
    };
  }
}
