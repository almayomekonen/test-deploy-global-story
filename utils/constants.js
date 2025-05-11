export const getProfileImageUrl = (profileImage) => {
  if (!profileImage) return "/default-avatar.png";

  if (profileImage.startsWith("http")) return profileImage;

  return `https://aardvark-stories-images.s3.eu-north-1.amazonaws.com/${profileImage}`;
};

export const getPostImageUrl = (image) => {
  if (!image) return "/placeholder-image.png";

  if (image.startsWith("http")) return image;

  return `https://aardvark-stories-images.s3.eu-north-1.amazonaws.com/${image}`;
};
