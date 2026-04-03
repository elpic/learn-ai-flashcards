import React from "react";

export default function LandingHero() {
  return (
    <div className="flex flex-col items-center text-center gap-4 px-4">
      <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-sm font-medium px-4 py-1.5 rounded-full border border-amber-200">
        <span>✦</span>
        <span>Free · No sign-up · Works instantly</span>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-stone-800 leading-tight tracking-tight text-balance max-w-2xl">
        Turn any article into{" "}
        <span className="text-orange-500">study cards</span>
      </h1>

      <p className="text-lg sm:text-xl text-stone-500 max-w-lg leading-relaxed text-balance">
        Paste a link or some text and we&apos;ll build you a ready-to-review
        flashcard deck - no copy-pasting, no formatting, no stress.
      </p>
    </div>
  );
}
