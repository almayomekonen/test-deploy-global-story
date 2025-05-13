import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostCard from "./PostCard";
import api from "../../config/axios";

export default function PostList({ category, userId }) {
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPosts = async (retryCount = 0) => {
      try {
        if (!isMounted) return;

        setLoading(true);
        setError(null);

        const url = category
          ? `/posts/category/${category}`
          : userId
          ? `/posts/user/${userId}`
          : "/posts";

        const response = await api.get(url, { signal });

        if (!isMounted) return;

        if (response.data && response.data.success) {
          setPosts(response.data.data || []);
        } else {
          throw new Error("Failed to load posts. Please try again later.");
        }
      } catch (err) {
        if (!isMounted) return;

        if (err.name === "AbortError") {
          console.log("Request was aborted");
        } else if (
          retryCount < 2 &&
          (err.message.includes("network") || err.code === "ECONNABORTED")
        ) {
          console.log(`Retrying fetch (${retryCount + 1}/2)...`);
          setTimeout(() => fetchPosts(retryCount + 1), 1000);
          return;
        } else {
          console.error("Error fetching posts:", err);
          setError("Failed to load posts. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [category, userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">No stories to display.</p>
        <Link
          to="/create-post"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium"
        >
          Share Your Story
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
