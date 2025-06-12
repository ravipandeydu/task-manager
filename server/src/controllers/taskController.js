const Task = require("../models/Task");
const { parseTaskInput } = require("../utils/nlpParser");

/**
 * Create a new task from natural language input
 */
exports.createTask = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ message: "Task input is required" });
    }

    // Parse the natural language input
    const parsedTask = parseTaskInput(input);

    // Validate required fields
    if (!parsedTask.title) {
      return res
        .status(400)
        .json({ message: "Could not extract a task title" });
    }

    if (!parsedTask.dueDate) {
      return res.status(400).json({ message: "Could not extract a due date" });
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
    res.status(201).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
};

/**
 * Create a new task from manual input (no natural language parsing)
 */
exports.createManualTask = async (req, res) => {
  try {
    const { title, assignee, dueDate, priority } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    if (!dueDate) {
      return res.status(400).json({ message: "Due date is required" });
    }

    // Format the date for display
    const dueDateObj = new Date(dueDate);
    const hours = dueDateObj.getHours();
    const minutes = dueDateObj.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    const formattedTime = `${hour12}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;

    const month = dueDateObj.toLocaleString("default", { month: "long" });
    const day = dueDateObj.getDate();
    const formattedDueDate = `${formattedTime}, ${day} ${month}`;

    // Create a new task
    const task = new Task({
      title,
      assignee: assignee || "",
      dueDate: dueDateObj,
      formattedDueDate,
      priority: priority || "P3",
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
};

/**
 * Get all tasks with optional filtering
 */
exports.getTasks = async (req, res) => {
  try {
    const { assignee, priority, sortBy, search } = req.query;

    // Build query
    const query = {};
    if (assignee) query.assignee = assignee;
    if (priority) query.priority = priority;

    // Add search functionality
    if (search) {
      query.title = { $regex: search, $options: "i" }; // Case-insensitive search in title
    }

    // Build sort options
    let sort = {};
    if (sortBy === "dueDate") sort.dueDate = 1;
    else if (sortBy === "priority") {
      // Custom sort for priority (P1 > P2 > P3 > P4)
      sort = { priority: 1 };
    } else {
      // Default sort by creation date
      sort = { createdAt: -1 };
    }

    const tasks = await Task.find(query).sort(sort);
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

/**
 * Get a single task by ID
 */
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching task", error: error.message });
  }
};

/**
 * Update a task
 */
exports.updateTask = async (req, res) => {
  try {
    const { title, assignee, dueDate, priority } = req.body;

    // Find the task
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update fields if provided
    if (title) task.title = title;
    if (assignee !== undefined) task.assignee = assignee;
    if (dueDate) {
      task.dueDate = dueDate;

      // Format the date for display
      const hours = new Date(dueDate).getHours();
      const minutes = new Date(dueDate).getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const hour12 = hours % 12 || 12;
      const formattedTime = `${hour12}:${minutes
        .toString()
        .padStart(2, "0")} ${ampm}`;

      const month = new Date(dueDate).toLocaleString("default", {
        month: "long",
      });
      const day = new Date(dueDate).getDate();
      task.formattedDueDate = `${formattedTime}, ${day} ${month}`;
    }
    if (priority) task.priority = priority;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
};

/**
 * Delete a task
 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
};
