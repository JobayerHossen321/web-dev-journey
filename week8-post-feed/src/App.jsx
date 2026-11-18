import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchPosts } from './api';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import './App.css';

const STORAGE_KEY = 'week8_post_feed_v1';

function readStoredPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export default function App() {
  // Read localStorage once on mount, and derive initial status from posts
  const [posts, setPosts] = useState(() => readStoredPosts());
  const [status, setStatus] = useState(() => (posts !== null ? 'success' : 'loading'));
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  const loadPosts = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setStatus('loading');
    setError(null);

    try {
      const seededPosts = await fetchPosts({ signal: controller.signal });
      setPosts(seededPosts);
      setStatus('success');
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Something went wrong.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (posts !== null) return;
    loadPosts();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (posts === null) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (err) {
      console.error('Failed to persist posts to localStorage:', err);
    }
  }, [posts]);

  function handleAddPost({ title, body }) {
    const newPost = {
      id: crypto.randomUUID(),
      title: title.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) => [newPost, ...(prev ?? [])]);
  }

  function handleDeletePost(id) {
    setPosts((prev) => (prev ?? []).filter((post) => post.id !== id));
  }

  function handleResetDemo() {
    localStorage.removeItem(STORAGE_KEY);
    setPosts(null);
    loadPosts();
  }

  return (
    <main className="app-container">
      <header className="app-header">
        <div>
          <h1>Mini Post Feed</h1>
          <p className="subtitle">Week 8 Capstone • Local State & Async UI</p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={handleResetDemo}
          title="Clear localStorage and re-fetch seed posts"
        >
          Reset Feed
        </button>
      </header>

      {/* Form usability is restricted unless feed status is successfully loaded */}
      <PostForm 
        onAddPost={handleAddPost} 
        disabled={status !== 'success'} 
      />

      <section className="feed-section" aria-live="polite">
        {status === 'loading' && (
          <div className="status-card">
            <div className="spinner" aria-hidden="true" />
            <p>Loading posts...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="status-card status-error" role="alert">
            <p>{error}</p>
            <button type="button" className="btn-primary" onClick={loadPosts}>
              Retry
            </button>
          </div>
        )}

        {status === 'success' && (
          <PostList posts={posts ?? []} onDeletePost={handleDeletePost} />
        )}
      </section>
    </main>
  );
}