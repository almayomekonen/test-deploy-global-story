// src/utils/constants.js

export const getProfileImageUrl = (profileImage) => {
  if (!profileImage) return "/default-avatar.png";

  if (profileImage && profileImage.startsWith("http")) return profileImage;

  if (window.location.hostname === "localhost") {
    return `http://localhost:4000/uploads/profiles/${profileImage}`;
  }

  return `/uploads/profiles/${profileImage}`;
};

export const getPostImageUrl = (image) => {
  if (!image) return "/placeholder-image.png";

  if (image && image.startsWith("http")) return image;

  if (window.location.hostname === "localhost") {
    return `http://localhost:4000/uploads/posts/${image}`;
  }

  return `https://https://aardvark-stories-api.onrender.com/uploads/posts/${image}`;
};
