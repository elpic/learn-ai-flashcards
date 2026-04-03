import { Deck } from "@/domain/models/deck";

export function createMockDeck(): Deck {
  return {
    id: "mock-deck-001",
    title: "Photosynthesis",
    source: {
      type: "text",
      value: "Sample text about photosynthesis for high school students.",
    },
    generatedAt: "2026-04-03T00:00:00.000Z",
    totalCards: 6,
    cards: [
      {
        id: "mock-card-001",
        type: "question",
        front: "What is photosynthesis?",
        back: "Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy—usually from the sun—into chemical energy stored as glucose.",
        topic: "Definition",
        cardNumber: 1,
      },
      {
        id: "mock-card-002",
        type: "question",
        front: "What is the overall chemical equation for photosynthesis?",
        back: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Carbon dioxide and water are converted into glucose and oxygen using light energy.",
        topic: "Chemistry",
        cardNumber: 2,
      },
      {
        id: "mock-card-003",
        type: "fact",
        front: "Chlorophyll is the primary pigment used in photosynthesis.",
        back: "Chlorophyll absorbs light most efficiently in the red and blue wavelengths, and reflects green light—which is why plants appear green.",
        topic: "Pigments",
        cardNumber: 3,
      },
      {
        id: "mock-card-004",
        type: "question",
        front: "Where does photosynthesis take place inside a plant cell?",
        back: "Photosynthesis takes place in the chloroplasts, organelles found mainly in leaf cells. Inside the chloroplast, the thylakoid membranes host the light-dependent reactions and the stroma hosts the Calvin cycle.",
        topic: "Cell Structure",
        cardNumber: 4,
      },
      {
        id: "mock-card-005",
        type: "fact",
        front: "Photosynthesis has two main stages: the light-dependent reactions and the Calvin cycle.",
        back: "The light-dependent reactions capture energy from sunlight to produce ATP and NADPH. The Calvin cycle (light-independent reactions) uses that energy to fix CO₂ into glucose in the stroma.",
        topic: "Stages",
        cardNumber: 5,
      },
      {
        id: "mock-card-006",
        type: "question",
        front: "What three factors most commonly limit the rate of photosynthesis?",
        back: "The three main limiting factors are: (1) light intensity, (2) carbon dioxide concentration, and (3) temperature. Increasing any one of these—up to an optimum level—will increase the rate of photosynthesis.",
        topic: "Limiting Factors",
        cardNumber: 6,
      },
    ],
  };
}
