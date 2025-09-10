// src/components/Notification.jsx
import { toast } from "react-toastify";

export const notify = (type, message, options = {}) => {
  switch (type) {
    case "success":
      toast.success(message, {
        position: "top-right",
        theme:"dark",
        bodyClassName: "text-toast",
        ...options,
      });
      break;

    case "error":
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        ...options,
      });
      break;

    case "info":
      toast.info(message, {
        position: "top-right",
        autoClose: 4000,
        ...options,
      });
      break;

    case "warn":
      toast.warn(message, {
        position: "bottom-center",
        autoClose: 4000,
        ...options,
      });
      break;

    default:
      toast(message, {
        position: "top-right",
        ...options,
      });
      break;
  }
};
