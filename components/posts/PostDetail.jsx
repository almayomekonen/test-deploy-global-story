import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import api from "../../config/axios";
import PostDetailView from "./PostDetailView";
import toast from "../../utils/toast";
import { getPostImageUrl } from "../../utils/constants";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const response = await api.get(`/posts/${id}`);

        if (response.data.success) {
          const postData = response.data.data;
          if (postData.images && Array.isArray(postData.images)) {
            postData.images = postData.images.map((img) => {
              if (typeof img === "string") {
                return img.startsWith("http") ? img : getPostImageUrl(img);
              } else if (typeof img === "object" && img.original) {
                return img.original;
              }
              return "/placeholder-image.png";
            });
          }

          setPost(postData);

          if (currentUser) {
            setLiked(
              postData.likes.some((like) => like.user === currentUser._id)
            );
          }
        }
      } catch (error) {
        console.error("Error fetching post: ", error);
        setError(
          "Failed to load post. It may have been removed or doesn't exist."
        );

        toast.error("Couldn't load the post", {
          icon: "⚠️",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [currentUser, id]);

  async function handleLike() {
    if (!currentUser) {
      toast.info("Login required to like posts", {
        autoClose: 1500,
        icon: "🔒",
      });
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.put(`/posts/${post._id}/like`, {}, config);

      const wasLiked = liked;

      setLiked(!liked);

      setPost({
        ...post,
        likes: response.data.data,
      });

      if (wasLiked) {
        toast.like.removed(post.title);
      } else {
        toast.like.added(post.title);
      }
    } catch (error) {
      console.error("Error liking post: ", error);
      toast.error("Network error", { icon: "📶" });
    }
  }

  async function handleCommentSubmit(event) {
    event.preventDefault();

    if (!currentUser) {
      toast.info("Login required to comment", {
        autoClose: 1500,
        icon: "🔒",
      });
      navigate("/login");
      return;
    }

    if (!comment.trim()) {
      toast.warning("Comment can't be empty");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.post(
        `/posts/${post._id}/comments`,
        { text: comment },
        config
      );

      setPost({
        ...post,
        comments: response.data.data,
      });

      setComment("");

      toast.comment.added(post.title);
    } catch (error) {
      console.error("Error adding comment: ", error);
      toast.comment.error();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) {
      toast.info("Delete canceled");
      return;
    }

    try {
      toast.warning("Deleting post...", {
        autoClose: 2000,
        icon: "⏳",
      });

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await api.delete(`/posts/${post._id}`, config);

      toast.success("Post deleted successfully", {
        autoClose: 1500,
        icon: "✅",
      });

      navigate("/posts");
    } catch (error) {
      console.error("Error deleting post: ", error);
      toast.error("Failed to delete post");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCommentDelete(commentId) {
    if (!currentUser) {
      toast.info("Login required", { icon: "🔒" });
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmDelete) {
      toast.info("Delete canceled");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.delete(
        `/posts/${post._id}/comments/${commentId}`,
        config
      );

      setPost({
        ...post,
        comments: response.data.data,
      });

      toast.comment.deleted();
    } catch (error) {
      console.error("Error deleting comment: ", error);
      toast.comment.error();
    } finally {
      setSubmitting(false);
    }
  }

  function handleImageChange(index) {
    setCurrentImage(index);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return "Invalid date";
    }
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "pm" : "am";
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    const ordinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    return `${ordinal(
      day
    )} of ${month}, ${year} at ${hour12}:${minutes} ${period}`;
  }

  return (
    <PostDetailView
      post={post}
      loading={loading}
      error={error}
      comment={comment}
      setComment={setComment}
      submitting={submitting}
      currentImage={currentImage}
      liked={liked}
      currentUser={currentUser}
      formatDate={formatDate}
      handleLike={handleLike}
      handleCommentSubmit={handleCommentSubmit}
      handleDelete={handleDelete}
      handleImageChange={handleImageChange}
      handleCommentDelete={handleCommentDelete}
    />
  );
}
