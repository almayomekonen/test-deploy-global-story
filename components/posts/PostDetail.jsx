import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import api from "../../config/axios";
import PostDetailView from "./PostDetailView";
import useToast from "../../hooks/useToast";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const toast = useToast();

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
          setPost(response.data.data);

          if (currentUser) {
            setLiked(
              response.data.data.likes.some(
                (like) => like.user === currentUser._id
              )
            );
          }
        }
      } catch (error) {
        console.error("Error fetching post: ", error);
        setError(
          "Falied to load post, It may have been removed or dosen't exist."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [currentUser, id]);

  async function handleLike() {
    if (!currentUser) {
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

      toast.like(wasLiked ? "removed" : "added", post.title);
    } catch (error) {
      console.error("Error liking post: ", error);
    }
  }

  async function handleCommentSubmit(event) {
    event.preventDefault();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!comment.trim()) {
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

      toast.comment("added", post.title);
    } catch (error) {
      console.error("Error adding comment: ", error);
      toast.error("error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await api.delete(`/posts/${post._id}`, config);
      navigate("/posts");
    } catch (error) {
      console.error("Error deleting post: ", error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCommentDelete(commentId) {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this comment?")) {
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

      toast.comment("deleted");
    } catch (error) {
      console.error("Error deleting post: ", error);
      toast.comment("error");
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
