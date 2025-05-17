import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import api from "../../config/axios";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import PostCard from "./PostCard";

export default function UserPosts() {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserPosts() {
      if (!currentUser) return;
      try {
        setLoading(true);
        const response = await api.get(`/posts/user/${currentUser._id}`);

        if (response.data.success) {
          setPosts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching posts: ", error);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserPosts();
  }, [currentUser]);

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

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Your Stories</h2>
        <Link
          to="/create-post"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaPlus className="mr-1" />
          <span>New Story</span>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="mb-4">You haven't shared any stories yet.</p>

          <Link
            to="/create-post"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Share Your First Story
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
