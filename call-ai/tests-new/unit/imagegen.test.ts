/**
 * Basic test for imageGen function
 * Using .js extension to avoid TypeScript errors while testing the core functionality
 */

// Import the function directly from the module
import { vitest, describe, test, expect, beforeEach } from "vitest";
import { imageGen } from "call-ai";

const mock = {
  fetch: vitest.fn<typeof fetch>(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () =>
        Promise.resolve({
          created: Date.now(),
          data: [
            {
              b64_json: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", // 1x1 px transparent PNG
              revised_prompt: "Generated image based on prompt",
            },
          ],
        }),
    } as Response),
  ),
};

describe("imageGen function", () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  // Simple test to verify basic functionality
  test("should make a POST request to generate an image", async () => {
    const prompt = "A children's book drawing of a veterinarian";

    try {
      // Call the imageGen function
      const result = await imageGen(prompt, {
        apiKey: "VIBES_DIY",
        model: "gpt-image-1",
        mock,
      });

      // Verify the fetch call was made correctly
      expect(mock.fetch).toHaveBeenCalledTimes(1);
      expect(mock.fetch).toHaveBeenCalledWith(
        expect.stringMatching("/api/openai-image/generate"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer VIBES_DIY",
            "Content-Type": "application/json",
          }),
        }),
      );

      // Verify the result structure
      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].b64_json).toBeDefined();
    } catch (error) {
      // Log in case of error to help with debugging
      console.error("Test failed:", error);
      throw error;
    }
  });

  // Test for image editing with multiple images
  test("should make a POST request for image editing", async () => {
    const prompt = "Create a lovely gift basket with these items";

    // Mock File objects
    const mockImageBlob = new Blob(["fake image data"], { type: "image/png" });
    const mockFiles = [
      new File([mockImageBlob], "image1.png", { type: "image/png" }),
      new File([mockImageBlob], "image2.png", { type: "image/png" }),
    ];

    try {
      const result = await imageGen(prompt, {
        apiKey: "VIBES_DIY",
        model: "gpt-image-1",
        images: mockFiles,
        mock,
      });

      // Verify the fetch call was made correctly
      expect(mock.fetch).toHaveBeenCalledTimes(1);
      expect(mock.fetch).toHaveBeenCalledWith(
        expect.stringMatching("/api/openai-image/edit"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer VIBES_DIY",
          }),
        }),
      );

      // Verify the result structure
      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].b64_json).toBeDefined();
    } catch (error) {
      console.error("Test failed:", error);
      throw error;
    }
  });
});
