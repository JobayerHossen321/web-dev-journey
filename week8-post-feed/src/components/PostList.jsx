import { useState } from 'react';
import PostItem from './PostItem';

export default function PostList({ posts, onDeletePost }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Derived filtered list
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredPosts = normalizedQuery
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(normalizedQuery) ||
          post.body.toLowerCase().includes(normalizedQuery)
      )
    : posts;

  return (
    <div className="post-list-wrapper">
      <div className="search-bar">
        <label htmlFor="search-posts" className="sr-only">
          Search posts
        </label>
        <input
          id="search-posts"
          type="search"
          placeholder="Search posts by title or body..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="post-count">
          Showing {filteredPosts.length} of {posts.length}
        </span>
      </div>

      {posts.length === 0 ? (
        <p className="empty-state">
          No posts yet. Create one above or click <strong>Reset Feed</strong>!
        </p>
      ) : filteredPosts.length === 0 ? (
        <p className="empty-state">
          No posts match “{searchQuery}”.
        </p>
      ) : (
        <ul className="post-list">
          {filteredPosts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onDelete={() => onDeletePost(post.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}