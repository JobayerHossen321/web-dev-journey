export function UserCard({ name, email, role = "member" }) {
  return (
    <div>
      <h3 style={{ margin: "0 0 8px 0" }}>{name}</h3>
      <p style={{ margin: "4px 0", color: "#555" }}>{email}</p>
      <span
        style={{
          display: "inline-block",
          marginTop: "8px",
          padding: "2px 8px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          fontSize: "0.85rem",
          fontWeight: "bold"
        }}
      >
        {role}
      </span>
    </div>
  );
}