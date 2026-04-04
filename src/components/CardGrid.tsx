"use client";

import React, { useEffect, useRef, useState } from "react";
import FlashCard from "@/components/FlashCard";
import { Card } from "@/domain/models/card";

interface CardGridProps {
  cards: Card[];
  totalCards: number;
}

function RevealWrapper({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the reveal based on index for cards visible on initial load
          const delay = index * 150;
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className={`
        w-full flex justify-center transition-all duration-500 ease-out
        ${isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
        }
      `}
    >
      {children}
    </div>
  );
}

export default function CardGrid({ cards, totalCards }: CardGridProps) {
  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      {cards.map((card, index) => (
        <RevealWrapper key={card.id} index={index}>
          <FlashCard card={card} totalCards={totalCards} />
        </RevealWrapper>
      ))}
    </div>
  );
}
