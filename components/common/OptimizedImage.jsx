import { useState, useEffect, useRef } from "react";

const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  objectFit = "cover",
  placeholderColor = "#f3f4f6",
  loading = "lazy",
  sizes,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const element = imgRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
      },
      {
        rootMargin: "200px",
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const getOptimizedSrc = (url) => {
    if (!url) return "";
    if (url.startsWith("/")) return url;

    return url;
  };

  const containerStyle = {
    position: "relative",
    overflow: "hidden",
    backgroundColor: placeholderColor,
    width: width ? `${width}px` : "100%",
    height: height ? `${height}px` : "auto",
  };

  const imageStyle = {
    objectFit,
    width: "100%",
    height: "100%",
    transition: "opacity 0.3s ease-in-out",
    opacity: isLoaded ? 1 : 0,
  };

  return (
    <div ref={imgRef} style={containerStyle} className={className}>
      {(isInView || loading === "eager") && (
        <img
          src={getOptimizedSrc(src)}
          alt={alt}
          style={imageStyle}
          onLoad={handleImageLoad}
          loading={loading}
          width={width}
          height={height}
          sizes={sizes}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
