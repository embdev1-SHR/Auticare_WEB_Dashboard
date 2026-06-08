import { useState } from "react";
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import Alert from "../shared/alert";
import { useDispatch, useSelector } from "react-redux";
import { selectAlertConfirm, setAlertConfirm, setModalOpen } from "../../store/slice/layout.slice";
import { getATherapy, selectCurrentTherapyId, setCurrentTherapyId, setTherapyEdit, setViewModalState, therapyDeletion } from "../../store/slice/therapies.slice";
import { selectUserID } from "../../store/slice/auth.slice";

function TherapyActions({ Therapy }) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const currentId = useSelector(selectCurrentTherapyId);
  const IsAlert = useSelector(selectAlertConfirm);
  const [alert, setAlert] = useState(false);
  const UserId = useSelector(selectUserID);

  const onEditTherapy = async () => {
    await dispatch(setTherapyEdit(true));
    await dispatch(getATherapy(Therapy.TherapyID));
    await dispatch(setModalOpen(true));
  };
  const onHandleDelete = (Id) => {
    dispatch(setCurrentTherapyId(Id));
    setAlert(true);
  };

  const onDeleteConfirm = () => {
    setAlert(false);
    dispatch(therapyDeletion(currentId));
  };

  const ViewTherapyDetails = async () => {
    await dispatch(getATherapy(Therapy.TherapyID));
    dispatch(setViewModalState(true));
  };

  const onHandleDeleteCancel = async () => {
    setAlert(false);
  };

  return (
    <div className='dropdown float-right'>
      <Dropdown direction='right' isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle color='light' className='btn-rounded more_vert_btn' caret>
          <i className='mdi mdi-dots-vertical'></i>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-right-custom' style={{marginBottom:"-110%",marginRight:"20%"}} j>
          <DropdownItem onClick={ViewTherapyDetails}>View Details</DropdownItem>
          <DropdownItem onClick={onEditTherapy}>Edit</DropdownItem>
          <DropdownItem onClick={() => onHandleDelete(Therapy.TherapyID)}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {alert ? <Alert onHandleConfirm={onDeleteConfirm} onDelete={onHandleDeleteCancel} /> : null}
    </div>
  );
}
export default TherapyActions;
