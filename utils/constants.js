export const getProfileImageUrl = (profileImage) => {
  if (!profileImage) return "/default-avatar.png";

  if (profileImage.startsWith("http")) return profileImage;

  const baseUrl = `https://aardvark-stories-images.s3.eu-north-1.amazonaws.com/`;

  return `${baseUrl}${profileImage}`;
};

export const getPostImageUrl = (image) => {
  if (!image) return "/placeholder-image.png";

  if (image.startsWith("http")) return image;

  const baseUrl = `https://aardvark-stories-images.s3.eu-north-1.amazonaws.com/`;

  return `${baseUrl}${image}`;
};

export const IMAGE_SIZES = {
  thumbnail: { width: 100, height: 100 },
  small: { width: 300, height: 200 },
  medium: { width: 600, height: 400 },
  large: { width: 1200, height: 800 },
};
