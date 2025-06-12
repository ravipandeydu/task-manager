const Task = require('../models/Task');
const { parseTaskWithAI } = require('../utils/openaiParser');

/**
 * Create a new task using OpenAI for natural language processing
 */
exports.createTaskWithAI = async (req, res) => {
  try {
    const { input } = req.body;
    
    if (!input) {
      return res.status(400).json({ message: 'Task input is required' });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return res.status(500).json({ 
        message: 'OpenAI API key not configured', 
        error: 'Please set your OPENAI_API_KEY in the .env file'
      });
    }

    // Parse the natural language input using OpenAI
    const parsedTask = await parseTaskWithAI(input);
    
    // Validate required fields
    if (!parsedTask.title) {
      return res.status(400).json({ message: 'Could not extract a task title' });
    }
    
    if (!parsedTask.dueDate) {
      return res.status(400).json({ message: 'Could not extract a due date' });
    }

    // Create a new task
    const task = new Task({
      title: parsedTask.title,
      assignee: parsedTask.assignee || '',
      dueDate: parsedTask.dueDate,
      formattedDueDate: parsedTask.formattedDueDate,
      priority: parsedTask.priority
    });

    await task.save();
    res.status(201).json({
      task,
      aiParsed: true,
      originalInput: input
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating task with AI', 
      error: error.message 
    });
  }
};