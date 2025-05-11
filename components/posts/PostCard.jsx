import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { getProfileImageUrl, getPostImageUrl } from "../../utils/constants";
import api from "../../config/axios";
import { Link } from "react-router-dom";
import toast from "../../utils/toast";
import {
  FaArrowRight,
  FaHeart,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import OptimizedImage from "../common/OptimizedImage";

export default function PostCard({ post }) {
  const { currentUser } = useContext(AuthContext);
  const [likes, setLikes] = useState(
    post.likes.some((like) => like.user === currentUser?._id)
  );
  const [likesCount, setLikesCount] = useState(post.likes.length);

  async function handleLike() {
    if (!currentUser) {
      toast.info("Please log in to like posts", {
        icon: "👤",
      });
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

      if (wasLiked) {
        toast.like.removed(post.title);
      } else {
        toast.like.added(post.title);
      }
    } catch (error) {
      console.error("Error liking post: ", error);

      toast.error("Could not update like");
    }
  }

  const formatDate = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "some time ago";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="flex items-center mb-4">
        <OptimizedImage
          src={getProfileImageUrl(post.user.profileImage)}
          alt={post.user.name}
          className="w-10 h-10 rounded-full mr-3"
          width={40}
          height={40}
          objectFit="cover"
          loading="lazy"
        />
        <div>
          <p className="text-sm font-medium text-gray-500">{post.user.name}</p>
          <p className="text-xs text-gray-500">{post.user.country}</p>
        </div>
      </div>
      {post.images && post.images.length > 0 ? (
        <Link to={`/posts/${post._id}`}>
          <OptimizedImage
            src={getPostImageUrl(post.images[0])}
            alt={post.title}
            className="w-full h-48 object-cover"
            width={400}
            height={192}
            objectFit="cover"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        </Link>
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

        <Link
          to={`/posts/${post._id}`}
          className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2"
        >
          {post.title}
        </Link>

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
