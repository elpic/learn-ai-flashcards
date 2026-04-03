export interface ExtractedContent {
  text: string;
  title?: string;
  sourceUrl?: string;
}

export interface ContentExtractor {
  extract(input: string): Promise<ExtractedContent>;
}
