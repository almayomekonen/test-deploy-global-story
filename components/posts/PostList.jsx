import { useEffect } from "react";
import PostCard from "./PostCard";
import usePostsStore from "../../store/usePostsStore";

export default function PostList({ category, userId }) {
  const { posts, fetchPosts } = usePostsStore();

  useEffect(() => {
    const fetch = async () => {
      let url = "/posts";
      if (category) url = `/posts/category/${category}`;
      else if (userId) url = `/posts/user/${userId}`;
      await fetchPosts(url);
    };
    fetch();
  }, [category, userId, fetchPosts]);

  const filteredPosts = posts.filter((post) => {
    if (category) return post.category === category;
    if (userId) return post.user?._id === userId || post.user === userId;
    return true;
  });

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">No stories to display.</p>
        <a
          href="/create-post"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium"
        >
          Share Your Story
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPosts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
