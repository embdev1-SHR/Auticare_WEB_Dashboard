import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Badge, FormGroup, Label, Input, Row, Col, Spinner,
} from "reactstrap";
import {
  assignSubscriptionToClient,
  deleteUnonboardedClient,
  updateUnonboardedClientInfo,
} from "../../store/slice/client.slice";
import { selectSubscriptionPlans } from "../../store/slice/subscription.slice";
import Alert from "../shared/alert";

function Field({ label, name, value, onChange, type = "text" }) {
  return (
    <FormGroup className="mb-2">
      <Label style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>{label}</Label>
      <Input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value)}
        bsSize="sm"
      />
    </FormGroup>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="d-flex mb-2">
      <span className="text-muted" style={{ minWidth: 140, fontSize: 13 }}>{label}</span>
      <span style={{ fontSize: 13 }}>{value || <span className="text-muted">—</span>}</span>
    </div>
  );
}

function UnonboardedClientModal({ client, isOpen, onClose }) {
  const dispatch = useDispatch();
  const subscriptionPlans = useSelector(selectSubscriptionPlans);

  const [tab, setTab] = useState("view"); // "view" | "edit" | "payment"
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [editForm, setEditForm] = useState({
    UserName: client.UserName || "",
    EmailId: client.EmailId || "",
    Phone: client.Phone || "",
    AddressLine1: client.AddressLine1 || "",
    AddressLine2: client.AddressLine2 || "",
    City: client.City || "",
    Pincode: client.Pincode || "",
    State: client.State || "",
    Country: client.Country || "",
  });

  const setField = (name, value) => setEditForm((f) => ({ ...f, [name]: value }));

  const handleSaveEdit = async () => {
    setSaving(true);
    await dispatch(updateUnonboardedClientInfo({ UserID: client.UserID, ...editForm }));
    setSaving(false);
    onClose();
  };

  const handleAssign = async () => {
    if (!selectedPlanId) return;
    setAssigning(true);
    await dispatch(
      assignSubscriptionToClient({
        UserID: client.UserID,
        ClientName: client.ClientName || client.UserName,
        SubscriptionPlanId: selectedPlanId,
      })
    );
    setAssigning(false);
    onClose();
  };

  const handleDelete = () => {
    dispatch(deleteUnonboardedClient(client.UserID));
    setConfirmDelete(false);
    onClose();
  };

  const registeredDate = client.Create_TS
    ? new Date(client.Create_TS).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  const tabStyle = (active) => ({
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    color: active ? "#1971c2" : "#6c757d",
    borderBottom: active ? "2px solid #1971c2" : "2px solid transparent",
    cursor: "pointer",
    background: "none",
    border: "none",
    outline: "none",
  });

  return (
    <>
      <Modal isOpen={isOpen} toggle={onClose} size="md" centered>
        <ModalHeader toggle={onClose}>
          {client.ClientName || client.UserName}
          <Badge color="warning" pill className="ms-2" style={{ fontSize: 11 }}>
            Pending Onboarding
          </Badge>
        </ModalHeader>

        {/* Tab bar */}
        <div style={{ display: "flex", borderBottom: "1px solid #dee2e6", padding: "0 16px" }}>
          <button style={tabStyle(tab === "view")} onClick={() => setTab("view")}>View</button>
          <button style={tabStyle(tab === "edit")} onClick={() => setTab("edit")}>Edit Details</button>
          <button style={tabStyle(tab === "payment")} onClick={() => setTab("payment")}>Assign Plan</button>
        </div>

        <ModalBody>
          {tab === "view" && (
            <>
              <InfoRow label="Name" value={client.ClientName || client.UserName} />
              <InfoRow label="Email" value={client.EmailId} />
              <InfoRow label="Phone" value={client.Phone} />
              <InfoRow
                label="Address"
                value={[client.AddressLine1, client.City, client.State].filter(Boolean).join(", ")}
              />
              <InfoRow label="Registered" value={registeredDate} />
              <InfoRow
                label="Payment"
                value={client.PaymentStatus || "Not Assigned"}
              />
            </>
          )}

          {tab === "edit" && (
            <div>
              <Row>
                <Col md={6}><Field label="Name" name="UserName" value={editForm.UserName} onChange={setField} /></Col>
                <Col md={6}><Field label="Email" name="EmailId" value={editForm.EmailId} onChange={setField} type="email" /></Col>
                <Col md={6}><Field label="Phone" name="Phone" value={editForm.Phone} onChange={setField} type="tel" /></Col>
              </Row>
              <Row>
                <Col md={12}><Field label="Address Line 1" name="AddressLine1" value={editForm.AddressLine1} onChange={setField} /></Col>
                <Col md={12}><Field label="Address Line 2" name="AddressLine2" value={editForm.AddressLine2} onChange={setField} /></Col>
                <Col md={6}><Field label="City" name="City" value={editForm.City} onChange={setField} /></Col>
                <Col md={6}><Field label="Pincode" name="Pincode" value={editForm.Pincode} onChange={setField} /></Col>
                <Col md={6}><Field label="State" name="State" value={editForm.State} onChange={setField} /></Col>
                <Col md={6}><Field label="Country" name="Country" value={editForm.Country} onChange={setField} /></Col>
              </Row>
              <Button
                color="primary"
                size="sm"
                onClick={handleSaveEdit}
                disabled={saving}
              >
                {saving ? <Spinner size="sm" className="me-1" /> : null}
                Save Changes
              </Button>
            </div>
          )}

          {tab === "payment" && (
            <>
              <p style={{ fontSize: 13, color: "#6c757d", marginBottom: 12 }}>
                Assign a subscription plan to this client. The plan activates immediately.
              </p>
              <FormGroup>
                <Label style={{ fontSize: 13, fontWeight: 500 }}>Subscription Plan</Label>
                <Input
                  type="select"
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  bsSize="sm"
                >
                  <option value="">— Select a plan —</option>
                  {subscriptionPlans.map((plan) => (
                    <option key={plan.SubscriptionPlanID} value={plan.SubscriptionPlanID}>
                      {plan.PlanName}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <Button
                color="primary"
                size="sm"
                disabled={!selectedPlanId || assigning}
                onClick={handleAssign}
              >
                {assigning ? <Spinner size="sm" className="me-1" /> : null}
                Assign Plan
              </Button>
            </>
          )}
        </ModalBody>

        <ModalFooter className="justify-content-between">
          <Button color="danger" outline size="sm" onClick={() => setConfirmDelete(true)}>
            Delete Client
          </Button>
          <Button color="secondary" size="sm" outline onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {confirmDelete && (
        <Alert
          onHandleConfirm={handleDelete}
          onDelete={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}

export default UnonboardedClientModal;
