const { parseTranscript } = require("../utils/transcriptParser");

describe("Transcript Parser", () => {
  test("should extract multiple tasks from a transcript", () => {
    const transcript = "Aman you take the landing page by 10pm tomorrow. Rajeev you take care of client follow-up by Wednesday. Shreya please review the marketing deck tonight.";
    const result = parseTranscript(transcript);

    expect(result).toHaveProperty("tasks");
    expect(result).toHaveProperty("failedSentences");
    expect(result).toHaveProperty("totalSentences");
    expect(result).toHaveProperty("successfulParses");

    expect(result.tasks.length).toBe(3);
    expect(result.failedSentences.length).toBe(0);
    expect(result.totalSentences).toBe(3);
    expect(result.successfulParses).toBe(3);

    // Check first task
    expect(result.tasks[0].title).toContain("take the landing page");
    expect(result.tasks[0].assignee).toBe("Aman");
    expect(result.tasks[0].dueDate).toBeInstanceOf(Date);

    // Check second task
    expect(result.tasks[1].title).toContain("take care of client follow-up");
    expect(result.tasks[1].assignee).toBe("Rajeev");
    expect(result.tasks[1].dueDate).toBeInstanceOf(Date);

    // Check third task
    expect(result.tasks[2].title).toContain("review the marketing deck");
    expect(result.tasks[2].assignee).toBe("Shreya");
    expect(result.tasks[2].dueDate).toBeInstanceOf(Date);
  });

  test("should handle transcripts with some unparseable sentences", () => {
    const transcript = "Aman you take the landing page by 10pm tomorrow. This is not a task. Shreya please review the marketing deck tonight.";
    const result = parseTranscript(transcript);

    expect(result.tasks.length).toBe(2);
    expect(result.failedSentences.length).toBe(1);
    expect(result.totalSentences).toBe(3);
    expect(result.successfulParses).toBe(2);

    expect(result.failedSentences[0]).toBe("This is not a task");
  });

  test("should handle empty transcript", () => {
    expect(() => {
      parseTranscript("");
    }).toThrow("Transcript must be a non-empty string");
  });

  test("should handle transcript with no parseable tasks", () => {
    const transcript = "This is just a regular meeting discussion with no tasks.";
    const result = parseTranscript(transcript);

    expect(result.tasks.length).toBe(0);
    expect(result.failedSentences.length).toBe(1);
    expect(result.totalSentences).toBe(1);
    expect(result.successfulParses).toBe(0);
  });

  test("should extract tasks with priorities", () => {
    const transcript = "Aman you take the landing page by 10pm tomorrow P1. Rajeev you take care of client follow-up by Wednesday P2.";
    const result = parseTranscript(transcript);

    expect(result.tasks.length).toBe(2);
    expect(result.tasks[0].priority).toBe("P1");
    expect(result.tasks[1].priority).toBe("P2");
  });
});