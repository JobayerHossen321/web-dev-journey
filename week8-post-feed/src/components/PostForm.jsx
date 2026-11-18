import { useState } from 'react';

export default function PostForm({ onAddPost, disabled }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const isTitleValid = title.trim().length >= 3;
  const isBodyValid = body.trim().length >= 5;
  const isFormValid = !disabled && isTitleValid && isBodyValid;

  function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;

    onAddPost({ title, body });
    setTitle('');
    setBody('');
  }

  return (
    <form className="post-form" onSubmit={handleSubmit} noValidate>
      <h2>Create a Post</h2>

      <div className="form-field">
        <label htmlFor="post-title">Title</label>
        <input
          id="post-title"
          type="text"
          disabled={disabled}
          placeholder={disabled ? 'Feed offline (load required)...' : 'At least 3 characters...'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="post-body">Body</label>
        <textarea
          id="post-body"
          rows={3}
          disabled={disabled}
          placeholder={disabled ? 'Cannot create posts until feed successfully loads.' : 'Write something (at least 5 characters)...'}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div className="form-footer">
        <span className="hint">
          {disabled
            ? 'Form locked: Load feed successfully to publish'
            : isFormValid
            ? 'Ready to publish'
            : 'Title (3+ chars) and body (5+ chars) required'}
        </span>
        <button type="submit" className="btn-primary" disabled={!isFormValid}>
          Publish Post
        </button>
      </div>
    </form>
  );
}