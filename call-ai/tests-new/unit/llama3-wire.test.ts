import { callAi, Schema, Message } from "call-ai";
import { describe, beforeEach, it, expect, vitest } from "vitest";
// import { vitest } from "vitest";

// Mock fetch to use our fixture files
const mock = { fetch: vitest.fn() };

describe("Llama3 Wire Protocol Tests", () => {
  // Read fixtures
  // const llama3RequestFixture = JSON.parse(
  //   fs.readFileSync(
  //     path.join(__dirname, "fixtures/llama3-request.json"),
  //     "utf8",
  //   ),
  // );

  function llama3ResponseFixture() {
    return fetch("http://localhost:15731/fixtures/llama3-response.json").then((r) => r.json());
  }

  // const llama3SystemRequestFixture = JSON.parse(
  //   fs.readFileSync(
  //     path.join(__dirname, "fixtures/llama3-system-request.json"),
  //     "utf8",
  //   ),
  // );

  function llama3SystemResponseFixture() {
    return fetch("http://localhost:15731/fixtures/llama3-system-response.json").then((r) => r.json());
  }

  beforeEach(() => {
    // Reset mocks
    mock.fetch.mockClear();

    // Mock successful response
    mock.fetch.mockImplementation(async () => {
      return {
        ok: true,
        status: 200,
        text: async () => llama3ResponseFixture().then((r) => JSON.stringify(r)),
        json: async () => llama3ResponseFixture(),
      };
    });
  });

  it("should use the system message approach for Llama3 with schema", async () => {
    // Define schema
    const schema: Schema = {
      name: "book_recommendation",
      properties: {
        title: { type: "string" },
        author: { type: "string" },
        year: { type: "number" },
        genre: { type: "string" },
        rating: { type: "number", minimum: 1, maximum: 5 },
      },
    };

    // Call the library function with the schema
    await callAi("Give me a short book recommendation in the requested format.", {
      apiKey: "test-api-key",
      model: "meta-llama/llama-3.3-70b-instruct",
      schema: schema,
      mock,
    });

    // Verify fetch was called
    expect(mock.fetch).toHaveBeenCalled();

    // Get the request body that was passed to fetch
    const actualRequestBody = JSON.parse(mock.fetch.mock.calls[0][1].body);

    // Check that we're using system message approach rather than JSON schema format
    expect(actualRequestBody.messages).toBeTruthy();
    expect(actualRequestBody.messages.length).toBeGreaterThan(1);

    // Check for system message with schema info
    const systemMessage = actualRequestBody.messages.find((m: { role: string }) => m.role === "system");
    expect(systemMessage).toBeTruthy();
    expect(systemMessage.content).toContain("title");
    expect(systemMessage.content).toContain("author");
    expect(systemMessage.content).toContain("year");
    expect(systemMessage.content).toContain("genre");
    expect(systemMessage.content).toContain("rating");

    // Verify user message is included
    const userMessage = actualRequestBody.messages.find((m: { role: string }) => m.role === "user");
    expect(userMessage).toBeTruthy();
    expect(userMessage.content).toBe("Give me a short book recommendation in the requested format.");

    // Verify response_format is not used
    expect(actualRequestBody.response_format).toBeUndefined();
  });

  it("should correctly handle Llama3 response with schema", async () => {
    // Update mock to return proper response
    mock.fetch.mockImplementationOnce(async () => {
      return {
        ok: true,
        status: 200,
        text: async () => llama3ResponseFixture().then((r) => JSON.stringify(r)),
        json: async () => llama3ResponseFixture(),
      };
    });

    // Define the schema
    const schema: Schema = {
      name: "book_recommendation",
      properties: {
        title: { type: "string" },
        author: { type: "string" },
        year: { type: "number" },
        genre: { type: "string" },
        rating: { type: "number", minimum: 1, maximum: 5 },
      },
    };

    // Call the library with Llama3 model
    const result = await callAi("Give me a short book recommendation in the requested format.", {
      apiKey: "test-api-key",
      model: "meta-llama/llama-3.3-70b-instruct",
      schema: schema,
      mock,
    });

    // Parse the Llama3 response fixture to get expected content
    // const responseObj = JSON.parse(llama3ResponseFixture());
    // const responseContent = responseObj.choices[0].message.content;

    // Verify the result
    expect(result).toBeTruthy();

    // Based on the actual response we got, Llama3 returns markdown-formatted text
    // rather than JSON, so we need to handle that case
    if (typeof result === "string") {
      expect(result).toContain("Title");
      expect(result).toContain("Author");
      expect(result).toContain("Genre");
    }
  });

  it("should handle system message approach with Llama3", async () => {
    // Update mock to return system message response
    mock.fetch.mockImplementationOnce(async () => {
      return {
        ok: true,
        status: 200,
        text: async () => llama3SystemResponseFixture().then((r) => JSON.stringify(r)),
        json: async () => llama3SystemResponseFixture(),
      };
    });

    // Call the library with messages array including system message
    const result = await callAi(
      [
        {
          role: "system",
          content:
            'Please generate structured JSON responses that follow this exact schema:\n{\n  "title": string,\n  "author": string,\n  "year": number,\n  "genre": string,\n  "rating": number (between 1-5)\n}\nDo not include any explanation or text outside of the JSON object.',
        },
        {
          role: "user",
          content: "Give me a short book recommendation. Respond with only valid JSON matching the schema.",
        },
      ] as Message[],
      {
        apiKey: "test-api-key",
        model: "meta-llama/llama-3.3-70b-instruct",
        mock,
      },
    );

    // Verify the result
    expect(result).toBeTruthy();

    // Based on the actual response, Llama3 can return proper JSON with system messages
    if (typeof result === "string") {
      const parsedResult = JSON.parse(result as string);
      expect(parsedResult).toHaveProperty("title");
      expect(parsedResult).toHaveProperty("author");
      expect(parsedResult).toHaveProperty("year");
      expect(parsedResult).toHaveProperty("genre");
      expect(parsedResult).toHaveProperty("rating");
    } else if (typeof result === "object") {
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("author");
      expect(result).toHaveProperty("year");
      expect(result).toHaveProperty("genre");
      expect(result).toHaveProperty("rating");
    }
  });
});
