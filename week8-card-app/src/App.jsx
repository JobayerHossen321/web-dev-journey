import { Card } from "./Card";
import { UserCard } from "./UserCard";

const usersData = [
  { id: 101, name: "Alice Johnson", email: "alice@example.com", role: "admin" },
  { id: 102, name: "Bob Smith", email: "bob@example.com", role: "editor" },
  { id: 103, name: "Charlie Brown", email: "charlie@example.com" } // role omitted
];

export default function App() {
  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h2>User Directory</h2>

      {usersData.map((user) => (
        <Card key={user.id}>
          <UserCard name={user.name} email={user.email} role={user.role} />
        </Card>
      ))}
    </div>
  );
}