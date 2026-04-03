import { ReadabilityExtractor } from "./readability-extractor";
import { PlainTextExtractor } from "./plain-text-extractor";

async function main() {
  console.log("=== ReadabilityExtractor Test ===\n");
  const readability = new ReadabilityExtractor();

  try {
    const result = await readability.extract(
      "https://en.wikipedia.org/wiki/Photosynthesis"
    );
    console.log("Title:", result.title);
    console.log("Source URL:", result.sourceUrl);
    console.log("Text length:", result.text.length, "chars");
    console.log("First 300 chars:", result.text.slice(0, 300));
    console.log("\n--- ReadabilityExtractor: PASS ---\n");
  } catch (err) {
    console.error("ReadabilityExtractor failed:", err);
  }

  console.log("=== PlainTextExtractor Test ===\n");
  const plainText = new PlainTextExtractor();

  const input = "Photosynthesis is the process by which plants convert light energy into chemical energy.";
  const result = await plainText.extract(input);
  console.log("Text:", result.text);
  console.log("Title:", result.title);
  console.log("Source URL:", result.sourceUrl);
  const pass = result.text === input && result.title === undefined && result.sourceUrl === undefined;
  console.log(`\n--- PlainTextExtractor: ${pass ? "PASS" : "FAIL"} ---`);
}

main().catch(console.error);
