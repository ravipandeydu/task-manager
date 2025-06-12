const { parseTaskWithAI } = require("../utils/openaiParser");
const { OpenAI } = require("openai");

// Mock OpenAI
jest.mock("openai", () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      title: "Finish landing page",
                      assignee: "Aman",
                      dueDate: "2023-06-20T23:00:00.000Z",
                      priority: "P1",
                    }),
                  },
                },
              ],
            }),
          },
        },
      };
    }),
  };
});

describe("OpenAI Parser", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock environment variables
    process.env.OPENAI_API_KEY = "test-api-key";
  });

  test("should parse task input using OpenAI", async () => {
    const input = "Finish landing page Aman by 11pm 20th June P1";
    const result = await parseTaskWithAI(input);

    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("assignee");
    expect(result).toHaveProperty("dueDate");
    expect(result).toHaveProperty("priority");

    expect(result.title).toBe("Finish landing page");
    expect(result.assignee).toBe("Aman");
    expect(result.dueDate).toBeInstanceOf(Date);
    expect(result.priority).toBe("P1");
  });

  test("should throw error for empty input", async () => {
    await expect(parseTaskWithAI("")).rejects.toThrow(
      "Input must be a non-empty string"
    );
  });

  test("should throw error when OpenAI API fails", async () => {
    // Mock OpenAI to throw an error
    const mockOpenAI = require("openai");
    mockOpenAI.OpenAI.mockImplementationOnce(() => {
      return {
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue(new Error("API error")),
          },
        },
      };
    });

    await expect(parseTaskWithAI("Test task")).rejects.toThrow(
      "Failed to parse task with AI"
    );
  });
});
