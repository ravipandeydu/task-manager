const chrono = require('chrono-node');

/**
 * Parse natural language input to extract task details
 * @param {string} input - Natural language input string
 * @returns {Object} - Extracted task details
 */
const parseTaskInput = (input) => {
  if (!input || typeof input !== 'string') {
    throw new Error('Input must be a non-empty string');
  }

  // Extract due date using chrono-node
  const parsedDate = chrono.parse(input);
  let dueDate = null;
  let remainingText = input;

  if (parsedDate.length > 0) {
    dueDate = parsedDate[0].start.date();
    // Remove the date part from the input
    remainingText = input.replace(parsedDate[0].text, '');
  }

  // Extract priority (P1, P2, P3, P4)
  const priorityRegex = /\b(P[1-4])\b/i;
  const priorityMatch = input.match(priorityRegex);
  let priority = 'P3'; // Default priority
  
  if (priorityMatch) {
    priority = priorityMatch[0].toUpperCase();
    // Remove the priority part from the remaining text
    remainingText = remainingText.replace(priorityRegex, '');
  }

  // Extract assignee (looking for proper names or "to [Name]" pattern)
  const assigneeRegex = /\b(?:to|for|by)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b|\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/;
  const assigneeMatch = remainingText.match(assigneeRegex);
  let assignee = '';
  
  if (assigneeMatch) {
    assignee = assigneeMatch[1] || assigneeMatch[2];
    // Remove the assignee part from the remaining text
    remainingText = remainingText.replace(assigneeMatch[0], '');
  }

  // Clean up remaining text to get the title
  let title = remainingText.trim();
  title = title.replace(/\s+/g, ' '); // Replace multiple spaces with a single space
  title = title.replace(/^[\s,.;:]+|[\s,.;:]+$/g, ''); // Remove leading/trailing punctuation

  return {
    title,
    assignee,
    dueDate,
    priority
  };
};

module.exports = { parseTaskInput };