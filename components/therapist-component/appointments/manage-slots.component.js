import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Label, Input } from "reactstrap";
import { selectUserData } from "../../../store/slice/auth.slice";
import { selectTherapistList } from "../../../store/slice/therapist.slice";
import {
  fetchAppointmentSlotsByTherapistService,
  createAppointmentSlotsService,
  updateAppointmentSlotService,
} from "../../../services/appointment.services";
import { ToastNotification } from "../../shared/toast";
import moment from "moment";

// Availability slots are recurring time windows (HH:mm). A therapist books an
// appointment against a slot + a date. This modal lets a therapist view, add
// and deactivate their own slots.
const ManageSlots = () => {
  const userData = useSelector(selectUserData);
  const therapists = useSelector(selectTherapistList);

  const myTherapistRecord = therapists?.find((t) => t.UserID === userData?.UserID);
  const therapistId = myTherapistRecord?.TherapistID;

  const [modalOpen, setModalOpen] = useState(false);
  const [existing, setExisting] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState([{ StartTime: "", EndTime: "" }]);

  const loadSlots = async () => {
    if (!therapistId) return;
    setLoading(true);
    try {
      const { data } = await fetchAppointmentSlotsByTherapistService(therapistId);
      setExisting(data.results.data || []);
    } catch {
      setExisting([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalOpen) loadSlots();
  }, [modalOpen, therapistId]);

  const toggle = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) setRows([{ StartTime: "", EndTime: "" }]);
  };

  const updateRow = (i, key, val) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));
  const addRow = () => setRows((r) => [...r, { StartTime: "", EndTime: "" }]);
  const removeRow = (i) => setRows((r) => (r.length === 1 ? r : r.filter((_, idx) => idx !== i)));

  const handleSave = async () => {
    const clean = rows
      .filter((r) => r.StartTime && r.EndTime)
      .map((r) => ({ StartTime: r.StartTime, EndTime: r.EndTime }));
    if (clean.length === 0) {
      ToastNotification("error", "Add at least one slot with start and end time");
      return;
    }
    for (const r of clean) {
      if (r.EndTime <= r.StartTime) {
        ToastNotification("error", `Slot ${r.StartTime}-${r.EndTime}: end time must be after start time`);
        return;
      }
    }
    setSaving(true);
    try {
      await createAppointmentSlotsService({ AppointmentSlots: clean });
      ToastNotification("success", "Availability slots added");
      setRows([{ StartTime: "", EndTime: "" }]);
      loadSlots();
    } catch (err) {
      const msg = err?.response?.data?.errors?.message || err?.errors?.message || "Failed to add slots";
      ToastNotification("error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (slot) => {
    try {
      await updateAppointmentSlotService(slot.AppointmentSlotID, {
        StartTime: moment(slot.StartTime, "HH:mm:ss").format("HH:mm"),
        EndTime: moment(slot.EndTime, "HH:mm:ss").format("HH:mm"),
        Status: false,
      });
      ToastNotification("success", "Slot removed");
      loadSlots();
    } catch (err) {
      ToastNotification("error", "Failed to remove slot");
    }
  };

  if (!therapistId) return null; // only therapists have slots

  return (
    <>
      <Button color="secondary" outline className="waves-effect waves-light" onClick={toggle}>
        <i className="mdi mdi-clock-outline me-1"></i> Manage Availability
      </Button>

      <Modal isOpen={modalOpen} toggle={toggle} centered size="md">
        <ModalHeader toggle={toggle}>My Availability Slots</ModalHeader>
        <ModalBody>
          <p className="text-muted small">
            These recurring time windows are what patients can be booked into. Times are 24-hour (HH:MM).
          </p>

          <Label className="fw-bold">Current slots</Label>
          {loading ? (
            <p className="text-muted small">Loading…</p>
          ) : existing.length === 0 ? (
            <p className="text-muted small">No slots yet. Add some below.</p>
          ) : (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {existing.map((s) => (
                <span
                  key={s.AppointmentSlotID}
                  className="badge bg-light text-dark border d-inline-flex align-items-center gap-2"
                  style={{ padding: "8px 10px", fontSize: "13px" }}
                >
                  {moment(s.StartTime, "HH:mm:ss").format("hh:mm A")} – {moment(s.EndTime, "HH:mm:ss").format("hh:mm A")}
                  <i
                    className="mdi mdi-close-circle text-danger"
                    style={{ cursor: "pointer" }}
                    title="Remove"
                    onClick={() => handleDeactivate(s)}
                  ></i>
                </span>
              ))}
            </div>
          )}

          <hr />

          <Label className="fw-bold">Add new slots</Label>
          {rows.map((row, i) => (
            <div className="d-flex align-items-end gap-2 mb-2" key={i}>
              <FormGroup className="mb-0 flex-fill">
                <Label className="small mb-1">Start</Label>
                <Input type="time" value={row.StartTime} onChange={(e) => updateRow(i, "StartTime", e.target.value)} />
              </FormGroup>
              <FormGroup className="mb-0 flex-fill">
                <Label className="small mb-1">End</Label>
                <Input type="time" value={row.EndTime} onChange={(e) => updateRow(i, "EndTime", e.target.value)} />
              </FormGroup>
              <Button color="light" onClick={() => removeRow(i)} title="Remove row" disabled={rows.length === 1}>
                <i className="mdi mdi-delete"></i>
              </Button>
            </div>
          ))}
          <Button color="link" className="p-0 mt-1" onClick={addRow}>
            <i className="mdi mdi-plus"></i> Add another slot
          </Button>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Slots"}
          </Button>
          <Button color="light" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ManageSlots;
