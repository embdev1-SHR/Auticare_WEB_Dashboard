import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  PatientDeleteComment,
  setCurrentCommentId,
  selectCurrentCommentId,
  setEdit,

} from "../../../../store/slice/patient.slice"
import {
  selectAlertConfirm,
  setAlertConfirm,
  setModalOpen,
  selectEditConfirm
} from "../../../../store/slice/layout.slice";
import Alert from "../../../../components/shared/alert";

const CommentActions = (CommentID, PatientId) => {


  const [isActive, setIsActive] = useState(false);

  const currentId = useSelector(selectCurrentCommentId);
  const [popup, setPopup] = useState(false);

  const valueToSend = {
    currentId: currentId,
    PatientId: PatientId
  }

  const toggleNotification = () => setIsActive(!isActive);
  const IsAlert = useSelector(selectAlertConfirm);
  const dispatch = useDispatch();

  const onEdit = () => {
    const valueToSend = {
      Edit: true,
      CommentID: CommentID
    }
    dispatch(setEdit(valueToSend));
  };


  const onDelete = () => {
    setPopup(true)
    dispatch(setCurrentCommentId(CommentID));
    dispatch(setAlertConfirm(true));
  };

  const onDeleteConfirm = () => {

    setPopup(false)
    dispatch(setAlertConfirm(false));
    dispatch(PatientDeleteComment(valueToSend));
    const EditValueToSend = {
      Edit: false,
      CommentID: CommentID
    }
    dispatch(setEdit(EditValueToSend));
  };

  return (
    <div>
      <Dropdown isOpen={isActive} toggle={toggleNotification}>
        <DropdownToggle tag='button' className='btn dropdown-toggle' type='button'>
          <i className='mdi mdi-dots-horizontal font-size-20'></i>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-right'>
          <DropdownItem href='#' onClick={onEdit} >Edit</DropdownItem>
          <DropdownItem onClick={onDelete}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {popup && IsAlert ? <Alert onHandleConfirm={onDeleteConfirm} /> : null}
    </div>
  );
};

export default CommentActions;
