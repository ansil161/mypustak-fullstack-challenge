import { useEffect, useState } from "react";

const API_URL = "";

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const response = await fetch('http://localhost:8000/posts');
    const data = await response.json();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async (e) => {
    e.preventDefault();

    await fetch('http://localhost:8000/posts', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        body,
      }),
    });

    setTitle("");
    setBody("");

    fetchPosts();
  };

  const deletePost = async (id) => {
    await fetch(`http://localhost:8000/posts/${id}`, {
      method: "DELETE",
    });

    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Post Management App
        </h1>

        <form
          onSubmit={createPost}
          className="bg-white p-6 rounded-lg shadow mb-6"
        >
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-3 rounded mb-4"
            required
          />

          <textarea
            placeholder="Enter body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border p-3 rounded mb-4"
            rows="4"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Post
          </button>
        </form>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-5 rounded-lg shadow mb-4"
            >
              <h2 className="text-xl font-semibold">
                {post.title}
              </h2>

              <p className="mt-2 text-gray-700">
                {post.body}
              </p>

              <button
                onClick={() => deletePost(post.id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;