import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { patientStartSession, updatePatientSession } from "../../../../store/slice/patient.slice";
import moment from "moment";
import Alert from "../../../shared/alert";

const SessionListActions = ({ session }) => {
  const router = useRouter();
  const { PatientId } = router.query;
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);

  function createFormatDate(date) {
    return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
  }

  let date = moment(new Date()).locale("en-in").format("MM/DD/YYYY");

  const handleStartSession = () => {
    const valueToSend = {
      PatientId,
      SessionID: session.SessionID,
    }
    dispatch(patientStartSession(valueToSend));
  };

  const handleSessionReport = () => {
    router.push(`/patients/${PatientId}/sessions/${session.SessionID}/report`);
  };
  const handleDelete = () => {
    const valueToSend = {
      "SessionName": session?.SessionName,
      "SessionDate": createFormatDate(session?.SessionDate),
      "NoOfAttempt": session?.NoOfAttempt,
      "NoOfSuccess": session?.NoOfSuccess,
      "NoOfFail": session?.NoOfFail,
      "Feedback": session?.feedback == null ? undefined : session?.feedback,
      "Rating": session?.rating == null ? undefined : session?.rating,
      "Status": 0,
      SessionID: session?.SessionID,
      msg: "Deleted Successfully",
      PatientID: PatientId
    }
    dispatch(updatePatientSession(valueToSend));
  };

  const onHandleDelete = async () => {
    setAlert(true);
  };

  const onDelete = (id) => {
    setAlert(false);
  };


  return (<>
    <Dropdown direction='right' isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
      <DropdownToggle color='light' className='btn-rounded more_vert_btn' caret>
        <i className='mdi mdi-dots-vertical'></i>
      </DropdownToggle>
      <DropdownMenu style={{ marginBottom: "-70%", marginRight: "10%" }}>
        <DropdownItem onClick={handleStartSession}>{createFormatDate(session.SessionDate) > date ? "Start" : createFormatDate(session.SessionDate) == date ? "Start" : "View"} Session</DropdownItem>
        <DropdownItem onClick={handleSessionReport}>Session Report</DropdownItem>
        <DropdownItem onClick={onHandleDelete}>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    {alert ? <Alert onHandleConfirm={handleDelete} onDelete={onDelete} /> : null}
    </>
  );
};

export default SessionListActions;
