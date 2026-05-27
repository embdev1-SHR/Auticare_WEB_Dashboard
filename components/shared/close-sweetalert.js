//SweetAlert
import SweetAlert from "react-bootstrap-sweetalert";

const CloseSweetAlert = ({ onConfirm, onClose }) => {
  return (
    <>
      <SweetAlert title='Are you sure?' closeOnClickOutside={false} warning showCancel confirmBtnBsStyle='success' cancelBtnBsStyle='danger' onConfirm={onConfirm} onCancel={onClose}>
        You won&apos;t be able to revert this!
      </SweetAlert>
    </>
  );
};

export default CloseSweetAlert;
