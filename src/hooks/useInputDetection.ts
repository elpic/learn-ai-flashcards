"use client";

import { useState, useCallback } from "react";

export type InputType = "url" | "text" | "empty";

export interface ValidationResult {
  reachable: boolean | null;
  error: string | null;
}

export interface UseInputDetectionReturn {
  value: string;
  inputType: InputType;
  setValue: (val: string) => void;
  isMultiline: boolean;
  isValidating: boolean;
  validationResult: ValidationResult | null;
}

const URL_REGEX = /^https?:\/\/.+/i;

function detectInputType(val: string): InputType {
  if (val.trim() === "") return "empty";
  if (URL_REGEX.test(val.trim())) return "url";
  return "text";
}

export function useInputDetection(): UseInputDetectionReturn {
  const [value, setValueState] = useState("");
  const [inputType, setInputType] = useState<InputType>("empty");
  const [isMultiline, setIsMultiline] = useState(false);

  // Stubs - validation endpoint is wired in Step 10
  const isValidating = false;
  const validationResult: ValidationResult | null = null;

  const setValue = useCallback((val: string) => {
    setValueState(val);
    setInputType(detectInputType(val));
    setIsMultiline(val.includes("\n") || val.length > 120);
  }, []);

  return {
    value,
    inputType,
    setValue,
    isMultiline,
    isValidating,
    validationResult,
  };
}
