import moment from "moment";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalHeader } from "reactstrap";
import { deleteStoreEnquiry, markAsRead } from "../../store/slice/store.slice";
import Alert from "../shared/alert";

function EnquiryActions({ enquiry }) {
  const [isOpen, setIsOpen] = useState(false);
  const [alert, setAlert] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const dispatch = useDispatch();

  const handleView = () => {
    setViewModal(true);
    if (enquiry.IsAdminViewed === 0) {
      dispatch(markAsRead({ payload: { IsAdminViewed: 1, Status: 1 }, StoreEnquiryID: enquiry.StoreEnquiryID }));
    }
  };

  const handleMarkAsRead = () => {
    dispatch(markAsRead({ payload: { IsAdminViewed: 1, Status: 1 }, StoreEnquiryID: enquiry.StoreEnquiryID }));
  };

  const onDeleteConfirm = () => {
    dispatch(deleteStoreEnquiry(enquiry.StoreEnquiryID));
    setAlert(false);
  };

  return (
    <div className='dropdown float-right'>
      <Dropdown direction='right' isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle color='light' className='btn-rounded more_vert_btn' caret>
          <i className='mdi mdi-dots-vertical'></i>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-right-custom'>
          <DropdownItem onClick={handleView}>Read</DropdownItem>
          {enquiry.IsAdminViewed === 0 && (
            <DropdownItem onClick={handleMarkAsRead}>Mark As Read</DropdownItem>
          )}
          <DropdownItem onClick={() => setAlert(true)}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {alert && (
        <Alert onHandleConfirm={onDeleteConfirm} onDelete={() => setAlert(false)} />
      )}

      <Modal isOpen={viewModal} toggle={() => setViewModal(false)} centered size='md'>
        <ModalHeader toggle={() => setViewModal(false)}>Enquiry Details</ModalHeader>
        <ModalBody>
          <table className='table table-borderless mb-0'>
            <tbody>
              <tr>
                <th style={{ width: "35%" }}>Product</th>
                <td>{enquiry.ProductName}</td>
              </tr>
              <tr>
                <th>Enquiry</th>
                <td>{enquiry.Enquiry}</td>
              </tr>
              <tr>
                <th>Submitted By</th>
                <td>{enquiry.Name}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{enquiry.EmailId}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{enquiry.Phone}</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>{moment(new Date(enquiry.Create_TS)).format("MM/DD/YYYY")}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{enquiry.IsAdminViewed === 0 ? "Unread" : "Read"}</td>
              </tr>
            </tbody>
          </table>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default EnquiryActions;
