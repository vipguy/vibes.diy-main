import { vitest, describe, it, expect, beforeEach, Mock, assert } from "vitest";
import { callAi, Message, Schema } from "call-ai";

// Mock global fetch

describe("callAi", () => {
  let mock: { fetch: Mock };
  let mockResponse: {
    json: Mock;
    body: {
      getReader: () => ReadableStreamDefaultReader;
    };
    ok: true;
    status: 200;
    statusText: "OK";
  };
  let mockReader: {
    read: Mock;
  };
  beforeEach(() => {
    mock = { fetch: vitest.fn() };
    mockReader = {
      read: vitest.fn(),
    };
    mockResponse = {
      json: vitest.fn(),
      body: {
        getReader: vitest.fn().mockReturnValue(mockReader),
      } as unknown as ReadableStream,
      ok: true, // Ensure response is treated as successful
      status: 200,
      statusText: "OK",
    };
    mock.fetch.mockResolvedValue(mockResponse);
  });

  it("should handle API key requirement for non-streaming", async () => {
    // Setting default response for general case
    mockResponse.json.mockResolvedValueOnce({
      choices: [{ message: { content: "" } }],
    });

    try {
      await callAi("Hello, AI", { mock });
      // If we get here, the test should fail because an error should have been thrown
      assert.fail("Expected an error to be thrown");
    } catch (error) {
      // Error should be thrown because no API key was provided
      expect((error as Error).message).toContain("API key is required");
    }
  });

  it("should handle API key requirement for streaming", async () => {
    mockReader.read.mockResolvedValueOnce({ done: true });

    try {
      await callAi("Hello, AI", { stream: true, mock });
      // If we get here, the test should fail because an error should have been thrown
      assert.fail("Expected an error to be thrown");
    } catch (error) {
      // Error should be thrown because no API key was provided
      expect((error as Error).message).toContain("API key is required");
    }
  });

  it("should make POST request with correct parameters for non-streaming", async () => {
    const prompt = "Hello, AI";
    const options = {
      apiKey: "test-api-key",
      model: "test-model",
      temperature: 0.7,
      mock,
    };

    mockResponse.json.mockResolvedValue({
      choices: [{ message: { content: "Hello, I am an AI" } }],
    });

    await callAi(prompt, options);

    expect(mock.fetch).toHaveBeenCalledTimes(1);
    expect(mock.fetch).toHaveBeenCalledWith(
      "https://openrouter.ai/api/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer test-api-key",
          "HTTP-Referer": "https://vibes.diy",
          "X-Title": "Vibes",
          "Content-Type": "application/json",
        },
      }),
    );

    const body = JSON.parse(mock.fetch.mock.calls[0][1].body);
    expect(body.model).toBe("test-model");
    expect(body.messages).toEqual([{ role: "user", content: "Hello, AI" }]);
    expect(body.temperature).toBe(0.7);
    expect(body.stream).toBe(false);
  });

  it("should make POST request with correct parameters for streaming", async () => {
    const prompt = "Hello, AI";
    const options = {
      apiKey: "test-api-key",
      model: "test-model",
      temperature: 0.7,
      stream: true,
      // debug: true,
      mock,
    };

    // Mock successful response to avoid errors
    mockReader.read.mockResolvedValueOnce({ done: true });

    const generator = callAi(prompt, options) as unknown as AsyncGenerator<string, string, unknown>;
    await generator.next();

    expect(mock.fetch).toHaveBeenCalledTimes(1);

    const body = JSON.parse(mock.fetch.mock.calls[0][1].body);
    expect(body.model).toBe("test-model");
    expect(body.messages).toEqual([{ role: "user", content: "Hello, AI" }]);
    expect(body.temperature).toBe(0.7);
    expect(body.stream).toBe(true);
  });

  it("should handle message array for prompt", async () => {
    const messages: Message[] = [
      { role: "system", content: "You are a helpful assistant" },
      { role: "user", content: "Hello" },
    ];
    const options = { apiKey: "test-api-key", stream: true, mock };

    // Mock successful response to avoid errors
    mockReader.read.mockResolvedValueOnce({ done: true });

    const generator = callAi(messages, options) as unknown as AsyncGenerator<string, string, unknown>;
    await generator.next();

    const body = JSON.parse(mock.fetch.mock.calls[0][1].body);
    expect(body.messages).toEqual(messages);
  });

  it("should handle schema parameter correctly", async () => {
    const schema: Schema = {
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name"],
    };

    const options = {
      apiKey: "test-api-key",
      stream: true,
      model: "openai/gpt-4o", // Explicitly use OpenAI model to ensure JSON schema is used
      schema: schema,
      mock,
    };

    // Mock successful response to avoid errors
    mockReader.read.mockResolvedValueOnce({ done: true });

    const generator = callAi("Get user info", options) as unknown as AsyncGenerator<string, string, unknown>;
    await generator.next();

    const body = JSON.parse(mock.fetch.mock.calls[0][1].body);
    expect(body.response_format.type).toBe("json_schema");
    expect(body.response_format.json_schema.schema.required).toEqual(["name"]);
  });

  it("should handle schema parameter matching documentation example", async () => {
    const todoSchema: Schema = {
      properties: {
        todos: {
          type: "array",
          items: { type: "string" },
        },
      },
    };

    const options = {
      apiKey: "test-api-key",
      model: "openai/gpt-4o", // Explicitly use OpenAI model
      schema: todoSchema,
      mock,
    };

    mockResponse.json.mockResolvedValue({
      choices: [
        {
          message: {
            content: '{"todos": ["Learn React basics", "Build a simple app", "Master hooks"]}',
          },
        },
      ],
    });

    await callAi("Give me a todo list for learning React", options);

    const body = JSON.parse(mock.fetch.mock.calls[0][1].body);
    expect(body.response_format.type).toBe("json_schema");
    expect(body.response_format.json_schema.schema.properties).toEqual(todoSchema.properties);
  });

  it("should handle aliens schema example", async () => {
    const alienSchema = {
      properties: {
        aliens: {
          type: "array",
          properties: {
            aliens: {
              items: {
                properties: {},
              },
            },
          },
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              traits: {
                type: "array",
                items: { type: "string" },
              },
              environment: { type: "string" },
            },
          },
        },
      },
    } satisfies Schema;

    const messages: Message[] = [
      {
        role: "user" as const,
        content: "Generate 3 unique alien species with unique biological traits, appearance, and preferred environments.",
      },
    ];

    const options = {
      apiKey: "test-api-key",
      model: "openai/gpt-4o", // Use OpenAI model explicitly
      stream: true,
      schema: alienSchema,
      mock,
    };

    // Mock successful response
    mockReader.read.mockResolvedValueOnce({ done: true });

    const generator = callAi(messages, options) as unknown as AsyncGenerator<string, string, unknown>;
    await generator.next();

    const body = JSON.parse(mock.fetch.mock.calls[0][1].body);
    expect(body.response_format.type).toBe("json_schema");
    // The schema is processed with additionalProperties and required fields
    // So we just check that the main structure is preserved
    expect(body.response_format.json_schema.schema.properties.aliens.type).toBe("array");
    expect(body.response_format.json_schema.schema.properties.aliens.items.type).toBe("object");
    expect(body.response_format.json_schema.schema.properties.aliens.items.properties).toEqual(
      alienSchema.properties.aliens.items.properties,
    );
    expect(body.model).toBe("openai/gpt-4o");
    expect(body.stream).toBe(true);
  });

  it("should handle non-streaming response", async () => {
    mockResponse.json.mockResolvedValue({
      choices: [{ message: { content: "Hello, I am an AI" } }],
    });

    const options = {
      apiKey: "test-api-key",
      skipRetry: true, // Prevent fallback retry mechanism for tests
      mock,
    };

    const result = await callAi("Hello", options);

    expect(result).toBe("Hello, I am an AI");
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
  });

  it("should include schema name property when provided", async () => {
    const schemaWithName: Schema = {
      name: "test_schema",
      properties: {
        result: { type: "string" },
      },
    };

    const options = {
      apiKey: "test-api-key",
      model: "openai/gpt-4o", // Explicitly use OpenAI model
      schema: schemaWithName,
      mock,
    };

    mockResponse.json.mockResolvedValue({
      choices: [{ message: { content: '{"result": "Test successful"}' } }],
    });

    await callAi("Test with schema name", options);

    const body = JSON.parse(mock.fetch.mock.calls[0][1].body);
    expect(body.response_format.type).toBe("json_schema");
    expect(body.response_format.json_schema.name).toBe("test_schema");
  });

  it("should work correctly with schema without name property", async () => {
    const schemaWithoutName: Schema = {
      properties: {
        result: { type: "string" },
      },
    };

    const options = {
      apiKey: "test-api-key",
      model: "openai/gpt-4o", // Explicitly use OpenAI model
      schema: schemaWithoutName,
      mock,
    };

    mockResponse.json.mockResolvedValue({
      choices: [{ message: { content: '{"result": "Test successful"}' } }],
    });

    await callAi("Test without schema name", options);

    const body = JSON.parse(mock.fetch.mock.calls[0][1].body);
    expect(body.response_format.type).toBe("json_schema");
    expect(body.response_format.json_schema.name).toBe("result");
  });

  it('should use default name "result" when schema has no name property', async () => {
    const schemaWithoutName: Schema = {
      properties: {
        data: { type: "string" },
      },
    };

    const options = {
      apiKey: "test-api-key",
      model: "openai/gpt-4o", // Explicitly use OpenAI model
      schema: schemaWithoutName,
      mock,
    };

    mockResponse.json.mockResolvedValue({
      choices: [{ message: { content: '{"data": "Some content"}' } }],
    });

    await callAi("Generate content with schema", options);

    const body = JSON.parse(mock.fetch.mock.calls[0][1].body);
    expect(body.response_format.type).toBe("json_schema");
    expect(body.response_format.json_schema.name).toBe("result");
  });

  it("should handle schema with empty properties", async () => {
    const emptySchema: Schema = {
      properties: {},
    };

    const options = {
      apiKey: "test-api-key",
      model: "openai/gpt-4o", // Explicitly use OpenAI model
      schema: emptySchema,
      mock,
    };

    mockResponse.json.mockResolvedValue({
      choices: [{ message: { content: "{}" } }],
    });

    await callAi("Test with empty schema", options);

    const body = JSON.parse(mock.fetch.mock.calls[0][1].body);
    expect(body.response_format.type).toBe("json_schema");
    expect(body.response_format.json_schema.name).toBe("result");
    expect(body.response_format.json_schema.schema.properties).toEqual({});
    expect(body.response_format.json_schema.schema.required).toEqual([]);
  });

  it("should respect additionalProperties setting in schema", async () => {
    const schema: Schema = {
      properties: {
        result: { type: "string" },
      },
      additionalProperties: true,
    };

    const options = {
      apiKey: "test-api-key",
      model: "openai/gpt-4o", // Explicitly use OpenAI model
      schema: schema,
      mock,
    };

    mockResponse.json.mockResolvedValue({
      choices: [
        {
          message: {
            content: '{"result": "Test successful", "extra": "Additional field"}',
          },
        },
      ],
    });

    await callAi("Test with additionalProperties", options);

    const body = JSON.parse(mock.fetch.mock.calls[0][1].body);
    expect(body.response_format.json_schema.schema.additionalProperties).toBe(true);
  });

  it("should handle errors during API call for non-streaming", async () => {
    mock.fetch.mockRejectedValue(new Error("Network error"));

    try {
      const options = { apiKey: "test-api-key", mock };
      await callAi("Hello", options);
      // If we get here, the test should fail because an error should have been thrown
      assert.fail("Expected an error to be thrown");
    } catch (error) {
      // Error should contain the network error message
      expect((error as Error).message).toContain("Network error");
    }
  });

  it("should handle errors during API call for streaming", async () => {
    mock.fetch.mockRejectedValue(new Error("Network error"));

    try {
      const options = { apiKey: "test-api-key", stream: true, mock };
      await callAi("Hello", options);
      // If we get here, the test should fail because an error should have been thrown
      assert.fail("Expected an error to be thrown");
    } catch (error) {
      // Error should contain the network error message
      expect((error as Error).message).toContain("Network error");
    }
  });

  it("should default to streaming mode (false) if not specified", async () => {
    const options = { apiKey: "test-api-key", mock };

    mockResponse.json.mockResolvedValue({
      choices: [{ message: { content: "Hello, I am an AI" } }],
    });

    await callAi("Hello", options);

    const body = JSON.parse(mock.fetch.mock.calls[0][1].body);
    expect(body.stream).toBe(false);
  });

  it("should include schema property in json_schema", async () => {
    const schema: Schema = {
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        songs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              artist: { type: "string" },
              year: { type: "string" },
              comment: { type: "string" },
            },
          },
        },
      },
      required: ["title", "description", "songs"],
    };

    const options = {
      apiKey: "test-api-key",
      // GPT-4-Turbo uses system message approach by default
      model: "openai/gpt-4o", // Use GPT-4o instead, which uses JSON schema
      schema: schema,
      mock,
    };

    mockResponse.json.mockResolvedValue({
      choices: [
        {
          message: {
            content: '{"title":"Healthy Living","description":"A playlist to inspire a healthy lifestyle"}',
          },
        },
      ],
    });

    await callAi("Create a themed music playlist", options);

    const body = JSON.parse(mock.fetch.mock.calls[0][1].body);
    expect(body.response_format.type).toBe("json_schema");
    // Check that schema property exists in json_schema containing the schema definition
    expect(body.response_format.json_schema.schema).toBeDefined();

    // Instead of comparing full objects (which now have extra properties), check key structure
    const schemaProperties = body.response_format.json_schema.schema.properties;
    expect(schemaProperties.title.type).toBe("string");
    expect(schemaProperties.description.type).toBe("string");
    expect(schemaProperties.songs.type).toBe("array");
    expect(schemaProperties.songs.items.type).toBe("object");
    expect(schemaProperties.songs.items.properties.title.type).toBe("string");
    expect(schemaProperties.songs.items.properties.artist.type).toBe("string");
    expect(schemaProperties.songs.items.properties.year.type).toBe("string");
    expect(schemaProperties.songs.items.properties.comment.type).toBe("string");

    // Check that required fields are passed through
    expect(body.response_format.json_schema.schema.required).toEqual(schema.required);
  });

  it("should handle streaming with schema for structured output", async () => {
    const schema: Schema = {
      name: "weather",
      properties: {
        temperature: { type: "number" },
        conditions: { type: "string" },
      },
    };

    const options = {
      apiKey: "test-api-key",
      model: "openai/gpt-4o", // Explicitly use OpenAI model
      stream: true,
      schema: schema,
      mock,
    };

    // Mock response and reader behavior more comprehensively
    const mockResponseWithBody = {
      ok: true,
      status: 200,
      body: {
        getReader: vitest.fn().mockReturnValue({
          read: vitest
            .fn()
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode(`data: {"choices":[{"delta":{"content":"{\\"temp"}}]}\n\n`),
            })
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode(`data: {"choices":[{"delta":{"content":"erature\\": 22, \\"cond"}}]}\n\n`),
            })
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode(`data: {"choices":[{"delta":{"content":"itions\\": \\"Sunny\\"}"}}]}\n\n`),
            })
            .mockResolvedValueOnce({
              done: true,
            }),
        }),
      },
    };

    // Override the mock.fetch mock for this test
    mock.fetch.mockResolvedValueOnce(mockResponseWithBody);

    const generator = callAi("What is the weather?", options) as unknown as AsyncGenerator<string, string, unknown>;

    // Manually iterate and collect
    let finalValue = "";
    let result = await generator.next();
    while (!result.done) {
      finalValue = result.value as string;
      result = await generator.next();
    }

    // Verify request format
    const body = JSON.parse(mock.fetch.mock.calls[0][1].body);
    expect(body.response_format.type).toBe("json_schema");
    expect(body.response_format.json_schema.name).toBe("weather");
    expect(body.stream).toBe(true);

    // With our mock, we expect the final value to include the combined chunks
    expect(finalValue).toContain("temperature");
    expect(finalValue).toContain("22");
    expect(finalValue).toContain("conditions");
    expect(finalValue).toContain("Sunny");
  });
});
