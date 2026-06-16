import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Spinner } from "reactstrap";
import Alert from "../shared/alert";
import { approveClient, rejectClient, assignSubscriptionToClient, selectIsClientPendingLoading } from "../../store/slice/client.slice";
import { getAllSubscriptionPlans, selectSubscriptionPlans } from "../../store/slice/subscription.slice";

function ApproveClientModal({ pendingClient, onClose }) {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsClientPendingLoading);
  const subscriptionPlans = useSelector(selectSubscriptionPlans);
  const [showRejectAlert, setShowRejectAlert] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (!subscriptionPlans || subscriptionPlans.length === 0) {
      dispatch(getAllSubscriptionPlans());
    }
  }, [dispatch, subscriptionPlans]);

  const handleApprove = async () => {
    setIsAssigning(true);
    const approveResult = await dispatch(approveClient({ UserID: pendingClient.UserID }));
    if (approveResult.meta.requestStatus === "fulfilled" && selectedPlanId) {
      await dispatch(
        assignSubscriptionToClient({
          UserID: pendingClient.UserID,
          SubscriptionPlanId: selectedPlanId,
          ClientName: pendingClient.OrgName || pendingClient.EmailId,
        })
      );
    }
    setIsAssigning(false);
    onClose();
  };

  const handleRejectConfirm = async () => {
    setShowRejectAlert(false);
    await dispatch(rejectClient(pendingClient.UserID));
    onClose();
  };

  const busy = isLoading || isAssigning;

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
          <div style={{ background: "#f8f9fa", borderRadius: 8, padding: "16px 20px", marginBottom: 20 }}>
            {field("Organization", pendingClient.OrgName)}
            {field("Email", pendingClient.EmailId)}
            {field("Phone", pendingClient.Phone)}
            {field("Address", [pendingClient.AddressLine1, pendingClient.City, pendingClient.State, pendingClient.Country].filter(Boolean).join(", "))}
            {field("Registered On", pendingClient.Create_TS ? new Date(pendingClient.Create_TS).toLocaleString() : null)}
          </div>

          <FormGroup>
            <Label style={{ fontWeight: 600, fontSize: 13 }}>
              Assign Subscription Plan{" "}
              <span style={{ fontWeight: 400, color: "#6c757d" }}>(optional — can be assigned later)</span>
            </Label>
            <Input
              type="select"
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              disabled={busy}
            >
              <option value="">— Select a plan —</option>
              {(subscriptionPlans || []).map((plan) => (
                <option key={plan.SubscriptionPlanID} value={plan.SubscriptionPlanID}>
                  {plan.PlanName}
                  {plan.NumberOfPlanActiveDays ? ` (${plan.NumberOfPlanActiveDays} days)` : ""}
                </option>
              ))}
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter className="justify-content-between">
          <Button color="danger" outline onClick={() => setShowRejectAlert(true)} disabled={busy}>
            Reject Registration
          </Button>
          <div className="d-flex gap-2">
            <Button color="secondary" outline onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button color="success" onClick={handleApprove} disabled={busy}>
              {busy && <Spinner size="sm" className="me-1" />}
              {busy
                ? "Processing…"
                : selectedPlanId
                ? "Approve & Assign Plan"
                : "Approve & Activate"}
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
