export const getProfileImageUrl = (profileImage) => {
  if (!profileImage) return "/default-avatar.png";

  if (typeof profileImage === "string" && profileImage.startsWith("http"))
    return profileImage;

  const baseUrl =
    "https://aardvark-stories-images.s3.eu-north-1.amazonaws.com/";

  if (typeof profileImage === "string") return `${baseUrl}${profileImage}`;

  return "/default-avatar.png";
};

export const getPostImageUrl = (image, size = "original") => {
  if (!image) return "/placeholder-image.png";

  if (Array.isArray(image)) {
    if (image.length === 0) return "/placeholder-image.png";
    image = image[0];
  }

  if (typeof image === "string" && image.startsWith("http")) return image;

  if (typeof image === "object") {
    if (size === "thumbnail" && image.thumbnail) return image.thumbnail;
    if (size === "medium" && image.medium) return image.medium;
    if (image.original) return image.original;
    return "/placeholder-image.png";
  }

  if (typeof image === "string") {
    const baseUrl =
      "https://aardvark-stories-images.s3.eu-north-1.amazonaws.com/";

    if (size === "original") return `${baseUrl}${image}`;

    try {
      const ext = image.includes(".")
        ? image.slice(image.lastIndexOf("."))
        : "";
      const base = image.includes(".")
        ? image.slice(0, image.lastIndexOf("."))
        : image;
      return `${baseUrl}${base}-${size}${ext}`;
    } catch (error) {
      console.error("Error formatting image URL:", error);
      return `${baseUrl}${image}`;
    }
  }

  return "/placeholder-image.png";
};
