import { getProfileImageUrl, getPostImageUrl } from "../../utils/constants";
import { useState } from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "../common/OptimizedImage";
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

  const displayedComments = showAllComments
    ? post.comments
    : post.comments?.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <OptimizedImage
              src={getProfileImageUrl(post.user.profileImage)}
              alt={post.user.name}
              className="w-12 h-12 rounded-full mr-4"
              width={48}
              height={48}
              loading="eager"
              objectFit="cover"
            />
            <div>
              <h3 className="text-lg font-semibold">{post.user.name}</h3>
              <p className="text-gray-500 text-sm">
                {post.user.country ? post.user.country : "Global Citizen"}
              </p>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-500 mb-4">{formatDate(post.createdAt)}</p>

          {post.images && post.images.length > 0 && (
            <div className="relative mb-6">
              <OptimizedImage
                src={getPostImageUrl(post.images[currentImage])}
                alt={post.title}
                className="w-full max-h-96 bg-gray-100"
                loading="eager"
                objectFit="contain"
                width={800}
                height={400}
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
                        aria-label={`View image ${index + 1}`}
                      ></button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="prose max-w-none mb-6 whitespace-pre-line">
            {post.content}
          </div>

          <div className="flex items-center justify-between border-t border-b border-gray-200 py-3 mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className="flex items-center text-gray-500 hover:text-blue-600"
                aria-label={liked ? "Unlike post" : "Like post"}
              >
                {liked ? (
                  <FaHeart className="text-red-500 mr-2" />
                ) : (
                  <FaRegHeart className="mr-2" />
                )}
                <span>{post.likes?.length || 0} likes</span>
              </button>

              <div className="flex items-center text-gray-500">
                <FaRegComment className="mr-2" />
                <span>{post.comments?.length || 0} comments</span>
              </div>
            </div>

            {currentUser && currentUser._id === post.user._id && (
              <div className="flex space-x-2">
                <Link
                  to={`/posts/${post._id}/edit`}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  <FaEdit className="mr-1" /> Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center text-gray-500 hover:text-red-600"
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>

            {currentUser ? (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex items-start space-x-4">
                  <OptimizedImage
                    src={getProfileImageUrl(currentUser.profileImage)}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full"
                    width={40}
                    height={40}
                    loading="lazy"
                    objectFit="cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      required
                    ></textarea>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Comment"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <p>
                  <Link
                    to="/login"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Log in
                  </Link>{" "}
                  to leave a comment.
                </p>
              </div>
            )}

            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-6">
                {displayedComments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg"
                  >
                    <OptimizedImage
                      src={getProfileImageUrl(comment.profileImage)}
                      alt={comment.name}
                      className="w-10 h-10 rounded-full"
                      width={40}
                      height={40}
                      loading="lazy"
                      objectFit="cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{comment.name}</h4>
                          <p className="text-gray-500 text-sm">
                            {formatDate(comment.date)}
                          </p>
                        </div>
                        {currentUser && currentUser._id === comment.user && (
                          <button
                            onClick={() => handleCommentDelete(comment._id)}
                            className="text-gray-500 hover:text-red-600"
                            aria-label="Delete comment"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                      <p className="mt-2">{comment.text}</p>
                    </div>
                  </div>
                ))}

                {post.comments.length > 3 && (
                  <button
                    onClick={() => setShowAllComments(!showAllComments)}
                    className="flex items-center text-blue-600 hover:text-blue-800 mx-auto"
                  >
                    {showAllComments ? (
                      "Show less comments"
                    ) : (
                      <>
                        Show all {post.comments.length} comments{" "}
                        <FaChevronDown className="ml-1" />
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
