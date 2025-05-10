import { useState } from "react";
import { Link } from "react-router-dom";
import { getProfileImageUrl, getPostImageUrl } from "../../utils/constants";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaTrash,
  FaEdit,
  FaChevronDown,
} from "react-icons/fa";

export default function PostDetailView({
  post,
  loading,
  error,
  comment,
  setComment,
  submitting,
  currentImage,
  liked,
  currentUser,
  formatDate,
  handleLike,
  handleCommentSubmit,
  handleDelete,
  handleImageChange,
  handleCommentDelete,
}) {
  const [showAllComments, setShowAllComments] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error || "Post not found"}</p>
        </div>

        <Link
          to="/posts"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto sm:px-0 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(post.createdAt)}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center">
            <img
              src={getProfileImageUrl(post.user.profileImage)}
              alt={post.user.name}
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />

            <div>
              <p className="font-medium text-gray-800">{post.user.name}</p>
              <p className="text-sm text-gray-600">
                {post.user.city}, {post.user.country}
              </p>
            </div>
          </div>
        </div>

        {post.images.length > 0 && (
          <div className="relative">
            <img
              src={getPostImageUrl(post.images[currentImage])}
              alt={post.title}
              className="w-full max-h-96 object-contain bg-gray-100"
            />

            {post.images.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                <div className="flex space-x-2 bg-black bg-opacity-50 rounded-full px-3 py-1">
                  {post.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`h-2 w-2 rounded-full ${
                        currentImage === index ? "bg-white" : "bg-gray-400"
                      }`}
                    ></button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="md:p-6 p-2">
          <div className="prose max-w-none mb-6">
            <p className="whitespace-pre-line">{post.content}</p>
          </div>

          <div className="mb-6">
            <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded mr-2">
              {post.language}
            </span>
          </div>

          <div className="flex justify-between items-center border-t border-b py-4 mb-6">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className="flex items-center text-gray-500 hover:text-blue-600"
              >
                {liked ? (
                  <FaHeart className="text-red-500 mr-1 cursor-pointer" />
                ) : (
                  <FaRegHeart className="cursor-pointer mr-1" />
                )}
                <span>{post.likes.length}</span>
              </button>

              <div className="flex items-center text-gray-600">
                <FaRegComment className="mr-2 cursor-pointer" />
                <span>{post.comments.length}</span>
              </div>
            </div>

            {currentUser && currentUser._id === post.user._id && (
              <div className="flex space-x-2">
                <Link
                  to={`/posts/${post._id}/edit`}
                  className="flex items-center text-gray-600 hover:text-blue-600"
                >
                  <FaEdit className="mr-1" />
                  <span>Edit</span>
                </Link>

                <button
                  onClick={handleDelete}
                  className="flex items-center text-gray-600 hover:text-red-600 cursor-pointer"
                >
                  <FaTrash className="mr-1" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Comments</h3>

            {currentUser ? (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex">
                  <img
                    src={getProfileImageUrl(comment.profileImage)}
                    alt={comment.name}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div className="flex-grow">
                    <textarea
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      placeholder="Write a comment..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-400"
                      rows="2"
                      required
                    ></textarea>

                    <button
                      type="submit"
                      disabled={submitting || !comment.trim()}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-md disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-6">
                <Link to="/login" className="text-blue-600 hover:text-blue-800">
                  Log in to comment
                </Link>
              </div>
            )}

            {renderComments(
              post.comments,
              formatDate,
              currentUser,
              handleCommentDelete,
              showAllComments,
              setShowAllComments
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderComments(
  comments,
  formatDate,
  currentUser,
  handleCommentDelete,
  showAllComments,
  setShowAllComments
) {
  if (comments.length === 0) {
    return <p className="text-gray-500">No comments yet, be the first!</p>;
  }

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const commentsToShow = showAllComments
    ? sortedComments
    : sortedComments.slice(0, 2);

  return (
    <div className="space-y-4">
      {commentsToShow.map((comment) => (
        <div key={comment._id} className="flex items-start">
          <img
            src={getProfileImageUrl(comment.profileImage)}
            alt={comment.name}
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />

          <div className="flex-grow">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between space-x-2 mb-1">
                <span className="font-semibold text-sm">{comment.name}</span>
                <span className="text-xs text-gray-500">
                  {formatDate(comment.date)}
                </span>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-700">{comment.text}</p>
                {currentUser && currentUser._id && comment.user && (
                  <button
                    onClick={() => handleCommentDelete(comment._id)}
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                    aria-label="Delete comment"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {sortedComments.length > 2 && (
        <div className="pt-2 text-center">
          <button
            onClick={() => setShowAllComments(!showAllComments)}
            className="flex cursor-pointer items-center justify-center mx-auto text-blue-600 hover:text-blue-800 focus:outline-none gap-1"
          >
            {showAllComments
              ? "Show Less"
              : `Show More Comments (${sortedComments.length - 2} more)`}
            <FaChevronDown
              className={`transform transition-transform ${
                showAllComments ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
