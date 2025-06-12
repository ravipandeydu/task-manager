const { parseTaskInput } = require("../utils/nlpParser");

describe("NLP Parser", () => {
  test("should extract title, assignee, due date and priority", () => {
    const input = "Finish landing page Aman by 11pm 20th June P1";
    const result = parseTaskInput(input);

    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("assignee");
    expect(result).toHaveProperty("dueDate");
    expect(result).toHaveProperty("priority");

    expect(result.title).toContain("Finish landing page");
    expect(result.assignee).toBe("Aman");
    expect(result.dueDate).toBeInstanceOf(Date);
    expect(result.priority).toBe("P1");
  });

  test("should use default priority P3 when not specified", () => {
    const input = "Call client Rajeev tomorrow 5pm";
    const result = parseTaskInput(input);

    expect(result.title).toContain("Call client");
    expect(result.assignee).toBe("Rajeev");
    expect(result.dueDate).toBeInstanceOf(Date);
    expect(result.priority).toBe("P3");
  });

  test('should handle input with "to" preposition for assignee', () => {
    const input = "Send report to Sarah by Friday P2";
    const result = parseTaskInput(input);

    expect(result.title).toContain("Send report");
    expect(result.assignee).toBe("Sarah");
    expect(result.dueDate).toBeInstanceOf(Date);
    expect(result.priority).toBe("P2");
  });

  test("should throw error for empty input", () => {
    expect(() => {
      parseTaskInput("");
    }).toThrow();
  });

  test("should handle input without assignee", () => {
    const input = "Buy groceries by tomorrow P4";
    const result = parseTaskInput(input);

    expect(result.title).toBe("Buy groceries");
    expect(result.assignee).toBe("");
    expect(result.dueDate).toBeInstanceOf(Date);
    expect(result.priority).toBe("P4");
  });
});
