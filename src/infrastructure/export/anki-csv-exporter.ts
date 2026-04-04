import { Deck } from "@/domain/models/deck";
import { DeckExporter, ExportedFile } from "@/domain/ports/deck-exporter";

export class AnkiCsvExporter implements DeckExporter {
  export(deck: Deck): ExportedFile {
    const rows = deck.cards.map((card) => {
      const front = this.escapeField(card.front);
      const back = this.escapeField(card.back);
      const topicTag = card.topic.replace(/ /g, "_");
      const typeTag = card.type.replace(/ /g, "_");
      const tags = this.escapeField(`${topicTag} ${typeTag}`);
      return `${front}\t${back}\t${tags}`;
    });

    const data = rows.join("\n");
    const filename = `${this.sanitizeFilename(deck.title)}-anki.txt`;

    return {
      data,
      filename,
      mimeType: "text/plain;charset=utf-8",
    };
  }

  private escapeField(value: string): string {
    return value.replace(/\t/g, " ").replace(/\n/g, " ");
  }

  private sanitizeFilename(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}
