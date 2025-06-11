const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Parse task input using OpenAI's natural language processing capabilities
 * @param {string} input - Natural language input string
 * @returns {Promise<Object>} - Extracted task details
 */
const parseTaskWithAI = async (input) => {
  if (!input || typeof input !== 'string') {
    throw new Error('Input must be a non-empty string');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a task parsing assistant. Extract the following information from the user's input:
          - title: The main task description
          - assignee: The person assigned to the task (if mentioned)
          - dueDate: The due date and time (in ISO format)
          - priority: Priority level (P1, P2, P3, or P4, with P3 as default)
          
          Respond with ONLY a valid JSON object containing these fields. If a field is not present, set it to null or empty string.
          `
        },
        {
          role: "user",
          content: input
        }
      ],
      temperature: 0.1,
      max_tokens: 256,
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const result = JSON.parse(response.choices[0].message.content);
    
    // Convert ISO date string to Date object if present
    if (result.dueDate) {
      result.dueDate = new Date(result.dueDate);
    }
    
    // Set default priority if not provided
    if (!result.priority) {
      result.priority = 'P3';
    }
    
    return result;
  } catch (error) {
    console.error('Error parsing task with OpenAI:', error);
    throw new Error(`Failed to parse task with AI: ${error.message}`);
  }
};

module.exports = { parseTaskWithAI };