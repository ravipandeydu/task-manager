const Task = require("../models/Task");
const { parseTranscript } = require("../utils/transcriptParser");

/**
 * Create multiple tasks from a meeting transcript
 */
exports.createTasksFromTranscript = async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ message: "Transcript is required" });
    }

    // Parse the transcript to extract tasks
    const parsedResult = parseTranscript(transcript);

    // Check if any tasks were extracted
    if (parsedResult.tasks.length === 0) {
      return res.status(400).json({
        message: "No tasks could be extracted from the transcript",
        failedSentences: parsedResult.failedSentences,
        totalSentences: parsedResult.totalSentences
      });
    }

    // Create tasks in the database
    const createdTasks = [];
    for (const parsedTask of parsedResult.tasks) {
      // Validate required fields
      if (!parsedTask.title) {
        continue; // Skip tasks without a title
      }

      if (!parsedTask.dueDate) {
        continue; // Skip tasks without a due date
      }

      // Create a new task
      const task = new Task({
        title: parsedTask.title,
        assignee: parsedTask.assignee,
        dueDate: parsedTask.dueDate,
        formattedDueDate: parsedTask.formattedDueDate,
        priority: parsedTask.priority,
      });

      await task.save();
      createdTasks.push(task);
    }

    res.status(201).json({
      message: `Created ${createdTasks.length} tasks successfully`,
      tasks: createdTasks,
      parsingStats: {
        totalSentences: parsedResult.totalSentences,
        successfulParses: parsedResult.successfulParses,
        failedSentences: parsedResult.failedSentences
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating tasks", error: error.message });
  }
};