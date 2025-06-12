const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const aiTaskController = require('../controllers/aiTaskController');

// Standard task routes
router.post('/tasks', taskController.createTask);
router.get('/tasks', taskController.getTasks);
router.get('/tasks/:id', taskController.getTaskById);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

// AI-powered task routes
router.post('/tasks/ai', aiTaskController.createTaskWithAI);

module.exports = router;