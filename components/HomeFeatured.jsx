import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaComment, FaFire, FaHeart } from "react-icons/fa";
import { WiStars } from "react-icons/wi";
import { BsGraphUpArrow } from "react-icons/bs";
import { getProfileImageUrl, getPostImageUrl } from "../utils/constants";
import usePostsStore from "../store/usePostsStore";

const FeaturedStories = () => {
  const [timeWindow, setTimeWindow] = useState("all");
  const [noPostsInTimeframe, setNoPostsInTimeframe] = useState(false);
  const { posts, fetchPosts } = usePostsStore();

  useEffect(() => {
    fetchPosts(`/posts/popular?time=${timeWindow}`);
  }, [timeWindow, fetchPosts]);

  useEffect(() => {
    setNoPostsInTimeframe(!posts.length && timeWindow !== "all");
  }, [posts, timeWindow]);

  const getPostBadge = (post) => {
    if (post.isStaffPick) {
      return (
        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
          Editor's Pick
        </span>
      );
    }
    if (post.engagementScore > 10 || post.displayFlag === "popular") {
      return (
        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
          Popular
        </span>
      );
    }
    if (post.engagementScore > 3 || post.displayFlag === "rising") {
      return (
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          Rising
        </span>
      );
    }
    return (
      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
        New
      </span>
    );
  };

  const getEmptyStateMessage = () => {
    if (noPostsInTimeframe) {
      switch (timeWindow) {
        case "day":
          return "No stories created today.";
        case "week":
          return "No stories created this week.";
        case "month":
          return "No stories created this month.";
        default:
          return "No stories in this timeframe.";
      }
    }
    return "No featured stories yet. Be the first to create one!";
  };

  const TimeFilterButton = ({ value, label, isFirst, isLast }) => (
    <button
      onClick={() => setTimeWindow(value)}
      className={`px-4 py-2 text-sm font-medium ${
        isFirst ? "rounded-l-lg" : isLast ? "rounded-r-lg" : ""
      } ${
        timeWindow === value
          ? "bg-blue-600 text-white"
          : "bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Featured Stories
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Our community's most engaging content
        </p>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm">
            <TimeFilterButton value="all" label="All Time" isFirst />
            <TimeFilterButton value="month" label="This Month" />
            <TimeFilterButton value="week" label="This Week" />
            <TimeFilterButton value="day" label="Today" isLast />
          </div>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post._id}
                to={`/posts/${post._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:scale-105 hover:shadow-lg block"
              >
                <div className="relative">
                  {post.images?.length ? (
                    <img
                      className="w-full h-48 object-cover"
                      src={getPostImageUrl(post.images[0])}
                      alt={post.title}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}

                  {post.engagementScore > 0 && (
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                      {post.engagementScore > 10 ? (
                        <FaFire className="text-red-600 text-lg" />
                      ) : post.engagementScore > 3 ? (
                        <BsGraphUpArrow className="text-green-600 text-lg" />
                      ) : (
                        <WiStars size={24} className="text-yellow-400" />
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                    {getPostBadge(post)}
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content}
                  </p>

                  {post.user ? (
                    <div className="flex items-center mb-4">
                      <img
                        src={getProfileImageUrl(post.user.profileImage)}
                        alt={post.user.name}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {post.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {post.user.country}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-4">
                      Author unavailable
                    </p>
                  )}

                  <div className="text-xs text-gray-500 mt-2 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FaHeart className="text-red-600" /> {post.likes.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaComment /> {post.comments.length}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">{getEmptyStateMessage()}</p>
            <div className="flex justify-center gap-4">
              {noPostsInTimeframe && (
                <button
                  onClick={() => setTimeWindow("all")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md font-medium"
                >
                  View All Stories
                </button>
              )}
              <Link
                to="/create-post"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-md font-medium"
              >
                Create New Story
              </Link>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          {posts.length > 0 && (
            <Link
              to="/posts"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md font-medium"
            >
              Explore All Stories
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStories;
