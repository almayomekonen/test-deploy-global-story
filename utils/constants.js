export const getProfileImageUrl = (profileImage) => {
  if (!profileImage) return "/default-avatar.png";

  if (profileImage.startsWith("http")) return profileImage;

  return `https://aardvark-stories-api.onrender.com/uploads/profiles/${profileImage}`;
};

export const getPostImageUrl = (image) => {
  if (!image) return "/placeholder-image.png";

  if (image.startsWith("http")) return image;

  return `https://aardvark-stories-api.onrender.com/uploads/posts/${image}`;
};
