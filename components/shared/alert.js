//SweetAlert
import SweetAlert from "react-bootstrap-sweetalert";

const Alert = ({ onHandleConfirm, onDelete }) => {

  return (
    <>
      <SweetAlert
        title='Are you sure?'
        warning
        showCancel
        confirmBtnBsStyle='success'
        cancelBtnBsStyle='danger'
        onConfirm={onHandleConfirm}
        confirmBtnText='Yes, delete!'
        onCancel={onDelete} />
    </>
  );
};

export default Alert;
