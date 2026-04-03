"use client";

import { useState } from "react";
import LandingHero from "@/components/LandingHero";
import InputField from "@/components/InputField";
import CardGrid from "@/components/CardGrid";
import LoadingState from "@/components/LoadingState";
import StickyHeader from "@/components/StickyHeader";
import { createMockDeck } from "@/lib/mock-data";
import { useDeckExport } from "@/hooks/useDeckExport";

const mockDeck = createMockDeck();

type ViewState = "idle" | "loading" | "cards";

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>("idle");
  const { exportDeck } = useDeckExport();

  return (
    <>
      {viewState === "cards" && (
        <StickyHeader onExport={() => exportDeck(mockDeck)} />
      )}

      <main className="min-h-screen flex flex-col items-center gap-10 px-4 py-16 sm:py-24">
        <LandingHero />
        <InputField />

        {/* Temporary state toggle for visual testing */}
        <div className="flex gap-2">
          {(["idle", "loading", "cards"] as ViewState[]).map((state) => (
            <button
              key={state}
              onClick={() => setViewState(state)}
              className={`
                text-xs px-3 py-1.5 rounded-full border transition-colors
                ${viewState === state
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-stone-500 border-stone-200 hover:border-orange-300"
                }
              `}
            >
              {state}
            </button>
          ))}
        </div>

        {viewState === "loading" && <LoadingState />}
        {viewState === "cards" && (
          <CardGrid cards={mockDeck.cards} totalCards={mockDeck.totalCards} />
        )}
      </main>
    </>
  );
}
