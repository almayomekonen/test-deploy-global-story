// components/PostDetail.jsx
import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import usePostsStore from "../../store/usePostsStore.js";
import PostDetailView from "./PostDetailView";
import toast from "../../utils/toast";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { posts, fetchPosts, toggleLike, addComment, deleteComment } =
    usePostsStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const loadIfNeeded = async () => {
      const exists = posts.some((p) => p._id === id);
      if (!exists) {
        setLoading(true);
        await fetchPosts();
        setLoading(false);
      }
    };
    loadIfNeeded();
  }, [id, posts, fetchPosts]);

  const post = posts.find((p) => p._id === id);

  const handleLike = () => {
    if (!currentUser) {
      toast.info("Login required to like posts", {
        autoClose: 1500,
        icon: "🔒",
      });
      navigate("/login");
      return;
    }
    toggleLike(id, token);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!currentUser) {
      toast.info("Login required to comment", { autoClose: 1500, icon: "🔒" });
      navigate("/login");
      return;
    }
    if (!comment.trim()) {
      toast.warning("Comment can't be empty");
      return;
    }
    setSubmitting(true);
    await addComment(id, comment, token);
    setComment("");
    setSubmitting(false);
  };

  const handleCommentDelete = async (commentId) => {
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
    await deleteComment(id, commentId, token);
  };

  function handleImageChange(index) {
    setCurrentImage(index);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date";
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
      liked={post?.likes?.some(
        (like) =>
          like.user === currentUser?._id || like.user?._id === currentUser?._id
      )}
      currentUser={currentUser}
      formatDate={formatDate}
      handleLike={handleLike}
      handleCommentSubmit={handleCommentSubmit}
      handleDelete={() => {}}
      handleImageChange={handleImageChange}
      handleCommentDelete={handleCommentDelete}
    />
  );
}
