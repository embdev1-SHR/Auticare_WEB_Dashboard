import { useState } from "react";
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import Alert from "../shared/alert";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectAlertConfirm, setAlertConfirm } from "../../store/slice/layout.slice";
import { selectCurrentTherapistId, setCurrentTherapistId, setEdit, therapistDeletion } from "../../store/slice/therapist.slice";
import { selectUserID } from "../../store/slice/auth.slice";

function TherapistActions({ Therapist }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentId = useSelector(selectCurrentTherapistId);
  const router = useRouter();
  const dispatch = useDispatch();
  const IsAlert = useSelector(selectAlertConfirm);
  const [alert, setAlert] = useState(false);
  const UserId = useSelector(selectUserID);
  let TherapistID = Therapist.TherapistID
  const onEdit = () => {
    router.push({
      pathname: "/therapist/[therapistId]",
      query: { therapistId: TherapistID, edit: "true" },
    });
  };
  const onView = () => {
    router.push({
      pathname: "/therapist/[therapistId]",
      query: { therapistId: TherapistID },
    });
  };
  const onDelete = (id) => {
    dispatch(setCurrentTherapistId(id));
    setAlert(true);
  };
  const onHandleConfirm = async () => {
    setAlert(false);
    const result = await dispatch(therapistDeletion(currentId));
  };
  const onHandleDelete = async () => {
    setAlert(false);
  };

  return (
    <div className="dropdown float-right">
      <Dropdown direction="right" isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle color="light" className="btn-rounded more_vert_btn" caret>
          <i className="mdi mdi-dots-vertical"></i>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-right-custom">
          <DropdownItem onClick={onView}>View Details</DropdownItem>
          {UserId === Therapist?.Create_By && <><DropdownItem onClick={onEdit}>Edit</DropdownItem>
            <DropdownItem onClick={() => onDelete(TherapistID)}>Delete</DropdownItem></>}

          {/* <DropdownItem>Suspend</DropdownItem> */}
        </DropdownMenu>
      </Dropdown>
      {alert ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onHandleDelete} /> : null}
    </div>
  );
}
export default TherapistActions;
