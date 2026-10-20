import { useState } from 'react';
import UserForm from './UserForm';
import UserCard from './UserCard';

function App() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Admin' }
  ]);

  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => [newUser, ...prevUsers]);
  };

  const handleRemoveUser = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  return (
    <div className="app-container" style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>My Card App</h1>
      
      <UserForm onAddUser={handleAddUser} />

      <h2>User List</h2>
      <div className="user-list">
        {users.length === 0 ? (
          <p>No users added yet.</p>
        ) : (
          users.map((user) => (
            <UserCard key={user.id} user={user} onRemove={handleRemoveUser} />
          ))
        )}
      </div>
    </div>
  );
}

export default App;