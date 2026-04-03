export type CardType = "question" | "fact";

export interface Card {
  id: string;
  type: CardType;
  front: string;
  back: string;
  topic: string;
  cardNumber: number;
}
