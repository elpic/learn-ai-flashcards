"use client";

import { useState, useCallback, useEffect, useRef } from "react";

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
const DEBOUNCE_MS = 400;

function detectInputType(val: string): InputType {
  if (val.trim() === "") return "empty";
  if (URL_REGEX.test(val.trim())) return "url";
  return "text";
}

export function useInputDetection(): UseInputDetectionReturn {
  const [value, setValueState] = useState("");
  const [inputType, setInputType] = useState<InputType>("empty");
  const [isMultiline, setIsMultiline] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const validateUrl = useCallback(async (url: string) => {
    // Cancel any in-flight request
    if (abortController.current) {
      abortController.current.abort();
    }

    const controller = new AbortController();
    abortController.current = controller;

    setIsValidating(true);
    setValidationResult(null);

    try {
      const response = await fetch(
        `/api/validate-url?url=${encodeURIComponent(url)}`,
        { signal: controller.signal }
      );
      const data = await response.json();

      if (!controller.signal.aborted) {
        setValidationResult({
          reachable: data.reachable,
          error: data.reachable
            ? null
            : "This URL doesn't seem reachable - double-check the link and try again",
        });
        setIsValidating(false);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (!controller.signal.aborted) {
        setValidationResult({
          reachable: false,
          error: "Couldn't check this URL - try again in a moment",
        });
        setIsValidating(false);
      }
    }
  }, []);

  const setValue = useCallback(
    (val: string) => {
      setValueState(val);
      const detected = detectInputType(val);
      setInputType(detected);
      setIsMultiline(val.includes("\n") || val.length > 120);

      // Clear previous debounce
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }

      // Cancel in-flight validation if input type changed
      if (detected !== "url") {
        if (abortController.current) {
          abortController.current.abort();
          abortController.current = null;
        }
        setIsValidating(false);
        setValidationResult(null);
        return;
      }

      // Debounce URL validation
      debounceTimer.current = setTimeout(() => {
        validateUrl(val.trim());
      }, DEBOUNCE_MS);
    },
    [validateUrl]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (abortController.current) abortController.current.abort();
    };
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
