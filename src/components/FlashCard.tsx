"use client";

import React, { useState } from "react";
import { Card } from "@/domain/models/card";

interface FlashCardProps {
  card: Card;
  totalCards: number;
}

export default function FlashCard({ card, totalCards }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const isQuestion = card.type === "question";

  return (
    <div
      className="w-full max-w-sm perspective-[800px] cursor-pointer"
      onClick={() => setIsFlipped((prev) => !prev)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        }
      }}
      aria-label={`Flashcard ${card.cardNumber} of ${totalCards}. ${isFlipped ? "Showing back" : "Showing front"}. Click to flip.`}
    >
      <div
        className={`
          relative w-full min-h-[220px] transition-transform duration-500
          [transform-style:preserve-3d]
          ${isFlipped ? "[transform:rotateY(180deg)]" : ""}
        `}
      >
        {/* Front face */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl border-2 border-amber-200 bg-white shadow-warm p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {card.topic}
            </span>
            <span
              className={`
                inline-flex items-center justify-center w-7 h-7 rounded-full text-sm
                ${isQuestion ? "bg-orange-100 text-orange-600" : "bg-amber-100 text-amber-600"}
              `}
              title={isQuestion ? "Question card" : "Fact card"}
            >
              {isQuestion ? "?" : "\u2728"}
            </span>
          </div>

          <p className="text-stone-800 text-base leading-relaxed font-medium mt-3 flex-1">
            {card.front}
          </p>

          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-stone-400">
              {card.cardNumber} of {totalCards}
            </span>
            <span className="text-xs text-stone-400">Tap to flip</span>
          </div>
        </div>

        {/* Back face */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border-2 border-orange-200 bg-orange-50 shadow-warm p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              {card.topic}
            </span>
            <span
              className={`
                inline-flex items-center justify-center w-7 h-7 rounded-full text-sm
                ${isQuestion ? "bg-orange-200 text-orange-700" : "bg-amber-200 text-amber-700"}
              `}
            >
              {isQuestion ? "?" : "\u2728"}
            </span>
          </div>

          <p className="text-stone-700 text-sm leading-relaxed mt-3 flex-1">
            {card.back}
          </p>

          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-stone-400">
              {card.cardNumber} of {totalCards}
            </span>
            <span className="text-xs text-stone-400">Tap to flip back</span>
          </div>
        </div>
      </div>
    </div>
  );
}
