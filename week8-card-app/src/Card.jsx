export function Card({ children }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
        maxWidth: "300px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
      }}
    >
      {children}
    </div>
  );
}