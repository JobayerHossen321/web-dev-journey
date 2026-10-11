import { useState } from "react";

export function UserCard({ user, onRemove }) {
  // Local state to track whether extra details are shown or hidden
  // Uses functional updater for robustness
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", margin: "8px 0", borderRadius: "8px" }}>
      <h3>{user.name}</h3>
      
      {/* Toggle button using functional state updater */}
      <button onClick={() => setShowDetails((prev) => !prev)}>
        {showDetails ? "Hide details" : "Show details"}
      </button>

      {/* Remove button */}
      <button onClick={() => onRemove(user.id)} style={{ marginLeft: "8px", color: "red" }}>
        Remove
      </button>

      {/* Conditional rendering for details */}
      {showDetails && (
        <div style={{ marginTop: "12px", background: "#f9f9f9", padding: "8px", borderRadius: "4px" }}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}
    </div>
  );
}