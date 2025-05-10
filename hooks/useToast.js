import { useCallback } from "react";
import {
  notifyComment,
  notifyInfo,
  notifyWarning,
  notifyError,
  notifyLike,
  notifySuccess,
} from "../utils/toast";

export default function useToast() {
  const success = useCallback((message, options = {}) => {
    return notifySuccess(message, options);
  }, []);

  const error = useCallback((message, options = {}) => {
    return notifyError(message, options);
  }, []);

  const info = useCallback((message, options = {}) => {
    return notifyInfo(message, options);
  }, []);

  const warning = useCallback((message, options = {}) => {
    return notifyWarning(message, options);
  }, []);

  const like = useCallback((action, postTitle) => {
    if (action === "added") {
      return notifyLike.added(postTitle);
    } else if (action === "removed") {
      return notifyLike.removed(postTitle);
    } else {
      return notifyLike.error();
    }
  }, []);

  const comment = useCallback((action, postTitle) => {
    if (action === "added") {
      return notifyComment.added(postTitle);
    } else if (action === "deleted") {
      return notifyComment.deleted();
    } else {
      return notifyComment.error();
    }
  }, []);

  return {
    success,
    error,
    info,
    warning,
    like,
    comment,
  };
}
