import { Card } from "./card";

export interface Deck {
  id: string;
  title: string;
  cards: Card[];
  source: {
    type: "url" | "text";
    value: string;
  };
  totalCards: number;
  generatedAt: string;
}
