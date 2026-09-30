import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    // Calling setCount twice with value snapshot
    setCount(count + 1);
    setCount(count + 1);
  }

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '300px',
      margin: '20px auto',
      textAlign: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h2>Counter: {count}</h2>
      <button 
        onClick={handleClick}
        style={{
          padding: '8px 16px',
          fontSize: '16px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#007bff',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        Increment
      </button>
    </div>
  );
}