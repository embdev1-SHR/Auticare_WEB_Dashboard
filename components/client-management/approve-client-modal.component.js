import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import Alert from "../shared/alert";
import { approveClient, rejectClient, selectIsClientPendingLoading } from "../../store/slice/client.slice";

function ApproveClientModal({ pendingClient, onClose }) {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsClientPendingLoading);
  const [showRejectAlert, setShowRejectAlert] = useState(false);

  const handleApprove = async () => {
    await dispatch(approveClient({ UserID: pendingClient.UserID }));
    onClose();
  };

  const handleRejectConfirm = async () => {
    setShowRejectAlert(false);
    await dispatch(rejectClient(pendingClient.UserID));
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
        <ModalHeader toggle={onClose}>Client Registration Details</ModalHeader>
        <ModalBody>
          <div style={{ background: "#f8f9fa", borderRadius: 8, padding: "16px 20px" }}>
            {field("Organization", pendingClient.OrgName)}
            {field("Email", pendingClient.EmailId)}
            {field("Phone", pendingClient.Phone)}
            {field("Address", [pendingClient.AddressLine1, pendingClient.City, pendingClient.State, pendingClient.Country].filter(Boolean).join(", "))}
            {field("Registered On", pendingClient.Create_TS ? new Date(pendingClient.Create_TS).toLocaleString() : null)}
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

export default ApproveClientModal;
