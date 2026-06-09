import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  // Form input state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  
  // Message & validation states
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch posts from API
  const fetchPosts = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await fetch(`${API_URL}/posts`);
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const data = await response.json();
      // Reverse array to show newest posts first
      setPosts(data.reverse());
    } catch (err) {
      setApiError('Unable to connect to the backend server. Please verify it is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Inline validation
  const validate = () => {
    const errors = {};
    if (!title.trim()) {
      errors.title = 'Post title cannot be empty.';
    } else if (title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters.';
    }
    
    if (!body.trim()) {
      errors.body = 'Post body cannot be empty.';
    } else if (body.trim().length < 10) {
      errors.body = 'Body must be at least 10 characters.';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create post handler
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Could not save the post.');
      }

      const result = await response.json();
      
      // Update state and clear inputs
      setPosts((prev) => [result.post, ...prev]);
      setTitle('');
      setBody('');
      setFormErrors({});
      setSuccessMessage('Post published successfully!');
      
      // Hide success message automatically after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setApiError(err.message || 'An error occurred while publishing your post.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete post handler
  const handleDeletePost = async (id) => {
    setDeletingId(id);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Could not delete the post.');
      }

      setPosts((prev) => prev.filter((post) => post.id !== id));
      setSuccessMessage('Post deleted successfully.');
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setApiError(err.message || 'An error occurred while deleting the post.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="app-container">
      <header className="header animate-fade-in">
        <h1>MyPustak Post Center</h1>
        <p>A sleek, lightweight dashboard for micro-posting</p>
      </header>

      {/* Global Toast Alerts */}
      {apiError && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <div className="alert-message">{apiError}</div>
          <button className="alert-close" onClick={() => setApiError(null)}>×</button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          <span className="alert-icon">✓</span>
          <div className="alert-message">{successMessage}</div>
          <button className="alert-close" onClick={() => setSuccessMessage(null)}>×</button>
        </div>
      )}

      <main className="dashboard-grid">
        {/* Creator Form Column */}
        <section className="glass-card">
          <h2 className="form-title">Draft New Post</h2>
          <form onSubmit={handleCreatePost} noValidate>
            <div className="form-group">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                id="title"
                type="text"
                className="form-input"
                placeholder="What's this post about?"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (formErrors.title) {
                    setFormErrors(prev => ({ ...prev, title: null }));
                  }
                }}
                disabled={submitting}
              />
              {formErrors.title && <span className="input-error-hint">{formErrors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="body" className="form-label">Body Content</label>
              <textarea
                id="body"
                className="form-textarea"
                placeholder="Write your thoughts..."
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  if (formErrors.body) {
                    setFormErrors(prev => ({ ...prev, body: null }));
                  }
                }}
                disabled={submitting}
              />
              {formErrors.body && <span className="input-error-hint">{formErrors.body}</span>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <div className="spinner"></div>
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <span>📝</span>
                  <span>Publish Post</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Posts Feed Column */}
        <section className="glass-card">
          <div className="feed-header">
            <h2 className="feed-title">Recent Posts</h2>
            <span className="feed-count">
              {loading ? '...' : `${posts.length} post${posts.length === 1 ? '' : 's'}`}
            </span>
          </div>

          {loading ? (
            <div className="posts-feed">
              <div className="skeleton-card skeleton-shimmer">
                <div className="skeleton-title"></div>
                <div className="skeleton-text-1"></div>
                <div className="skeleton-text-2"></div>
                <div className="skeleton-btn"></div>
              </div>
              <div className="skeleton-card skeleton-shimmer">
                <div className="skeleton-title"></div>
                <div className="skeleton-text-1"></div>
                <div className="skeleton-text-2"></div>
                <div className="skeleton-btn"></div>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Posts Yet</h3>
              <p>Be the first to share your thoughts with the community!</p>
            </div>
          ) : (
            <div className="posts-feed">
              {posts.map((post) => (
                <article key={post.id} className="glass-card post-card">
                  <div className="post-content">
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                  </div>
                  <div className="post-actions">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deletingId === post.id}
                      aria-label={`Delete post ${post.title}`}
                    >
                      {deletingId === post.id ? (
                        <>
                          <div className="spinner" style={{ borderTopColor: '#ef4444' }}></div>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <span>🗑</span>
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} MyPustak Challenge. Built with FastAPI & React.</p>
      </footer>
    </div>
  )
}

export default App

