export default function PostItem({ post, onDelete }) {
  const formattedDate = new Date(post.createdAt).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <li className="post-card">
      <div className="post-card-header">
        <h3>{post.title}</h3>
        <button
          type="button"
          className="btn-delete"
          onClick={onDelete}
          aria-label={`Delete post: ${post.title}`}
        >
          Delete
        </button>
      </div>
      <p className="post-body">{post.body}</p>
      <time className="post-meta" dateTime={post.createdAt}>
        {formattedDate}
      </time>
    </li>
  );
}