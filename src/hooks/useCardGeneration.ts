"use client";

import { useState, useCallback } from "react";
import { Deck } from "@/domain/models/deck";
import { generateCards } from "@/services/api-client";

export type GenerationStatus = "idle" | "generating" | "done" | "error";

export interface UseCardGenerationReturn {
  status: GenerationStatus;
  deck: Deck | null;
  error: string | null;
  generate: (input: string, type: "url" | "text") => Promise<void>;
  reset: () => void;
}

export function useCardGeneration(): UseCardGenerationReturn {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [deck, setDeck] = useState<Deck | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (input: string, type: "url" | "text") => {
    setStatus("generating");
    setDeck(null);
    setError(null);

    try {

      const result = await generateCards({ input, type });
      setDeck(result);
      setStatus("done");
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "Something went wrong - give it another try!";
      setError(message);
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setDeck(null);
    setError(null);
  }, []);

  return { status, deck, error, generate, reset };
}
