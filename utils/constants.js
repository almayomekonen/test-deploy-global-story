export const getProfileImageUrl = (profileImage) => {
  if (!profileImage) return "/default-avatar.png";

  if (typeof profileImage === "string" && profileImage.startsWith("http"))
    return profileImage;

  const s3BucketUrl =
    "https://aardvark-stories-images.s3.eu-north-1.amazonaws.com/";

  if (typeof profileImage === "string") {
    if (profileImage.includes("aardvark-stories-images")) {
      const parts = profileImage.split("aardvark-stories-images");
      const key = parts[parts.length - 1].replace(/^[/.]/g, "");
      return `${s3BucketUrl}${key}`;
    }
    return `${s3BucketUrl}${profileImage}`;
  }

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
    const s3BucketUrl =
      "https://aardvark-stories-images.s3.eu-north-1.amazonaws.com/";

    if (image.includes("aardvark-stories-images")) {
      const parts = image.split("aardvark-stories-images");
      const key = parts[parts.length - 1].replace(/^[/.]/g, "");

      if (size === "original") return `${s3BucketUrl}${key}`;

      try {
        const ext = key.includes(".") ? key.slice(key.lastIndexOf(".")) : "";
        const base = key.includes(".")
          ? key.slice(0, key.lastIndexOf("."))
          : key;
        return `${s3BucketUrl}${base}-${size}${ext}`;
      } catch (error) {
        console.error("Error formatting image URL:", error);
        return `${s3BucketUrl}${key}`;
      }
    }

    if (size === "original") return `${s3BucketUrl}${image}`;

    try {
      const ext = image.includes(".")
        ? image.slice(image.lastIndexOf("."))
        : "";
      const base = image.includes(".")
        ? image.slice(0, image.lastIndexOf("."))
        : image;
      return `${s3BucketUrl}${base}-${size}${ext}`;
    } catch (error) {
      console.error("Error formatting image URL:", error);
      return `${s3BucketUrl}${image}`;
    }
  }

  return "/placeholder-image.png";
};
