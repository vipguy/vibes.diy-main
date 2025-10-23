import { useEffect, useRef } from "react";
import type { UserChatMessageDocument } from "@vibes.diy/prompts";
import { RuntimeError } from "@vibes.diy/use-vibes-types";

interface Params {
  immediateErrors: RuntimeError[];
  isStreaming: boolean;
  userInput: string;
  mergeUserMessage: (doc: Partial<UserChatMessageDocument>) => void;
  setDidSendErrors: (value: boolean) => void;
  setIsStreaming: (value: boolean) => void;
}

export function useImmediateErrorAutoSend({
  immediateErrors,
  isStreaming,
  userInput,
  mergeUserMessage,
  setDidSendErrors,
  setIsStreaming,
}: Params) {
  const debouncedSendRef = useRef<NodeJS.Timeout | null>(null);
  const sentErrorsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (immediateErrors.length === 0) {
      return;
    }

    const fingerprint = immediateErrors
      .map((e) => `${e.errorType}:${e.message}`)
      .sort()
      .join("|");

    if (sentErrorsRef.current.has(fingerprint)) {
      return;
    }

    const hasSyntax = immediateErrors.some(
      (e) => e.errorType === "SyntaxError",
    );
    if (isStreaming && hasSyntax) {
      setIsStreaming(false);
    }

    if (!debouncedSendRef.current) {
      debouncedSendRef.current = setTimeout(() => {
        sentErrorsRef.current.add(fingerprint);
        
        // Create a more aggressive error recovery message
        const errorTypes = immediateErrors.map(e => e.errorType).join(', ');
        const errorMessages = immediateErrors.map(e => e.message).slice(0, 3).join('\n');
        
        mergeUserMessage({
          text: `CRITICAL: Fix these ${errorTypes} errors immediately and rebuild the app:\n\n${errorMessages}\n\nIMPORTANT: Analyze the errors, fix the root cause, and provide the complete corrected code. Simplify if needed to ensure it works.`,
        });
        setDidSendErrors(true);
        debouncedSendRef.current = null;
      }, 500);
    }

    return () => {
      if (debouncedSendRef.current) {
        clearTimeout(debouncedSendRef.current);
        debouncedSendRef.current = null;
      }
    };
  }, [
    immediateErrors,
    isStreaming,
    userInput,
    mergeUserMessage,
    setDidSendErrors,
    setIsStreaming,
  ]);
}
