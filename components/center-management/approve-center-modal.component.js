import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label } from "reactstrap";
import Select from "react-select";
import Alert from "../shared/alert";
import { approveCenter, rejectCenter, selectIsPendingLoading } from "../../store/slice/center.slice";
import { selectClientList } from "../../store/slice/client.slice";

function ApproveCenterModal({ pendingCenter, onClose }) {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsPendingLoading);
  const clientList = useSelector(selectClientList);
  const [clientID, setClientID] = useState(null);
  const [clientError, setClientError] = useState("");
  const [showRejectAlert, setShowRejectAlert] = useState(false);

  const clientOptions = (clientList || []).map((c) => ({
    value: c.ClientID,
    label: c.ClientName,
  }));

  const handleApprove = async () => {
    if (!clientID) {
      setClientError("Please select a client to assign this center to.");
      return;
    }
    setClientError("");
    await dispatch(approveCenter({ UserID: pendingCenter.UserID, ClientID: clientID }));
    onClose();
  };

  const handleRejectConfirm = async () => {
    setShowRejectAlert(false);
    await dispatch(rejectCenter(pendingCenter.UserID));
    onClose();
  };

  const field = (label, value) => (
    <div style={{ display: "flex", marginBottom: 10 }}>
      <span style={{ minWidth: 140, fontWeight: 600, color: "#555", fontSize: 13 }}>{label}</span>
      <span style={{ color: "#1e1e2d", fontSize: 13 }}>{value || <span style={{ color: "#aaa" }}>—</span>}</span>
    </div>
  );

  return (
    <>
      <Modal isOpen toggle={onClose} size="md">
        <ModalHeader toggle={onClose}>Center Registration Details</ModalHeader>
        <ModalBody>
          <div style={{ background: "#f8f9fa", borderRadius: 8, padding: "16px 20px", marginBottom: 20 }}>
            {field("Center Name", pendingCenter.CenterName)}
            {field("Email", pendingCenter.EmailId)}
            {field("Phone", pendingCenter.Phone)}
            {field("Address", [pendingCenter.AddressLine1, pendingCenter.City, pendingCenter.State, pendingCenter.Country].filter(Boolean).join(", "))}
            {field("Registered On", pendingCenter.Create_TS ? new Date(pendingCenter.Create_TS).toLocaleString() : null)}
          </div>

          <div>
            <Label className="form-label required" style={{ fontWeight: 600 }}>
              Assign to Client <span className="text-danger">*</span>
            </Label>
            <Select
              options={clientOptions}
              placeholder="Select client..."
              onChange={(opt) => { setClientID(opt ? opt.value : null); setClientError(""); }}
              styles={{ control: (s) => ({ ...s, borderColor: clientError ? "#dc3545" : "#e8eaed", borderRadius: "0.375rem" }) }}
            />
            {clientError && <div className="text-danger small mt-1">{clientError}</div>}
          </div>
        </ModalBody>
        <ModalFooter className="justify-content-between">
          <Button color="danger" outline onClick={() => setShowRejectAlert(true)} disabled={isLoading}>
            Reject Registration
          </Button>
          <div className="d-flex gap-2">
            <Button color="secondary" outline onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button color="success" onClick={handleApprove} disabled={isLoading}>
              {isLoading ? "Approving…" : "Approve & Activate"}
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {showRejectAlert && (
        <Alert
          onHandleConfirm={handleRejectConfirm}
          onDelete={() => setShowRejectAlert(false)}
        />
      )}
    </>
  );
}

export default ApproveCenterModal;
