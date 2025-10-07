const express = require('express');
const router = express.Router();
// Import controller
const taskcontroller=require('../controllers/taskController');


// Get all tasks
router.get('/', taskController.getAllTasks);

// Get single task by ID
router.get('/:id', taskController.getTaskById);

// Add a new task
router.post('/', taskController.createTask);

// Update an existing task
router.put('/:id', taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
