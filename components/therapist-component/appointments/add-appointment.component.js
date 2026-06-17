import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Label, Input, InputGroup } from "reactstrap";
import { selectRole, selectUserData } from "../../../store/slice/auth.slice";
import { selectPatientList } from "../../../store/slice/patient.slice";
import { selectTherapistList } from "../../../store/slice/therapist.slice";
import { createAppointment } from "../../../store/slice/appointment.slice";
import { fetchAppointmentSlotsByTherapistService } from "../../../services/appointment.services";
import { ToastNotification } from "../../shared/toast";
import moment from "moment";

const AddAppointment = () => {
  const dispatch = useDispatch();
  const role = useSelector(selectRole);
  const userData = useSelector(selectUserData);
  const patients = useSelector(selectPatientList);
  const therapists = useSelector(selectTherapistList);

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    PatientID: "",
    TherapistID: "",
    AppointmentSlotID: "",
    ScheduledDate: "",
  });

  const isPatient = role === "Patient";

  const patientOptions = patients?.map((p) => ({
    value: p.PatientID,
    label: p.PatientName,
  }));

  const therapistOptions = therapists?.map((t) => ({
    value: t.TherapistID,
    label: `${t.Salutation ? t.Salutation + " " : ""}${t.Name || t.UserName || ""}`,
  }));

  const slotOptions = slots?.map((s) => ({
    value: s.AppointmentSlotID,
    label: `${moment(s.StartTime, "HH:mm:ss").format("hh:mm A")} - ${moment(s.EndTime, "HH:mm:ss").format("hh:mm A")}`,
  }));

  const resetForm = () => {
    setForm({ PatientID: "", TherapistID: "", AppointmentSlotID: "", ScheduledDate: "" });
    setSlots([]);
    setCreatedAppointment(null);
    setCopied(false);
  };

  const toggle = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) resetForm();
  };

  const handleTherapistChange = async (option) => {
    setForm((f) => ({ ...f, TherapistID: option.value, AppointmentSlotID: "" }));
    setSlotsLoading(true);
    try {
      const { data } = await fetchAppointmentSlotsByTherapistService(option.value);
      setSlots(data.results.data || []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.TherapistID || !form.AppointmentSlotID || !form.ScheduledDate) {
      ToastNotification("error", "Please fill all required fields");
      return;
    }
    if (!isPatient && !form.PatientID) {
      ToastNotification("error", "Please select a patient");
      return;
    }

    setSubmitting(true);
    const payload = {
      TherapistID: form.TherapistID,
      AppointmentSlotID: form.AppointmentSlotID,
      ScheduledDate: moment(form.ScheduledDate).format("MM/DD/YYYY"),
    };
    if (!isPatient) payload.PatientID = form.PatientID;

    try {
      const result = await dispatch(createAppointment(payload));
      if (result.meta.requestStatus === "fulfilled") {
        setCreatedAppointment(payload);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const appointmentLink = createdAppointment
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/appointments`
    : "";

  const handleCopy = () => {
    if (!appointmentLink) return;
    navigator.clipboard.writeText(appointmentLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Appointment", url: appointmentLink });
    } else {
      handleCopy();
    }
  };

  return (
    <>
      <Button color="primary" className="waves-effect waves-light" onClick={toggle}>
        <i className="mdi mdi-plus me-1"></i> Add Appointment
      </Button>

      <Modal isOpen={modalOpen} toggle={toggle} centered size="md">
        <ModalHeader toggle={toggle}>
          {createdAppointment ? "Appointment Created" : "Create Appointment"}
        </ModalHeader>
        <ModalBody>
          {createdAppointment ? (
            <div className="text-center py-3">
              <i className="mdi mdi-check-circle-outline text-success" style={{ fontSize: "3rem" }}></i>
              <p className="mt-3 mb-1">Appointment created successfully!</p>
              <p className="text-muted small mb-3">Share the appointments page link with the patient.</p>
              <InputGroup>
                <Input value={appointmentLink} readOnly />
                <Button color={copied ? "success" : "secondary"} onClick={handleCopy}>
                  {copied ? <i className="mdi mdi-check"></i> : <i className="mdi mdi-content-copy"></i>}
                </Button>
                <Button color="info" onClick={handleShare} title="Share">
                  <i className="mdi mdi-share-variant"></i>
                </Button>
              </InputGroup>
            </div>
          ) : (
            <>
              {!isPatient && (
                <FormGroup>
                  <Label className="required">Patient</Label>
                  <Select
                    options={patientOptions}
                    placeholder="Select patient"
                    onChange={(opt) => setForm((f) => ({ ...f, PatientID: opt.value }))}
                    styles={{ control: (s) => ({ ...s, borderColor: "#e8eaed", borderRadius: "0.375rem" }) }}
                  />
                </FormGroup>
              )}
              <FormGroup>
                <Label className="required">Therapist</Label>
                <Select
                  options={therapistOptions}
                  placeholder="Select therapist"
                  onChange={handleTherapistChange}
                  styles={{ control: (s) => ({ ...s, borderColor: "#e8eaed", borderRadius: "0.375rem" }) }}
                />
              </FormGroup>
              <FormGroup>
                <Label className="required">Appointment Slot</Label>
                <Select
                  options={slotOptions}
                  placeholder={slotsLoading ? "Loading slots..." : form.TherapistID ? "Select slot" : "Select therapist first"}
                  isDisabled={!form.TherapistID || slotsLoading}
                  onChange={(opt) => setForm((f) => ({ ...f, AppointmentSlotID: opt.value }))}
                  styles={{ control: (s) => ({ ...s, borderColor: "#e8eaed", borderRadius: "0.375rem" }) }}
                />
              </FormGroup>
              <FormGroup>
                <Label className="required">Scheduled Date</Label>
                <Input
                  type="date"
                  min={moment().format("YYYY-MM-DD")}
                  value={form.ScheduledDate}
                  onChange={(e) => setForm((f) => ({ ...f, ScheduledDate: e.target.value }))}
                />
              </FormGroup>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {createdAppointment ? (
            <>
              <Button color="primary" onClick={resetForm}>
                Create Another
              </Button>
              <Button color="light" onClick={toggle}>
                Close
              </Button>
            </>
          ) : (
            <>
              <Button color="primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Creating..." : "Create Appointment"}
              </Button>
              <Button color="light" onClick={toggle}>
                Cancel
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AddAppointment;
