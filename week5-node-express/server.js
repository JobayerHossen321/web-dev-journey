const express = require('express');
const app = express();
const db = require('./database.js');

app.use(express.json());

// ===== USER ROUTES =====

app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  const result = stmt.run(name, email);
  const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newUser);
});

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

app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const result = stmt.run(userId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({ message: `User with id ${userId} deleted successfully` });
});

// ===== POST ROUTES (nested under users) =====

app.post('/api/users/:userId/posts', (req, res) => {
  const userId = Number(req.params.userId);
  const { title, content } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const stmt = db.prepare('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)');
  const result = stmt.run(title, content, userId);

  const newPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newPost);
});

app.get('/api/users/:userId/posts', (req, res) => {
  const userId = Number(req.params.userId);
  const posts = db.prepare('SELECT * FROM posts WHERE user_id = ?').all(userId);
  res.json(posts);
});

app.listen(3000, () => {
  console.log("Express server running on port 3000");
});