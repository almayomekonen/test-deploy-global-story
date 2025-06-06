// components/PostCard.jsx – reactive Zustand version
import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaArrowRight,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import AuthContext from "../../context/AuthContext";
import usePostsStore from "../../store/usePostsStore";
import { getProfileImageUrl, getPostImageUrl } from "../../utils/constants";
import toast from "../../utils/toast";

export default function PostCard({ postId }) {
  const { currentUser } = useContext(AuthContext);
  const post = usePostsStore((state) =>
    state.posts.find((p) => p._id === postId)
  );
  const toggleLike = usePostsStore((state) => state.toggleLike);

  if (!post) return null;

  const hasLiked =
    Array.isArray(post.likes) && currentUser?._id
      ? post.likes.some((like) =>
          typeof like.user === "string"
            ? like.user === currentUser._id
            : like.user?._id === currentUser._id
        )
      : false;

  const handleLike = () => {
    if (!currentUser) {
      toast.info("Please log in to like posts", { icon: "👤" });
      return;
    }
    const token = localStorage.getItem("token");
    toggleLike(post._id, token);
  };

  const formatDate = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "some time ago";
    }
  };

  const imageUrl = (() => {
    if (!post.images || post.images.length === 0) return null;
    const firstImage = post.images[0];
    if (typeof firstImage === "string") {
      return firstImage.startsWith("http")
        ? firstImage
        : getPostImageUrl(firstImage, "medium");
    }
    if (typeof firstImage === "object") {
      return (
        firstImage.medium || firstImage.original || "/placeholder-image.png"
      );
    }
    return "/placeholder-image.png";
  })();

  const userProfile = post.user || {};

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="flex items-center p-4">
        <img
          src={getProfileImageUrl(userProfile.profileImage)}
          alt={userProfile.name || "User"}
          className="w-10 h-10 rounded-full mr-3 object-cover"
          loading="lazy"
        />
        <div>
          <p className="text-sm font-medium text-gray-500">
            {userProfile.name || "Unknown User"}
          </p>
          <p className="text-xs text-gray-500">{userProfile.country || ""}</p>
        </div>
      </div>

      {imageUrl ? (
        <Link to={`/posts/${post._id}`}>
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-48 object-cover"
            loading="lazy"
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
            {post.category || "Uncategorized"}
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
              {hasLiked ? (
                <FaHeart className="text-red-500 mr-1 cursor-pointer" />
              ) : (
                <FaRegHeart className="cursor-pointer mr-1" />
              )}
              <span>{post.likes?.length || 0}</span>
            </button>

            <Link
              to={`/posts/${post._id}`}
              className="flex items-center text-gray-500 hover:text-blue-600"
            >
              <FaRegComment className="mr-1" />
              <span>
                {Array.isArray(post.comments) ? post.comments.length : 0}
              </span>
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
