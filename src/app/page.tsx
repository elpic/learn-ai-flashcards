"use client";

import LandingHero from "@/components/LandingHero";
import InputField from "@/components/InputField";
import CardGrid from "@/components/CardGrid";
import LoadingState from "@/components/LoadingState";
import StickyHeader from "@/components/StickyHeader";
import { useInputDetection } from "@/hooks/useInputDetection";
import { useCardGeneration } from "@/hooks/useCardGeneration";
import { useDeckExport } from "@/hooks/useDeckExport";

export default function Home() {
  const { value, inputType, setValue, isMultiline, isValidating, validationResult } = useInputDetection();
  const { status, deck, error, generate, reset } = useCardGeneration();
  const { exportDeck } = useDeckExport();

  const isGenerating = status === "extracting" || status === "generating";

  const handleGenerate = () => {
    if (inputType === "empty" || isGenerating) return;
    generate(value, inputType as "url" | "text");
  };

  const handleNewGeneration = () => {
    reset();
    setValue("");
  };

  return (
    <>
      {status === "done" && deck && (
        <StickyHeader onExport={() => exportDeck(deck)} />
      )}

      <main className="min-h-screen flex flex-col items-center gap-10 px-4 py-16 sm:py-24">
        <LandingHero />

        <InputField
          value={value}
          inputType={inputType}
          isMultiline={isMultiline}
          isGenerating={isGenerating}
          isValidating={isValidating}
          validationResult={validationResult}
          error={error}
          onValueChange={setValue}
          onGenerate={handleGenerate}
        />

        {isGenerating && <LoadingState />}

        {status === "done" && deck && (
          <>
            <CardGrid cards={deck.cards} totalCards={deck.totalCards} />

            <button
              onClick={handleNewGeneration}
              className="text-sm text-stone-500 hover:text-orange-500 transition-colors underline underline-offset-2"
            >
              Generate new cards
            </button>
          </>
        )}
      </main>
    </>
  );
}
