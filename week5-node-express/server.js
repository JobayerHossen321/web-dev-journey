const express = require('express');
const app = express();
const db = require('./database.js');

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// 1. GET /api/users - Fetch all users from SQLite database
app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

// 2. POST /api/users - Create a new user in SQLite database
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;

  // Prepare SQL statement with '?' placeholders to prevent SQL Injection
  const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  const result = stmt.run(name, email);

  // Fetch the newly inserted row using its auto-generated ID
  const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);

  // Return HTTP status 201 (Created) with the new user object
  res.status(201).json(newUser);
});

// 3. PUT /api/users/:id - Update user details by ID
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;

  const existingUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }

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

// 4. DELETE /api/users/:id - Delete user by ID
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const result = stmt.run(userId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({ message: `User with id ${userId} deleted successfully` });
});

app.listen(3000, () => console.log('Server listening on port 3000'));