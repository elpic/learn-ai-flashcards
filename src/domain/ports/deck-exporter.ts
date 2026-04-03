import { Deck } from "../models/deck";

export interface ExportedFile {
  data: string;
  filename: string;
  mimeType: string;
}

export interface DeckExporter {
  export(deck: Deck): ExportedFile;
}
