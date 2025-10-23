import { useState, useCallback, useEffect } from "react";
import { trackErrorEvent } from "../utils/analytics.js";
import { RuntimeError } from "@vibes.diy/use-vibes-types";

export type ErrorCategory = "immediate" | "advisory";

export function useRuntimeErrors({
  onSaveError,
  didSendErrors = false,
}: {
  onSaveError?: (error: RuntimeError, category: ErrorCategory) => Promise<void>;
  didSendErrors?: boolean;
} = {}) {
  const [immediateErrors, setImmediateErrors] = useState<RuntimeError[]>([]);
  const [advisoryErrors, setAdvisoryErrors] = useState<RuntimeError[]>([]);

  // Helper to categorize errors based on their characteristics
  const categorizeError = useCallback((error: RuntimeError): ErrorCategory => {
    // Extract error type from message if not already classified
    if (!error.errorType) {
      const msg = error.message || '';
      const stack = error.stack || '';
      const reason = error.reason || '';
      
      // Handle Babel syntax errors which often come as 'Script error.' with limited info
      if (
        (msg === "Script error." || msg.includes("Script error")) &&
        (stack.includes("Babel") || stack.includes("parse-error"))
      ) {
        error.errorType = "SyntaxError";
        // Enhance the message with more details from the stack if possible
        if (stack && msg === "Script error.") {
          // Extract more meaningful information from the stack trace
          const babelErrorMatch = stack.match(/Babel\s+script:\s+([^\n]+)/i);
          const parseErrorMatch = stack.match(/parse-error\.ts:[\d]+:[\d]+\)([^\n]+)/i);
          const unexpectedMatch = stack.match(/Unexpected token[^\n]*/i);
          
          if (babelErrorMatch?.[1]) {
            error.message = `Babel Syntax Error: ${babelErrorMatch[1].trim()}`;
          } else if (parseErrorMatch?.[1]) {
            error.message = `Syntax Error: ${parseErrorMatch[1].trim()}`;
          } else if (unexpectedMatch?.[0]) {
            error.message = `Syntax Error: ${unexpectedMatch[0]}`;
          } else {
            error.message = "Babel Syntax Error: Invalid JavaScript syntax";
          }
        }
      } else if (msg.includes("SyntaxError") || msg.includes("Unexpected token")) {
        error.errorType = "SyntaxError";
      } else if (msg.includes("ReferenceError") || msg.includes("is not defined")) {
        error.errorType = "ReferenceError";
      } else if (msg.includes("TypeError") || msg.includes("is not a function") || msg.includes("Cannot read")) {
        error.errorType = "TypeError";
      } else if (msg.includes("NetworkError") || msg.includes("Failed to fetch")) {
        error.errorType = "NetworkError";
      } else if (
        msg.includes("Not found:") ||
        reason.includes("Not found:") ||
        msg.includes("database") ||
        msg.includes("CRDT")
      ) {
        error.errorType = "DatabaseError";
      } else if (msg.includes("Hydration") || msg.includes("hydration")) {
        error.errorType = "HydrationError";
      } else if (msg.includes("Maximum update depth") || msg.includes("Too many re-renders")) {
        error.errorType = "InfiniteLoopError";
      } else {
        error.errorType = "Other";
      }
      // Track error event with processed info
      try {
        // Only send minimal stack for privacy and size
        const details: Record<string, unknown> = {};
        if (error.stack) {
          details.stack = error.stack.slice(0, 300);
        }
        if (error.reason) {
          details.reason = error.reason;
        }
        if (typeof trackErrorEvent === "function") {
          trackErrorEvent(error.errorType, error.message, details);
        }
      } catch (e) {
        // Don't let analytics crash error handling
      }
    }

    // Categorize based on error type
    if (
      error.errorType === "SyntaxError" ||
      error.errorType === "ReferenceError" ||
      error.errorType === "TypeError"
    ) {
      return "immediate";
    }

    return "advisory";
  }, []);

  // Maximum number of errors to keep per category
  const MAX_ERRORS_PER_CATEGORY = 3;

  // Add a new error, categorizing it automatically
  const addError = useCallback(
    async (error: RuntimeError) => {
      const category = categorizeError(error);

      // Check if we already have the maximum number of errors for this category
      if (category === "immediate") {
        setImmediateErrors((prev) => {
          // Only add if we have fewer than MAX_ERRORS_PER_CATEGORY
          if (prev.length >= MAX_ERRORS_PER_CATEGORY) {
            return prev; // Don't add more errors
          }
          return [...prev, error];
        });
      } else {
        setAdvisoryErrors((prev) => {
          // Only add if we have fewer than MAX_ERRORS_PER_CATEGORY
          if (prev.length >= MAX_ERRORS_PER_CATEGORY) {
            return prev; // Don't add more errors
          }
          return [...prev, error];
        });
      }

      // If a save callback is provided, save the error to the database
      // Note: We still save to DB even if at max display limit
      if (onSaveError) {
        try {
          await onSaveError(error, category);
        } catch (err) {
          console.error("Failed to save error to database:", err);
        }
      }
    },
    [categorizeError, onSaveError],
  );

  // Clear errors based on didSendErrors event
  useEffect(() => {
    if (didSendErrors && immediateErrors.length > 0) {
      setImmediateErrors([]);
    }
  }, [didSendErrors, immediateErrors]);

  // We don't need separate adder functions as categorization is handled by addError

  // We don't need to log errors when they change - they're handled through the system messages

  return {
    immediateErrors,
    advisoryErrors,
    addError,
    // No longer exposing clear methods - they're handled internally
  };
}
