"use client";

import { useCallback } from "react";
import { Deck } from "@/domain/models/deck";
import { AnkiCsvExporter } from "@/infrastructure/export/anki-csv-exporter";

const exporter = new AnkiCsvExporter();

export function useDeckExport() {
  const exportDeck = useCallback((deck: Deck) => {
    const file = exporter.export(deck);

    const blob = new Blob([file.data], { type: file.mimeType });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.filename;
    anchor.click();

    URL.revokeObjectURL(url);
  }, []);

  return { exportDeck };
}
