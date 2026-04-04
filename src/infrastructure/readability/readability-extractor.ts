import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import {
  ContentExtractor,
  ExtractedContent,
} from "@/domain/ports/content-extractor";
import { isUrlSafeForFetch } from "@/lib/url-safety";

export class ReadabilityExtractor implements ContentExtractor {
  async extract(url: string): Promise<ExtractedContent> {
    if (!isUrlSafeForFetch(url)) {
      throw new Error(
        "That URL isn't allowed - please use a public web address."
      );
    }

    let response: Response;
    try {
      response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; LearnAIFlashcards/1.0; +https://github.com)",
        },
        signal: AbortSignal.timeout(10000),
      });
    } catch {
      throw new Error(
        `Could not reach that URL - double-check the link and try again.`
      );
    }

    if (!response.ok) {
      throw new Error(
        `Could not reach that URL (status ${response.status}) - double-check the link and try again.`
      );
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    const articleText = article?.textContent?.trim() || "";
    if (articleText.length > 0) {
      return {
        text: articleText,
        title: article?.title || undefined,
        sourceUrl: url,
      };
    }

    // Fallback: raw body text when Readability can't parse as article
    const bodyText = dom.window.document.body?.textContent?.trim() || "";
    if (bodyText.length === 0) {
      throw new Error(
        "Could not extract any text from that page - try pasting the content directly instead."
      );
    }

    return {
      text: bodyText,
      title: dom.window.document.title || undefined,
      sourceUrl: url,
    };
  }
}
