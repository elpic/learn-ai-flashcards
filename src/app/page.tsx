"use client";

import LandingHero from "@/components/LandingHero";
import InputField from "@/components/InputField";
import CardGrid from "@/components/CardGrid";
import { createMockDeck } from "@/lib/mock-data";

const mockDeck = createMockDeck();

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center gap-10 px-4 py-16 sm:py-24">
      <LandingHero />
      <InputField />
      <CardGrid cards={mockDeck.cards} totalCards={mockDeck.totalCards} />
    </main>
  );
}
