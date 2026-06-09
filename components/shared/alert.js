import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SweetAlert from "react-bootstrap-sweetalert";

const Alert = ({ onHandleConfirm, onDelete }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <SweetAlert
      title='Are you sure?'
      warning
      showCancel
      confirmBtnBsStyle='success'
      cancelBtnBsStyle='danger'
      onConfirm={onHandleConfirm}
      confirmBtnText='Yes, delete!'
      onCancel={onDelete}
    />,
    document.body
  );
};

export default Alert;
