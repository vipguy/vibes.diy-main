import { callAi, getMeta, callAiEnv, Message } from "call-ai";
import { expectOrWarn } from "../test-helper.js";
import { describe, it } from "vitest";

// Increase Jest's default timeout to handle all parallel requests
// jest.setTimeout(60000);

// Skip tests if no API key is available
const haveApiKey = callAiEnv.CALLAI_API_KEY;
// const itif = (condition: boolean) => (condition ? it.concurrent : it.skip);

// Timeout for individual test
const TIMEOUT = 30000;

// Test models based on the OpenRouter documentation
const supportedModels = {
  openAI: { id: "openai/gpt-4o-mini", grade: "A" },
  gemini: { id: "google/gemini-2.5-flash", grade: "A" },
  // geminiPro: { id: "google/gemini-2.5-pro-preview-03-25", grade: "A" },
  // claude: { id: "anthropic/claude-3-sonnet", grade: "A" },
  // claudeThinking: { id: "anthropic/claude-3.7-sonnet:thinking", grade: "B" },
  // llama3: { id: "meta-llama/llama-4-maverick", grade: "B" },
  // deepseek: { id: 'deepseek/deepseek-chat', grade: 'C' },
  // gpt4turbo: { id: "openai/gpt-4-turbo", grade: "B" },
};

// Define the model names as an array for looping
const modelEntries = Object.entries(supportedModels);

// Create a test function that won't fail on timeouts for B and C grade models
const gradeAwareTest = (modelId: { id: string; grade: string }) => {
  if (!haveApiKey) return it.skip;

  if (modelId.grade === "A") {
    return it.concurrent;
  } else {
    // For B and C models, use a test wrapper that won't fail on timeouts
    return (name: string, fn: () => Promise<void>, timeout?: number) => {
      return it.concurrent(
        name,
        async () => {
          try {
            // Set a short timeout for the Promise.race to keep tests running quickly
            const result = await Promise.race([
              fn(),
              new Promise((resolve) =>
                setTimeout(() => {
                  console.warn(`Timeout for ${modelId.id} (Grade ${modelId.grade}): ${name}`);
                  resolve(undefined);
                }, timeout || TIMEOUT),
              ),
            ]);
            return result;
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.warn(`Error in ${modelId.id} (Grade ${modelId.grade}): ${errorMessage}`);
            // Don't fail the test
            return;
          }
        },
        timeout,
      );
    };
  }
};

describe("Simple callAi integration tests", () => {
  // Test basic non-structured requests with all models
  describe("Non-structured text generation", () => {
    // Run all model tests concurrently within this describe block
    modelEntries.map(([modelName, modelId]) => {
      // Test with a complex nested schema
      gradeAwareTest(modelId)(
        `should handle nested schema with ${modelName} model`,
        async () => {
          // API call with a nested schema
          const result = await callAi(
            [
              {
                role: "user" as const,
                content: "Create a file directory structure for a web project",
              },
            ] as Message[],
            {
              apiKey: callAiEnv.CALLAI_API_KEY,
              model: modelId.id,
              schema: {
                type: "object",
                properties: {
                  root: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      type: { type: "string", enum: ["directory"] },
                      children: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            type: {
                              type: "string",
                              enum: ["directory", "file"],
                            },
                            children: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  name: { type: "string" },
                                  type: {
                                    type: "string",
                                    enum: ["directory", "file"],
                                  },
                                },
                                required: ["name", "type"],
                              },
                            },
                          },
                          required: ["name", "type"],
                        },
                      },
                    },
                    required: ["name", "type", "children"],
                  },
                },
                required: ["root"],
              },
            },
          );

          // Get the metadata
          const resultMeta = getMeta(result);

          // Verify response
          expectOrWarn(modelId, typeof result === "string", `Result is not a string but a ${typeof result} in ${modelName} model`);

          // Log raw response information
          console.log(`Raw response for ${modelId.id}:`, resultMeta?.rawResponse ? "available" : "undefined");

          // Verify metadata
          expectOrWarn(modelId, !!resultMeta, `Metadata should be defined for ${modelName} model`);
          if (resultMeta) {
            expectOrWarn(modelId, !!resultMeta.model, `Model should be defined in metadata for ${modelName}`);
            expectOrWarn(modelId, !!resultMeta.timing, `Timing should be defined in metadata for ${modelName}`);
            expectOrWarn(modelId, !!resultMeta.timing?.startTime, `Start time should be defined in metadata for ${modelName}`);
            expectOrWarn(modelId, !!resultMeta.timing?.endTime, `End time should be defined in metadata for ${modelName}`);
            expectOrWarn(modelId, !!resultMeta.rawResponse, `Raw response should be defined in metadata for ${modelName}`);
          }

          if (typeof result === "string") {
            try {
              const data = JSON.parse(result);
              expectOrWarn(
                modelId,
                typeof data === "object" && data !== null,
                `Parsed result is not an object in ${modelName} model response`,
              );

              if (typeof data === "object" && data !== null) {
                // Check root object
                expectOrWarn(modelId, "root" in data, `Missing 'root' in ${modelName} model response`);

                if ("root" in data && typeof data.root === "object") {
                  // Check root properties
                  expectOrWarn(modelId, "name" in data.root, `Missing 'root.name' in ${modelName} model response`);
                  expectOrWarn(modelId, "type" in data.root, `Missing 'root.type' in ${modelName} model response`);
                  expectOrWarn(modelId, "children" in data.root, `Missing 'root.children' in ${modelName} model response`);

                  if ("name" in data.root)
                    expectOrWarn(
                      modelId,
                      typeof data.root.name === "string",
                      `'root.name' is not a string in ${modelName} model response`,
                    );
                  if ("type" in data.root)
                    expectOrWarn(
                      modelId,
                      data.root.type === "directory",
                      `'root.type' is not 'directory' in ${modelName} model response`,
                    );
                  if ("children" in data.root)
                    expectOrWarn(
                      modelId,
                      Array.isArray(data.root.children),
                      `'root.children' is not an array in ${modelName} model response`,
                    );

                  // Check first level of nesting
                  if (Array.isArray(data.root.children) && data.root.children.length > 0) {
                    const firstChild = data.root.children[0];
                    expectOrWarn(modelId, !!firstChild, `First child is undefined in ${modelName} model response`);

                    if (firstChild) {
                      expectOrWarn(modelId, !!firstChild.name, `Missing 'firstChild.name' in ${modelName} model response`);
                      expectOrWarn(modelId, !!firstChild.type, `Missing 'firstChild.type' in ${modelName} model response`);
                      expectOrWarn(modelId, !!firstChild.children, `Missing 'firstChild.children' in ${modelName} model response`);

                      if (firstChild.name)
                        expectOrWarn(
                          modelId,
                          typeof firstChild.name === "string",
                          `'firstChild.name' is not a string in ${modelName} model response`,
                        );
                      if (firstChild.type)
                        expectOrWarn(
                          modelId,
                          typeof firstChild.type === "string",
                          `'firstChild.type' is not a string in ${modelName} model response`,
                        );
                      if (firstChild.children)
                        expectOrWarn(
                          modelId,
                          Array.isArray(firstChild.children),
                          `'firstChild.children' is not an array in ${modelName} model response`,
                        );

                      // Check for at least one file in the second level
                      if (Array.isArray(firstChild.children) && firstChild.children.length > 0) {
                        const secondChild = firstChild.children[0];
                        expectOrWarn(modelId, !!secondChild, `Second child is undefined in ${modelName} model response`);

                        if (secondChild) {
                          expectOrWarn(modelId, !!secondChild.name, `Missing 'secondChild.name' in ${modelName} model response`);
                          expectOrWarn(modelId, !!secondChild.type, `Missing 'secondChild.type' in ${modelName} model response`);

                          if (secondChild.name)
                            expectOrWarn(
                              modelId,
                              typeof secondChild.name === "string",
                              `'secondChild.name' is not a string in ${modelName} model response`,
                            );
                          if (secondChild.type)
                            expectOrWarn(
                              modelId,
                              typeof secondChild.type === "string",
                              `'secondChild.type' is not a string in ${modelName} model response`,
                            );
                        }
                      }
                    }
                  }
                }
              }
            } catch (e) {
              expectOrWarn(modelId, false, `JSON parse error in ${modelName} model response: ${e}`);
            }
          }
        },
        TIMEOUT,
      );
    });
  });
});
