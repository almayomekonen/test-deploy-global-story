import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { getProfileImageUrl, getPostImageUrl } from "../../utils/constants";
import api from "../../config/axios";
import { Link } from "react-router-dom";
import useToast from "../../hooks/useToast";
import {
  FaArrowRight,
  FaHeart,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";

export default function PostCard({ post }) {
  const { currentUser } = useContext(AuthContext);
  const toast = useToast();
  const [likes, setLikes] = useState(
    post.likes.some((like) => like.user === currentUser?._id)
  );
  const [likesCount, setLikesCount] = useState(post.likes.length);

  async function handleLike() {
    if (!currentUser) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await api.put(`/posts/${post._id}/like`, {}, config);

      const wasLiked = likes;
      setLikes(!likes);
      setLikesCount(likes ? likesCount - 1 : likesCount + 1);

      toast.like(wasLiked ? "removed" : "added", post.title);
    } catch (error) {
      console.error("Error liking post: ", error);
    }
  }

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="flex items-center mb-4">
        <img
          src={getProfileImageUrl(post.user.profileImage)}
          alt={post.user.name}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <p className="text-sm font-medium text-gray-500">{post.user.name}</p>
          <p className="text-xs text-gray-500">{post.user.country}</p>
        </div>
      </div>
      {post.images && post.images.length > 0 ? (
        <img
          src={getPostImageUrl(post.images[0])}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No Images</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(post.createdAt)}
          </span>
        </div>

        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          <Link to={`/posts/${post._id}`} className="hover:text-blue-600">
            {post.title}
          </Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center text-gray-500 hover:text-blue-600"
            >
              {likes ? (
                <FaHeart className="text-red-500 mr-1 cursor-pointer" />
              ) : (
                <FaRegHeart className="cursor-pointer mr-1" />
              )}
              <span>{likesCount}</span>
            </button>

            <Link
              to={`/posts/${post._id}`}
              className="flex items-center text-gray-500 hover:text-blue-600"
            >
              <FaRegComment className="mr-1" />
              <span>{post.comments.length}</span>
            </Link>
          </div>

          <Link
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
            to={`/posts/${post._id}`}
          >
            Read More <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
