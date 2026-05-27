import "toastr/build/toastr.min.css";

export const ToastNotification = (toastType, title, message) => {
  if (typeof window === "undefined") return;
  const toastr = require("toastr");
  toastr.options = { positionClass: "toast-top-center" };
  if (toastType === "info") return setTimeout(() => toastr.info(message, title), 300);
  else if (toastType === "warning") return setTimeout(() => toastr.warning(message, title), 300);
  else if (toastType === "error") return setTimeout(() => toastr.error(message, title), 300);
  else return setTimeout(() => toastr.success(message, title), 300);
};
