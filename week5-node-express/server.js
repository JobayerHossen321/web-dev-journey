const express = require('express');
const app = express();
const db = require('./database.js');

// Middleware to parse incoming JSON bodies in requests
app.use(express.json());

// ==========================================
// USER ROUTES
// ==========================================

// GET /api/users - Fetch all users
app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

// POST /api/users - Create a new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;

  // Validation: both name and email are required
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  const result = stmt.run(name, email);

  const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newUser);
});

// PUT /api/users/:id - Update an existing user
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;

  // Check if user exists
  const existingUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Fallback to existing values if fields are not provided in request body
  const updatedName = name !== undefined ? name : existingUser.name;
  const updatedEmail = email !== undefined ? email : existingUser.email;

  const stmt = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
  stmt.run(updatedName, updatedEmail, userId);

  const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  res.status(200).json({
    message: 'User updated successfully',
    user: updatedUser
  });
});

// DELETE /api/users/:id - Delete a user by ID
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const result = stmt.run(userId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({ message: `User with id ${userId} deleted successfully` });
});

// ==========================================
// POST ROUTES
// ==========================================

// POST /api/users/:userId/posts - Create a new post for a specific user
app.post('/api/users/:userId/posts', (req, res) => {
  // Convert URL parameter to a number
  const userId = Number(req.params.userId);

  // Extract title and optional content from request body
  const { title, content } = req.body;

  // 1. Validation: ensure 'title' is present and not empty (content is optional)
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  // 2. Query database to confirm user exists before inserting the post
  const user = db.prepare('SELECT * FROM users WHERE id=?').get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // 3. Insert new post into the database
  const stmt = db.prepare('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)');
  const result = stmt.run(title, content, userId);

  // 4. Retrieve and return the newly created post
  const newPost = db.prepare('SELECT * FROM posts WHERE id=?').get(result.lastInsertRowid);
  res.status(201).json(newPost);
});

// GET /api/users/:userId/posts - Get all posts belonging to a specific user
app.get('/api/users/:userId/posts', (req, res) => {
  const userId = Number(req.params.userId);
  const posts = db.prepare('SELECT * FROM posts WHERE user_id = ?').all(userId);
  res.json(posts);
});

// Start the Express server
app.listen(3000, () => {
  console.log("Express server running on port 3000");
});