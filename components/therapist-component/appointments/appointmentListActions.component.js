import { useState } from "react";
import { useDispatch } from "react-redux";
import { Badge, Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { updateAppointment } from "../../../store/slice/appointment.slice";
import { useSelector } from "react-redux";
import { selectUserData } from "../../../store/slice/auth.slice";

const AppointmentListActions = ({ appointment }) => {
  const dispatch = useDispatch();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const UserData = useSelector(selectUserData);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const onHandleAccept = async ({ AppointmentID }) => {
    setBtnDisabled(true);
    const data = {
      AppointmentID,
      AppointmentStatus: "Scheduled",
    };
    await dispatch(updateAppointment(data));
    setBtnDisabled(false);
  };
  const onHandleReject = async ({ AppointmentID }) => {
    setBtnDisabled(true);
    const data = {
      AppointmentID,
      AppointmentStatus: "Cancelled",
    };
    await dispatch(updateAppointment(data));
    setBtnDisabled(false);
  };
  console.warn(appointment.AppointmentStatus);
  return (<>
    {UserData.RoleName === "SuperAdmin" ? <Modal
      className="start_assessment_modal app_modal"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
      isOpen={modalOpen}
      toggle={toggleModal}
      centered={true}
    >
      <ModalHeader toggle={toggleModal}>Appointment Details</ModalHeader>
      <ModalBody className="pt-1">
        <div className="mb-4">
          <label className="form-label">Therapist Name</label>
          <input className="form-control" value={appointment.therapistName}></input>
        </div>
        <div className="mb-4">
          <label className="form-label">Center Name</label>
          <input className="form-control" value={appointment.CenterName}></input>
        </div>
        <div className="mb-4">
          <label className="form-label">Client Name</label>
          <input className="form-control" value={appointment.ClientName}></input>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button type="button" color="light" className="btn btn-md waves-effect waves-light action_btn" onClick={toggleModal}>
          Close
        </Button>
        {/* <Button type="button" className="btn btn-primary btn-md waves-effect waves-light action_btn" onClick={toggleModal}>
          Continue
        </Button> */}
      </ModalFooter>
    </Modal> : null}

    {appointment.AppointmentStatus === "Requested" ? (
      UserData.RoleName === "Therapist" ? <>
        <Button
          className='mr-2'
          color='success'
          size='sm'
          onClick={() => {
            onHandleAccept(appointment);
          }}
          disabled={btnDisabled}>
          Accept
        </Button>
        <Button
          color='danger'
          size='sm'
          onClick={() => {
            onHandleReject(appointment);
          }}
          disabled={btnDisabled}>
          Reject
        </Button>
      </> : null
    ) : appointment.AppointmentStatus === "Completed" ? (
      <Badge className='badge-soft-success rounded-pill me-1 p-2'>{appointment.AppointmentStatus}</Badge>
    ) : appointment.AppointmentStatus === "Scheduled" ? (
      <Badge className='badge-soft-warning rounded-pill me-1 p-2'>{appointment.AppointmentStatus}</Badge>
    ) : appointment.AppointmentStatus === "Cancelled" ? (
      <Badge className='badge-soft-danger rounded-pill me-1 p-2'>{appointment.AppointmentStatus}</Badge>
    ) : (
      <Badge className='badge-soft-info rounded-pill me-1 p-2'>{appointment.AppointmentStatus}</Badge>
    )}
    {UserData.RoleName === "SuperAdmin" && <Button
      className='mr-2'
      color='info'
      size='sm'
      style={{ marginLeft: "20px" }}
      onClick={toggleModal}
    >
      view details
    </Button>}
  </>
  )
};

export default AppointmentListActions;
