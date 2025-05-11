export const getProfileImageUrl = (profileImage) => {
  if (!profileImage) return "/default-avatar.png";

  if (profileImage.startsWith("http")) return profileImage;

  // S3 base URL
  const baseUrl = `https://aardvark-stories-images.s3.eu-north-1.amazonaws.com/`;

  // If we had implemented server-side image resizing, we could use different sizes
  // For now, we'll just return the original image
  return `${baseUrl}${profileImage}`;
};

export const getPostImageUrl = (image) => {
  if (!image) return "/placeholder-image.png";

  if (image.startsWith("http")) return image;

  // S3 base URL
  const baseUrl = `https://aardvark-stories-images.s3.eu-north-1.amazonaws.com/`;

  // If we had implemented server-side image resizing, we could use different sizes
  // For now, we'll just return the original image
  return `${baseUrl}${image}`;
};

// Constants for image sizes (to be used with responsive images)
export const IMAGE_SIZES = {
  thumbnail: { width: 100, height: 100 },
  small: { width: 300, height: 200 },
  medium: { width: 600, height: 400 },
  large: { width: 1200, height: 800 },
};
