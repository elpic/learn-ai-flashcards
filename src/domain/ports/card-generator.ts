import { ExtractedContent } from "./content-extractor";
import { Deck } from "../models/deck";

export interface CardGenerator {
  generate(content: ExtractedContent): Promise<Deck>;
}
