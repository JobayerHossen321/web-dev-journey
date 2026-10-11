import { useState } from "react";
import { UserCard } from "./UserCard";

export default function App() {
  // Initial state array containing user objects
  const [users, setUsers] = useState([
    { id: 1, name: "Ana", email: "ana@example.com", role: "Developer" },
    { id: 2, name: "Ben", email: "ben@example.com", role: "Designer" },
  ]);

  // Add user handler using functional updater (prevUsers) to prevent stale state
  const handleAddUser = () => {
    const newUser = {
      id: Date.now(),
      name: "Cara",
      email: "cara@example.com",
      role: "Product Owner",
    };
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  // Remove user handler using functional updater
  const handleRemoveUser = (idToRemove) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== idToRemove));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "450px" }}>
      <h2>Week 8 Card App</h2>
      
      {/* Button to append a new user */}
      <button onClick={handleAddUser} style={{ marginBottom: "16px", padding: "8px 12px" }}>
        + Add User
      </button>

      {/* Render list of UserCards using unique user.id keys */}
      <div>
        {users.map((user) => (
          <UserCard key={user.id} user={user} onRemove={handleRemoveUser} />
        ))}
      </div>
    </div>
  );
}