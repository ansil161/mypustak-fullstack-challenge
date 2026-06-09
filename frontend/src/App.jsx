import { useEffect, useState } from "react";



function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch('https://mypustak-fullstack-challenge-production.up.railway.app"/posts');

      if (!response.ok) {
        throw new Error("Failed fetch posts");
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be  3 characters";
    }

    if (!body.trim()) {
      newErrors.body = "Body is required";
    } else if (body.trim().length < 10) {
      newErrors.body = "Body must 10 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const createPost = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch('https://mypustak-fullstack-challenge-production.up.railway.app"/posts', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed  create post");
      }

      setTitle("");
      setBody("");
      setErrors({});

      await fetchPosts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deletePost = async (id) => {
    try {
      setError("");

      const response = await fetch(`https://mypustak-fullstack-challenge-production.up.railway.app"/posts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed  delete");
      }

      await fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Post Management App
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <form onSubmit={createPost}>
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="w-full border rounded p-3"
              />

              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Body
              </label>

              <textarea
                rows="4"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter post content"
                className="w-full border rounded p-3"
              />

              {errors.body && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.body}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Post"}
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center text-lg">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center bg-white p-6 rounded shadow">
            No posts available
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-5 rounded-lg shadow"
              >
                <h2 className="text-xl font-bold">
                  {post.title}
                </h2>

                <p className="text-gray-700 mt-2">
                  {post.body}
                </p>

                <button
                  onClick={() => deletePost(post.id)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
