import { AnthropicCardGenerator } from "@/infrastructure/anthropic/anthropic-card-generator";
import { ExtractedContent } from "@/domain/ports/content-extractor";

async function testSubstantialContent() {
  console.log("--- Test 1: Substantial content ---");
  const generator = new AnthropicCardGenerator();

  const content: ExtractedContent = {
    text: `Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy,
usually from the sun, into chemical energy stored in glucose. This process occurs primarily in the chloroplasts
of plant cells, specifically within structures called thylakoids. The overall equation for photosynthesis is:
6CO2 + 6H2O + light energy -> C6H12O6 + 6O2.

Photosynthesis consists of two main stages: the light-dependent reactions and the Calvin cycle
(light-independent reactions). During the light-dependent reactions, which take place in the thylakoid membranes,
water molecules are split, releasing oxygen as a byproduct. This process also produces ATP and NADPH,
which are energy carriers used in the next stage.

The Calvin cycle occurs in the stroma of the chloroplast. Here, carbon dioxide from the atmosphere is fixed
into organic molecules through a series of enzyme-catalyzed reactions. The enzyme RuBisCO plays a crucial role
in this carbon fixation step. The Calvin cycle uses the ATP and NADPH produced during the light reactions
to convert CO2 into glyceraldehyde-3-phosphate (G3P), which can then be used to build glucose and other
organic compounds.

Factors that affect the rate of photosynthesis include light intensity, carbon dioxide concentration,
temperature, and water availability. Understanding photosynthesis is essential because it forms the base
of nearly all food chains on Earth and is responsible for producing the oxygen we breathe.`,
    title: "Photosynthesis",
  };

  const deck = await generator.generate(content);

  console.log(`Title: ${deck.title}`);
  console.log(`Total cards: ${deck.totalCards}`);
  console.log(`Source type: ${deck.source.type}`);
  console.log(`Generated at: ${deck.generatedAt}`);
  console.log("\nCards:");
  for (const card of deck.cards) {
    console.log(
      `  [${card.type}] #${card.cardNumber} (${card.topic})`
    );
    console.log(`    Front: ${card.front}`);
    console.log(`    Back: ${card.back}`);
  }

  // Validation
  const errors: string[] = [];
  if (deck.cards.length < 5) errors.push(`Expected 5+ cards, got ${deck.cards.length}`);
  if (!deck.title) errors.push("Missing deck title");
  if (!deck.id) errors.push("Missing deck id");

  for (const card of deck.cards) {
    if (!card.id) errors.push(`Card #${card.cardNumber} missing id`);
    if (!["question", "fact"].includes(card.type))
      errors.push(`Card #${card.cardNumber} invalid type: ${card.type}`);
    if (!card.front) errors.push(`Card #${card.cardNumber} missing front`);
    if (!card.back) errors.push(`Card #${card.cardNumber} missing back`);
    if (!card.topic) errors.push(`Card #${card.cardNumber} missing topic`);
  }

  if (errors.length > 0) {
    console.log("\nValidation FAILED:");
    errors.forEach((e) => console.log(`  - ${e}`));
  } else {
    console.log("\nValidation PASSED");
  }
}

async function testShortInput() {
  console.log("\n--- Test 2: Short input (one sentence) ---");
  const generator = new AnthropicCardGenerator();

  const content: ExtractedContent = {
    text: "Mitochondria are often called the powerhouse of the cell.",
  };

  const deck = await generator.generate(content);

  console.log(`Title: ${deck.title}`);
  console.log(`Total cards: ${deck.totalCards}`);
  console.log("\nCards:");
  for (const card of deck.cards) {
    console.log(
      `  [${card.type}] #${card.cardNumber} (${card.topic})`
    );
    console.log(`    Front: ${card.front}`);
    console.log(`    Back: ${card.back}`);
  }

  if (deck.cards.length < 2) {
    console.log("\nValidation FAILED: Expected at least 2 cards");
  } else {
    console.log("\nValidation PASSED");
  }
}

async function main() {
  try {
    await testSubstantialContent();
    await testShortInput();
    console.log("\n=== All tests completed ===");
  } catch (error) {
    console.error("Test failed with error:", error);
    process.exit(1);
  }
}

main();
