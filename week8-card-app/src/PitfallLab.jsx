import { useState, useEffect, useRef, useMemo } from 'react';

// Static object declared at module scope so its reference never changes across renders
const STATIC_FILTERS = { type: 'admin' };

const fakeFetchProfile = (id) => {
  console.log(`[fakeFetchProfile] Called for User ${id}`);
  return new Promise((resolve) =>
    setTimeout(() => resolve({ id, name: `User ${id}` }), id === 1 ? 2000 : 500)
  );
};

export default function PitfallLab() {
  // ==========================================
  // PART 1: Stale Interval (Fixed via useRef)
  // ==========================================
  const [count1, setCount1] = useState(0);
  
  // Keep a mutable ref of the latest count so the interval reads it without restarting
  const countRef = useRef(count1);
  countRef.current = count1;

  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Count (with useRef):', countRef.current);
    }, 1000);
    
    // Always clean up intervals on unmount or re-run
    return () => clearInterval(timer);
  }, []); // Empty array is safe here because the ref tracks the latest value

  // ==========================================
  // PART 2: Object Identity (Fixed via useMemo & Stable Ref)
  // ==========================================
  const [renderTrigger, setRenderTrigger] = useState(0);

  // Fix A: useMemo ensures reference equality is preserved between renders
  const memoizedFilters = useMemo(() => ({ type: 'admin' }), []);

  useEffect(() => {
    console.log('Identity Effect fired (only runs once on mount because reference is stable).');
  }, [memoizedFilters]);

  // ==========================================
  // PART 3: Race Condition (Fixed via Stale Flag Cleanup)
  // ==========================================
  const [profileId, setProfileId] = useState(1);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    fakeFetchProfile(profileId).then((data) => {
      // Only update state if this effect instance is still the active one
      if (!ignore) {
        setProfile(data);
        setLoading(false);
      } else {
        console.log(`Discarded stale response for User ${data.id}`);
      }
    });

    // Cleanup function flips the flag when user switches profiles quickly
    return () => {
      ignore = true;
    };
  }, [profileId]);

  return (
    <div style={{ padding: '20px', border: '2px solid #4CAF50', marginTop: '20px', borderRadius: '8px' }}>
      <h2>useEffect Pitfall Lab (All Fixes Applied)</h2>

      {/* Part 1 UI */}
      <section style={{ marginBottom: '20px' }}>
        <h3>1. Stale Interval</h3>
        <p>Count: {count1}</p>
        <button onClick={() => setCount1((c) => c + 1)}>Increment Count</button>
      </section>

      {/* Part 2 UI */}
      <section style={{ marginBottom: '20px' }}>
        <h3>2. Object Identity</h3>
        <p>Render trigger count: {renderTrigger}</p>
        <button onClick={() => setRenderTrigger((r) => r + 1)}>Force Re-render</button>
      </section>

      {/* Part 3 UI */}
      <section>
        <h3>3. Race Condition</h3>
        <div>
          <button onClick={() => setProfileId(1)} style={{ marginRight: '10px' }}>
            Load User 1 (Slow - 2s)
          </button>
          <button onClick={() => setProfileId(2)}>
            Load User 2 (Fast - 0.5s)
          </button>
        </div>
        <p style={{ marginTop: '10px' }}>
          {loading ? 'Loading...' : `Current Profile: ${profile ? profile.name : 'None'}`}
        </p>
        <p>Requested: User {profileId}</p>
      </section>
    </div>
  );
}