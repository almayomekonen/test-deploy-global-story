import {
  toast as reactToast,
  ToastContainer as ReactToastContainer,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

const isMobile = () => {
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
};

const getDefaultOptions = () => {
  const mobile = isMobile();

  return {
    position: mobile ? "bottom-center" : "bottom-left",
    autoClose: 2500,
    hideProgressBar: mobile,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    closeButton: !mobile,

    style: mobile
      ? {
          margin: "0 auto 1rem auto",
          width: "90%",
          maxWidth: "400px",
          borderRadius: "12px",
          fontSize: "14px",
          padding: "10px 16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }
      : {},

    icon: mobile ? "🔔" : undefined,
  };
};

export const ToastContainer = () => {
  const mobile = isMobile();

  return React.createElement(ReactToastContainer, {
    limit: mobile ? 2 : 5,
    newestOnTop: true,
    style: mobile ? { bottom: "12px" } : {},
  });
};

export const notifySuccess = (message, options = {}) => {
  return reactToast.success(message, { ...getDefaultOptions(), ...options });
};

export const notifyError = (message, options = {}) => {
  return reactToast.error(message || "An error occurred", {
    ...getDefaultOptions(),
    ...options,
  });
};

export const notifyInfo = (message, options = {}) => {
  return reactToast.info(message, { ...getDefaultOptions(), ...options });
};

export const notifyWarning = (message, options = {}) => {
  return reactToast.warning(message, { ...getDefaultOptions(), ...options });
};

const getShortenedMessage = (message, postTitle) => {
  if (!isMobile() || !postTitle) return message;

  if (postTitle.length > 20) {
    return message.replace(postTitle, postTitle.substring(0, 17) + "...");
  }
  return message;
};

export const notifyLike = {
  added: (postTitle) =>
    notifySuccess(getShortenedMessage(`You liked ${postTitle}`, postTitle), {
      icon: "❤️",
    }),
  removed: (postTitle) =>
    notifyInfo(getShortenedMessage(`You unliked ${postTitle}`, postTitle), {
      icon: "💔",
    }),
  error: () => notifyError("Unable to process like"),
};

export const notifyComment = {
  added: (postTitle) =>
    notifySuccess(
      getShortenedMessage(`Comment added to ${postTitle}`, postTitle),
      { icon: "💬" }
    ),
  deleted: () => notifyInfo("Comment deleted"),
  error: () => notifyError("Comment error. Try again."),
};

export const createCustomToast = (type, message, duration) => {
  const options = {
    ...getDefaultOptions(),
    autoClose: duration || 2500,
  };

  switch (type) {
    case "success":
      return notifySuccess(message, options);
    case "error":
      return notifyError(message, options);
    case "info":
      return notifyInfo(message, options);
    case "warning":
      return notifyWarning(message, options);
    default:
      return notifyInfo(message, options);
  }
};

export default {
  success: notifySuccess,
  error: notifyError,
  info: notifyInfo,
  warning: notifyWarning,
  like: notifyLike,
  comment: notifyComment,
  custom: createCustomToast,
};
