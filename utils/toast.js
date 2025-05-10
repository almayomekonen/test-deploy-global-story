import { toast } from "react-toastify";

const defaultOptions = {
  position: "bottom-left",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const notifySuccess = (message, options = {}) => {
  return toast.success(message, { ...defaultOptions, ...options });
};

export const notifyError = (message, options = {}) => {
  return toast.error(message, { ...defaultOptions, ...options });
};

export const notifyInfo = (message, options = {}) => {
  return toast.info(message, { ...defaultOptions, ...options });
};

export const notifyWarning = (message, options = {}) => {
  return toast.warning(message, { ...defaultOptions, ...options });
};

export const notifyLike = {
  added: (postTitle) => notifySuccess(`You liked ${postTitle}`),
  removed: (postTitle) => notifyInfo(`You unliked ${postTitle}`),
  error: () => notifyError("Unable to process your like, please try again."),
};

export const notifyComment = {
  added: (postTitle) => notifySuccess(`you commented on ${postTitle}`),
  deleted: () => notifyInfo("comment deleted"),
  error: () => notifyError("Error processing your comment, please try again."),
};
