import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import CreatePostView from "./CreatePostView";

const CreatePost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Other",
    language: "English",
  });

  // Image handling state
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Event handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...newPreviews]);
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreview];

    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setImages(updatedImages);
    setImagePreview(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      setError("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Create form data
      const postFormData = new FormData();
      postFormData.append("title", formData.title);
      postFormData.append("content", formData.content);
      postFormData.append("category", formData.category);
      postFormData.append("language", formData.language);

      // Append images
      images.forEach((image) => {
        postFormData.append("images", image);
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.post("/posts", postFormData, config);

      if (response.data.success) {
        navigate(`/posts/${response.data.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CreatePostView
      formData={formData}
      handleChange={handleChange}
      imagePreview={imagePreview}
      handleImageChange={handleImageChange}
      removeImage={removeImage}
      handleSubmit={handleSubmit}
      loading={loading}
      error={error}
      images={images}
    />
  );
};

export default CreatePost;
