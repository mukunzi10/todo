const db = require('../db/config');

//  Get all tasks
exports.getAllTasks = (req, res) => {
  const sql = 'SELECT * FROM tasks ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};

//  Get single task by ID
exports.getTaskById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM tasks WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching task:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(results[0]);
  });
};

//  Create new task
exports.createTask = (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const sql = 'INSERT INTO tasks (title, description) VALUES (?, ?)';
  db.query(sql, [title, description], (err, result) => {
    if (err) {
      console.error('Error creating task:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({
      id: result.insertId,
      title,
      description,
      is_completed: false,
      created_at: new Date(),
    });
  });
};

//  Update task
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, is_completed } = req.body;

  const sql =
    'UPDATE tasks SET title = ?, description = ?, is_completed = ? WHERE id = ?';
  db.query(sql, [title, description, is_completed, id], (err, result) => {
    if (err) {
      console.error('Error updating task:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task updated successfully' });
  });
};

//  Delete task
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  });
};
