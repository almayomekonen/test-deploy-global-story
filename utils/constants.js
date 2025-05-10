export const API_BASE_URL = import.meta.env.PROD
  ? "https://your-api-domain.com"
  : "http://localhost:4000";

export const getProfileImageUrl = (imageName) => {
  if (!imageName || imageName === "default-profile.jpg") {
    return "/default-profile.jpg";
  }
  return `${API_BASE_URL}/uploads/profiles/${imageName}`;
};

export const getPostImageUrl = (imageName) => {
  if (!imageName) return null;
  return `${API_BASE_URL}/uploads/posts/${imageName}`;
};
