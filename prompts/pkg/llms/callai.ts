import type { LlmConfig } from "./types.js";

export const callaiConfig: LlmConfig = {
  name: "callai",
  label: "callAI",
  llmsTxtUrl: "https://use-fireproof.com/callai-llms.txt",
  module: "openrouter",
  description: "easy API for LLM requests with streaming support",
  importModule: "call-ai",
  importName: "callAI",
};
