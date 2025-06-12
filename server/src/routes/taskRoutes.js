const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const aiTaskController = require("../controllers/aiTaskController");
const transcriptController = require("../controllers/transcriptController");

// Standard task routes
router.post("/tasks", taskController.createTask);
router.post("/tasks/manual", taskController.createManualTask);
router.get("/tasks", taskController.getTasks);
router.get("/tasks/:id", taskController.getTaskById);
router.put("/tasks/:id", taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);

// AI-powered task routes
router.post("/tasks/ai", aiTaskController.createTaskWithAI);

// Transcript-based task routes
router.post("/tasks/bulk", transcriptController.createTasksFromTranscript);

module.exports = router;
