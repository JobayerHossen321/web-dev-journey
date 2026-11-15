import { useState, useEffect } from 'react';
import UserForm from './UserForm';
import UserCard from './UserCard';
import PitfallLab from './PitfallLab';

export default function App() {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load users from localStorage", e);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const addUser = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const removeUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>My Card App</h1>
      
      <UserForm onAddUser={addUser} />

      <div className="user-list" style={{ marginTop: '30px' }}>
        <h2>User List</h2>
        {users.length === 0 ? (
          <p>No users added yet.</p>
        ) : (
          users.map((user) => (
            <UserCard key={user.id} user={user} onRemove={removeUser} />
          ))
        )}
      </div>

      {/* Pitfall Lab rendered safely below the user list */}
      <PitfallLab />
    </div>
  );
}