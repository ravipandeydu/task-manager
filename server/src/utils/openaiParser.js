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
          - title: The main task description (everything before the first proper noun or time phrase)
          - assignee: The person assigned to the task (if mentioned, look for proper names or "to [Name]" pattern)
          - dueDate: The due date and time (in ISO format)
          - priority: Priority level (P1, P2, P3, or P4, with P3 as default)
          
          Respond with ONLY a valid JSON object containing these fields. If a field is not present, set it to null or empty string.
          
          Here are some examples of how to parse tasks:
          
          Example 1:
          Input: "Finish landing page Aman by 11pm 20th June"
          Output: {
            "title": "Finish landing page",
            "assignee": "Aman",
            "dueDate": "2025-06-20T23:00:00.000Z",
            "priority": "P3"
          }
          
          Example 2:
          Input: "P1 Send project proposal to Sarah by tomorrow 5pm"
          Output: {
            "title": "Send project proposal",
            "assignee": "Sarah",
            "dueDate": "2025-06-13T17:00:00.000Z",
            "priority": "P1"
          }
          
          Example 3:
          Input: "Review code changes by Friday P2"
          Output: {
            "title": "Review code changes",
            "assignee": "",
            "dueDate": "2025-06-14T23:59:59.000Z",
            "priority": "P2"
          }
          
          Example 4:
          Input: "Call John about the new design"
          Output: {
            "title": "Call about the new design",
            "assignee": "John",
            "dueDate": null,
            "priority": "P3"
          }
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
      const dueDate = new Date(result.dueDate);
      result.dueDate = dueDate;
      
      // Format the date for display
      const hours = dueDate.getHours();
      const minutes = dueDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      const formattedTime = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      
      const month = dueDate.toLocaleString('default', { month: 'long' });
      const day = dueDate.getDate();
      result.formattedDueDate = `${formattedTime}, ${day} ${month}`;
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