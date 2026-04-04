import { Deck } from "@/domain/models/deck";

interface GenerateRequest {
  input: string;
  type: "url" | "text";
}

interface GenerateSuccessResponse {
  deck: Deck;
}

interface GenerateErrorResponse {
  error: string;
  code: "UNREACHABLE_URL" | "EXTRACTION_FAILED" | "GENERATION_FAILED";
}

export async function generateCards(request: GenerateRequest): Promise<Deck> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody: GenerateErrorResponse = await response.json();
    throw new Error(errorBody.error);
  }

  const data: GenerateSuccessResponse = await response.json();
  return data.deck;
}
