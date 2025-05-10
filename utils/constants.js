export const getProfileImageUrl = (profileImage) => {
  if (!profileImage) return "/default-avatar.png";

  if (profileImage.startsWith("http")) return profileImage;

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
  return `${baseUrl}/uploads/profiles/${profileImage}`;
};

export const getPostImageUrl = (image) => {
  if (!image) return "/placeholder-image.png";

  if (image.startsWith("http")) return image;

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
  return `${baseUrl}/uploads/posts/${image}`;
};
