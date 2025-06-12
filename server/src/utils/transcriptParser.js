const chrono = require("chrono-node");
const { parseTaskInput } = require("./nlpParser");

/**
 * Parse meeting transcript to extract multiple tasks
 * @param {string} transcript - Meeting transcript text
 * @returns {Array<Object>} - Array of extracted task objects
 */
const parseTranscript = (transcript) => {
  if (!transcript || typeof transcript !== "string") {
    throw new Error("Transcript must be a non-empty string");
  }

  // Split transcript into sentences
  // This is a simple split by period, exclamation mark, or question mark
  // A more sophisticated NLP approach could be used here
  const sentences = transcript
    .split(/[.!?]\s+/)
    .filter(sentence => sentence.trim().length > 0);

  // Parse each sentence as a potential task
  const tasks = [];
  const failedSentences = [];

  sentences.forEach(sentence => {
    try {
      // Use the existing parseTaskInput function to extract task details
      const parsedTask = parseTaskInput(sentence);
      
      // Only add if we have at least a title and assignee
      if (parsedTask.title && parsedTask.assignee) {
        tasks.push(parsedTask);
      } else {
        failedSentences.push(sentence);
      }
    } catch (error) {
      failedSentences.push(sentence);
    }
  });

  return {
    tasks,
    failedSentences,
    totalSentences: sentences.length,
    successfulParses: tasks.length
  };
};

module.exports = { parseTranscript };