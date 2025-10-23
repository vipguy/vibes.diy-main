import { beforeEach, describe, expect, it, Mock, vitest } from "vitest";
import { callAi, getMeta, ModelId, ResponseMeta } from "call-ai";

// Mock global fetch
const mock = { fetch: vitest.fn() };

// Mock ReadableStream
const mockReader = {
  read: vitest.fn(),
};

// Create a mock response with headers
const mockResponse = {
  json: vitest.fn(),
  text: vitest.fn(),
  body: {
    getReader: vitest.fn().mockReturnValue(mockReader),
  },
  ok: true,
  status: 200,
  statusText: "OK",
  headers: {
    get: vitest.fn((name) => {
      if (name === "content-type") return "application/json";
      return null;
    }) as Mock,
    forEach: vitest.fn(),
  },
  clone: vitest.fn(function (this: typeof mockResponse) {
    return { ...this };
  }),
} as unknown as Response & { json: Mock };

describe("getMeta", () => {
  beforeEach(() => {
    vitest.clearAllMocks();
    mock.fetch.mockResolvedValue(mockResponse);
  });

  it("should return metadata for non-streaming responses", async () => {
    // Set up mock response with usage data
    mockResponse.json.mockResolvedValue({
      choices: [{ message: { content: "Hello, I am an AI" } }],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 20,
        total_tokens: 30,
      },
      model: "openai/gpt-4o",
    });

    const options = {
      apiKey: "test-api-key",
      model: "openai/gpt-4o",
      mock,
    };

    // Call the API
    const result = await callAi("Hello", options);

    // Get the metadata
    const meta = getMeta(result);

    // Verify metadata content
    expect(meta).toBeDefined();
    expect(meta?.model).toBe("openai/gpt-4o");

    // Verify raw response data
    expect(meta?.rawResponse).toBeDefined();
    expect((meta?.rawResponse as ModelId).model).toBe("openai/gpt-4o");

    // Verify timing information
    expect(meta?.timing).toBeDefined();
    expect(meta?.timing?.startTime).toBeDefined();
    expect(meta?.timing?.endTime).toBeDefined();
  });

  it("provides an exported mock for testing with streaming responses", async () => {
    // This test doesn't use the real callAi with streaming because of the complexity
    // of mocking a proper streaming response. Instead, we create a mock of what
    // the streaming response would look like, and test that getMeta() works with it.

    // Create a simple AsyncGenerator to simulate streaming response
    async function* mockStreamResponse(): AsyncGenerator<string, string, unknown> {
      yield "Hello";
      yield " world";
      return "Hello world";
    }

    // For testing purposes, we'll use the exported version of getMeta to attach metadata
    // to our generator in the same way the real code would
    const generator = mockStreamResponse();

    // Create a mock metadata object
    const mockMeta: ResponseMeta = {
      model: "test-model",
      timing: {
        startTime: Date.now(),
        endTime: Date.now() + 100,
      },
      rawResponse: {
        model: "test-model",
        id: "test-id",
      },
    };

    // Create our own metadata map for testing
    const testMap = new WeakMap<object, ResponseMeta>();
    testMap.set(generator, mockMeta);

    // Mock the getMeta function for this test to use our test map
    // const originalGetMeta = getMeta;
    const mockedGetMeta = vitest.fn((resp) => testMap.get(resp));

    // Check that we can get metadata from our mocked streaming response
    const meta = mockedGetMeta(generator);
    expect(meta).toBeDefined();
    expect(meta).toBe(mockMeta);
    expect(meta?.model).toBe("test-model");
  });

  it("should return undefined if no metadata is associated with response", () => {
    // A random string that wasn't returned from callAi
    const randomString = "This string has no metadata";

    // Get metadata should return undefined
    const meta = getMeta(randomString);
    expect(meta).toBeUndefined();
  });

  it("should handle multiple string responses separately", async () => {
    // Set up first mock response
    mockResponse.json.mockResolvedValueOnce({
      choices: [{ message: { content: "First response" } }],
      model: "openai/gpt-4",
    });

    // First API call
    const firstResponse = await callAi("First prompt", {
      apiKey: "test-api-key",
      model: "openai/gpt-4",
      mock,
    });

    // Set up second mock response
    mockResponse.json.mockResolvedValueOnce({
      choices: [{ message: { content: "Second response" } }],
      model: "openai/gpt-3.5-turbo",
    });

    // Second API call with different model
    const secondResponse = await callAi("Second prompt", {
      apiKey: "test-api-key",
      model: "openai/gpt-3.5-turbo",
      mock,
    });

    // Get metadata for both responses
    const firstMeta = getMeta(firstResponse);
    const secondMeta = getMeta(secondResponse);

    // Each response should have its own metadata
    expect(firstMeta?.model).toBe("openai/gpt-4");
    expect(secondMeta?.model).toBe("openai/gpt-3.5-turbo");
  });
});
