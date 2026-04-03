import {
  ContentExtractor,
  ExtractedContent,
} from "@/domain/ports/content-extractor";

export class PlainTextExtractor implements ContentExtractor {
  async extract(input: string): Promise<ExtractedContent> {
    return {
      text: input,
    };
  }
}
