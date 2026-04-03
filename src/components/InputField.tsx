"use client";

import React, { useRef, useEffect } from "react";
import { useInputDetection } from "@/hooks/useInputDetection";

export default function InputField() {
  const { value, inputType, setValue, isMultiline } = useInputDetection();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height to fit content
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const isUrl = inputType === "url";
  const isEmpty = inputType === "empty";

  return (
    <div className="w-full max-w-2xl flex flex-col gap-3">
      {/* Input wrapper */}
      <div
        className={`
          relative w-full rounded-2xl border-2 bg-white shadow-warm
          transition-all duration-200
          ${
            isUrl
              ? "border-orange-300 shadow-orange-100"
              : "border-amber-200 focus-within:border-orange-400 focus-within:shadow-orange-100"
          }
        `}
      >
        {/* URL badge - only shown when a URL is detected */}
        {isUrl && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-orange-100 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3 h-3"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                clipRule="evenodd"
              />
            </svg>
            URL detected
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={isMultiline ? undefined : 1}
          placeholder="Paste a URL or some text you want to study..."
          aria-label="Input content to generate flashcards from"
          className={`
            w-full resize-none bg-transparent rounded-2xl
            px-5 py-4 ${isUrl ? "pr-36" : "pr-5"}
            text-stone-700 placeholder-stone-400
            text-base leading-relaxed
            outline-none
            overflow-hidden min-h-[56px]
            transition-all duration-150
          `}
        />
      </div>

      {/* Generate button */}
      <div className="flex justify-end">
        <button
          type="button"
          disabled={isEmpty}
          aria-disabled={isEmpty}
          className={`
            inline-flex items-center gap-2
            px-6 py-3 rounded-xl
            text-base font-semibold
            transition-all duration-200
            ${
              isEmpty
                ? "bg-amber-100 text-amber-400 cursor-not-allowed"
                : "bg-orange-500 text-white shadow-md shadow-orange-200 hover:bg-orange-600 hover:shadow-orange-300 active:scale-95"
            }
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
          Generate flashcards
        </button>
      </div>
    </div>
  );
}
