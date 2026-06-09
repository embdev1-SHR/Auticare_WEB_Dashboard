import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import {
  selectAlertConfirm
} from "../../store/slice/layout.slice";
import {
  deletePatient,
  fetchAllPatients,
  selectCurrentPatientId,
  setCurrentPatientId,
  setPatientEdit,
} from "../../store/slice/patient.slice";
import Alert from "../shared/alert";
import { selectUserData, selectUserID } from "../../store/slice/auth.slice";


function PatientActions(patient) {

  const router = useRouter();
  const dispatch = useDispatch();
  const UserId = useSelector(selectUserID);

  const [isOpen, setIsOpen] = useState(false);
  const IsAlert = useSelector(selectAlertConfirm);
  const currentId = useSelector(selectCurrentPatientId);
  const [alert, setAlert] = useState(false);

  const onHandleConfirm = async () => {
    setAlert(false);

    await dispatch(deletePatient(patient.patient.PatientID));
    await dispatch(fetchAllPatients());
  };
  const onDelete = (id) => {
    dispatch(setCurrentPatientId(id));
    setAlert(true);
  };
  const handleClickEdit = async () => {
    await dispatch(setPatientEdit(true));
    await router.push(`/patients/${patient.patient.PatientID ? patient.patient.PatientID : patient.PatientID}?edit=true`);
  };
  const handleClickView = async () => {
    await dispatch(setPatientEdit(false));
    await router.push(`/patients/${patient.patient.PatientID ? patient.patient.PatientID : patient.PatientID}`);
  };
  const onHandleDelete = async () => {
    setAlert(false);
  };


  return (
    <div className="dropdown float-right">
      <Dropdown
        direction="right"
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
      >
        <DropdownToggle
          color="light"
          className="btn-rounded more_vert_btn"
          caret
        >
          <i className="mdi mdi-dots-vertical"></i>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-right-custom" style={{ marginBottom: "-110%", marginRight: "10%" }}>
          <DropdownItem onClick={handleClickView}>View Details</DropdownItem>
          {UserId === patient.patient?.Create_By && <><DropdownItem onClick={handleClickEdit}>Edit</DropdownItem>
            <DropdownItem onClick={() => onDelete(patient.PatientID)}>
              Delete
            </DropdownItem></>}
        </DropdownMenu>
      </Dropdown>
      {alert ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onHandleDelete} /> : null}
    </div>
  );
}

export default PatientActions;
