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

  let remainingText = input;
  
  // Extract priority (P1, P2, P3, P4)
  const priorityRegex = /\b(P[1-4])\b/i;
  const priorityMatch = input.match(priorityRegex);
  let priority = 'P3'; // Default priority
  
  if (priorityMatch) {
    priority = priorityMatch[0].toUpperCase();
    // Remove the priority part from the remaining text
    remainingText = remainingText.replace(priorityRegex, '');
  }

  // Extract due date using chrono-node
  const parsedDate = chrono.parse(remainingText);
  let dueDate = null;
  let formattedDueDate = null;

  if (parsedDate.length > 0) {
    dueDate = parsedDate[0].start.date();
    
    // Format the date for display
    const hours = dueDate.getHours();
    const minutes = dueDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const formattedTime = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    
    const month = dueDate.toLocaleString('default', { month: 'long' });
    const day = dueDate.getDate();
    formattedDueDate = `${formattedTime}, ${day} ${month}`;
    
    // Remove the date part from the input
    remainingText = remainingText.replace(parsedDate[0].text, '');
  }

  // Extract assignee (looking for proper names - capitalized words)
  // Improved regex to better identify names like "Aman" in the middle of text
  const assigneeRegex = /\b(?:to|for|by)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/;
  const assigneeMatch = remainingText.match(assigneeRegex);
  let assignee = '';
  
  if (assigneeMatch) {
    assignee = assigneeMatch[1] || assigneeMatch[0].replace(/^(?:to|for|by)\s+/, '');
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
    formattedDueDate,
    priority
  };
};

module.exports = { parseTaskInput };