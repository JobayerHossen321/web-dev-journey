const express = require('express');
const app = express();

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Initial dataset
let users = [
  { id: 1, name: 'Ahmed', email: 'ahmed@oldemail.com' },
  { id: 2, name: 'Fatima', email: 'fatima@example.com' }
];

// 1. GET /api/users - Fetch all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// 2. PUT /api/users/:id - Update user details by ID
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;

  // Find the user index in the array
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Update fields if provided, otherwise keep existing values
  users[userIndex] = {
    ...users[userIndex],
    name: name !== undefined ? name : users[userIndex].name,
    email: email !== undefined ? email : users[userIndex].email
  };

  res.status(200).json({
    message: 'User updated successfully',
    user: users[userIndex]
  });
});

// 3. DELETE /api/users/:id - Delete user by ID
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const initialLength = users.length;

  // Filter out the user with matching id
  users = users.filter(u => u.id !== userId);

  if (users.length === initialLength) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({ message: `User with id ${userId} deleted successfully` });
});

app.listen(3000, () => console.log('Server listening on port 3000'));