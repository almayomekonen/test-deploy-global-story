import { create } from "zustand";
import api from "../config/axios";

const usePostsStore = create((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async (url = "/posts") => {
    try {
      set({ loading: true, error: null });
      const res = await api.get(url);
      if (res.data.success) {
        const newPosts = res.data.data;
        set((state) => {
          const merged = [...state.posts];
          newPosts.forEach((post) => {
            const index = merged.findIndex((p) => p._id === post._id);
            if (index >= 0) {
              merged[index] = { ...merged[index], ...post };
            } else {
              merged.push(post);
            }
          });
          return { posts: merged, loading: false };
        });
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      set({
        error: err.response?.data?.message || "Failed to fetch posts",
        loading: false,
      });
    }
  },

  getPostById: (postId) => {
    return get().posts.find((post) => post._id === postId);
  },

  toggleLike: async (postId, token) => {
    try {
      if (!token) return;
      const currentUser = JSON.parse(localStorage.getItem("user")) || {};

      set((state) => {
        const posts = state.posts.map((post) => {
          if (post._id !== postId) return post;
          const postCopy = { ...post };
          const userLiked = postCopy.likes?.some(
            (like) =>
              (typeof like.user === "string" &&
                like.user === currentUser._id) ||
              (like.user && like.user._id === currentUser._id)
          );

          if (userLiked) {
            postCopy.likes = postCopy.likes.filter(
              (like) =>
                like.user !== currentUser._id &&
                (typeof like.user !== "object" ||
                  like.user._id !== currentUser._id)
            );
          } else {
            postCopy.likes = [
              ...(postCopy.likes || []),
              {
                user: currentUser._id,
                name: currentUser.name,
                date: new Date().toISOString(),
              },
            ];
          }

          return postCopy;
        });
        return { posts };
      });

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const res = await api.put(`/posts/${postId}/like`, {}, config);
      const updatedLikes = res.data.data;

      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId ? { ...post, likes: updatedLikes } : post
        ),
      }));

      return true;
    } catch (err) {
      console.error("Like operation failed:", err);
      return false;
    }
  },

  addComment: async (postId, text, token) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const res = await api.post(`/posts/${postId}/comments`, { text }, config);
      const updatedComments = res.data.data;

      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId ? { ...post, comments: updatedComments } : post
        ),
      }));
    } catch (err) {
      console.error("Comment failed:", err);
    }
  },

  deleteComment: async (postId, commentId, token) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const res = await api.delete(
        `/posts/${postId}/comments/${commentId}`,
        config
      );
      const updatedComments = res.data.data;

      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId ? { ...post, comments: updatedComments } : post
        ),
      }));
    } catch (err) {
      console.error("Delete comment failed:", err);
    }
  },
}));

export default usePostsStore;
