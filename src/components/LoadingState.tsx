"use client";

import React from "react";

function PlaceholderCard({ index }: { index: number }) {
  return (
    <div
      className="w-full max-w-sm min-h-[220px] rounded-2xl border-2 border-amber-200 bg-white shadow-warm p-5 flex flex-col justify-between overflow-hidden relative"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.08) 50%, transparent 100%)",
        }}
      />

      {/* Topic tag placeholder */}
      <div className="flex items-start justify-between gap-2">
        <div className="h-6 w-24 rounded-full bg-amber-100 animate-pulse" />
        <div className="h-7 w-7 rounded-full bg-orange-100 animate-pulse" />
      </div>

      {/* Text line placeholders */}
      <div className="mt-3 flex-1 flex flex-col gap-2.5">
        <div className="h-4 w-full rounded bg-stone-100 animate-pulse" />
        <div className="h-4 w-4/5 rounded bg-stone-100 animate-pulse" />
        <div className="h-4 w-3/5 rounded bg-stone-100 animate-pulse" />
      </div>

      {/* Bottom row placeholder */}
      <div className="flex items-center justify-between mt-4">
        <div className="h-3 w-14 rounded bg-stone-100 animate-pulse" />
        <div className="h-3 w-16 rounded bg-stone-100 animate-pulse" />
      </div>
    </div>
  );
}

interface LoadingStateProps {
  phase?: "extracting" | "generating";
}

export default function LoadingState({ phase = "generating" }: LoadingStateProps) {
  const message = phase === "extracting"
    ? "Reading that page for you..."
    : "Cooking up your study cards...";

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      <p className="text-stone-500 text-sm font-medium animate-pulse transition-opacity duration-300">
        {message}
      </p>
      {[0, 1, 2].map((i) => (
        <PlaceholderCard key={i} index={i} />
      ))}
    </div>
  );
}
