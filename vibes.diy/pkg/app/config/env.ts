/// <reference types="vite/client" />
/**
 * Central configuration file for environment variables
 * Provides fallback values for required environment variables
 */
import { Lazy } from "@adviser/cement";
import { ensureSuperThis } from "@fireproof/core-runtime";
import { callAiEnv } from "call-ai";

// Function to get the current database version from local storage
function getDatabaseVersion(): number {
  if (typeof window === "undefined") return 0;

  const storedVersion = localStorage.getItem("vibes-db-version") || "";
  return storedVersion ? JSON.parse(storedVersion) : 0;
}

// Function to increment the database version
export function incrementDatabaseVersion(): number {
  if (typeof window === "undefined") return 0;

  const currentVersion = getDatabaseVersion();
  const newVersion = currentVersion === 0 ? 1 : currentVersion + 1;

  localStorage.setItem("vibes-db-version", JSON.stringify(newVersion));
  return newVersion;
}

// Fireproof database name with version suffix
export function getVersionSuffix(): string {
  const version = getDatabaseVersion();
  return version === 0 ? "" : `${version}`;
}

// --- Vite Environment Variables ---
// Access environment variables safely with fallbacks

// Analytics

class vibesDiyEnv {
  readonly env = Lazy(() => callAiEnv.merge(ensureSuperThis().env));

  readonly PROMPT_FALL_BACKURL = Lazy(
    () =>
      new URL(
        this.env().get("PROMPT_FALL_BACKURL") ??
          "https://esm.sh/@vibes.diy/prompts/llms",
      ),
  );

  readonly GA_TRACKING_ID = Lazy(
    () => this.env().get("VITE_GOOGLE_ANALYTICS_ID") ?? "",
  );

  // PostHog
  readonly POSTHOG_KEY = Lazy(() => this.env().get("VITE_POSTHOG_KEY") ?? "");
  readonly POSTHOG_HOST = Lazy(() => this.env().get("VITE_POSTHOG_HOST") ?? "");

  // Application Behavior
  readonly APP_MODE = Lazy(() => this.env().get("MODE") ?? "production");
  readonly APP_BASENAME = Lazy(
    () => this.env().get("VITE_APP_BASENAME") ?? "/",
  );

  // Fireproof Connect & Auth
  readonly CONNECT_URL = Lazy(
    () =>
      this.env().get("VITE_CONNECT_URL") ??
      "https://connect.fireproof.direct/token",
  );
  readonly CONNECT_API_URL = Lazy(
    () =>
      this.env().get("VITE_CONNECT_API_URL") ??
      "https://connect.fireproof.direct/api",
  );
  readonly CLOUD_SESSION_TOKEN_PUBLIC_KEY = Lazy(
    () =>
      this.env().get("VITE_CLOUD_SESSION_TOKEN_PUBLIC") ??
      "zeWndr5LEoaySgKSo2aZniYqWtx2vKfVz4dd5GQwAuby3fPKcNyLp6mFpf9nCRFYbUcPiN2YT1ZApJ6f3WipiVjuMvyP1JYgHwkaoxDBpJiLoz1grRYkbao9ntukNNo2TQ4uSznUmNPrr4ZxjihoavHwB1zLhLNp5Qj78fBkjgEMA",
  );

  // Vibes Service API
  readonly API_BASE_URL = Lazy(
    () =>
      new URL(
        this.env().get("VITE_API_BASE_URL") ?? "https://vibes-diy-api.com",
      ).href, // Keep trailing slash - standardize on YES trailing slash
  );
  readonly APP_HOST_BASE_URL = Lazy(
    () =>
      new URL(
        this.env().get("VITE_APP_HOST_BASE_URL") ?? "https://vibesdiy.app",
      ).href, // Keep trailing slash - standardize on YES trailing slash
  );

  // CallAI Endpoint
  readonly CALLAI_ENDPOINT = Lazy(
    () =>
      new URL(this.env().get("VITE_CALLAI_ENDPOINT") ?? this.API_BASE_URL())
        .href, // Keep trailing slash - standardize on YES trailing slash
  );

  // Chat History Database
  readonly SETTINGS_DBNAME = Lazy(
    () =>
      (this.env().get("VITE_VIBES_CHAT_HISTORY") ?? "vibes-chats") +
      getVersionSuffix(),
  );
}

export const VibesDiyEnv = new vibesDiyEnv();
