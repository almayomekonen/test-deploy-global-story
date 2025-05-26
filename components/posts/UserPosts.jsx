// components/UserPosts.jsx – Zustand version
import { useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import PostCard from "./PostCard";
import usePostsStore from "../../store/usePostsStore";

export default function UserPosts() {
  const { currentUser } = useContext(AuthContext);
  const { posts, fetchPosts } = usePostsStore();

  useEffect(() => {
    if (currentUser?._id) {
      fetchPosts(`/posts/user/${currentUser._id}`);
    }
  }, [currentUser, fetchPosts]);

  const userPosts = posts.filter(
    (post) =>
      post.user?._id === currentUser?._id || post.user === currentUser?._id
  );

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

      {userPosts.length === 0 ? (
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
          {userPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
