import { useState, useEffect } from 'react';
import UserForm from './UserForm';
import UserCard from './UserCard';

const loadInitialUsers = () => {
  try {
    const saved = localStorage.getItem('users');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure parsed data is a valid array before trusting it
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to parse users from localStorage:", error);
  }
  return [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Admin' }
  ];
};

function App() {
  const [users, setUsers] = useState(loadInitialUsers);

  useEffect(() => {
    document.title = `Users: ${users.length}`;
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error("Failed to save users to localStorage:", error);
    }
  }, [users]);

  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => [newUser, ...prevUsers]);
  };

  const handleRemoveUser = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  return (
    <div className="app-container" style={{ padding: "20px" }}>
      <h1>My Card App</h1>
      <UserForm onAddUser={handleAddUser} />
      
      <h2>User List</h2>
      <div className="user-list">
        {users.length > 0 ? (
          users.map((user) => (
            <UserCard key={user.id} user={user} onRemove={handleRemoveUser} />
          ))
        ) : (
          <p style={{ color: "#666", fontStyle: "italic" }}>No users found. Add one above!</p>
        )}
      </div>
    </div>
  );
}

export default App;