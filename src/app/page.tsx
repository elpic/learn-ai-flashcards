"use client";

import LandingHero from "@/components/LandingHero";
import InputField from "@/components/InputField";
import FlashCard from "@/components/FlashCard";
import { createMockDeck } from "@/lib/mock-data";

const mockDeck = createMockDeck();
const previewCards = mockDeck.cards.slice(0, 3);

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center gap-10 px-4 py-16 sm:py-24">
      <LandingHero />
      <InputField />

      {/* Temporary: mock cards for visual testing (will be replaced by CardGrid) */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-6 mt-4">
        {previewCards.map((card) => (
          <FlashCard
            key={card.id}
            card={card}
            totalCards={mockDeck.totalCards}
          />
        ))}
      </div>
    </main>
  );
}
