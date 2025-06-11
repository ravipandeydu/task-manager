const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const aiTaskController = require('../controllers/aiTaskController');

// Standard task routes
router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// AI-powered task routes
router.post('/ai', aiTaskController.createTaskWithAI);

module.exports = router;