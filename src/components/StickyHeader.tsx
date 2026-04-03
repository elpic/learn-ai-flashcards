"use client";

import React from "react";

interface StickyHeaderProps {
  onExport: () => void;
}

export default function StickyHeader({ onExport }: StickyHeaderProps) {
  return (
    <div className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-amber-200 shadow-sm">
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
        <span className="text-sm font-semibold text-stone-700">
          Your flashcards are ready
        </span>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
            <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
          </svg>
          Export to Anki
        </button>
      </div>
    </div>
  );
}
