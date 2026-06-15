import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Badge, FormGroup, Label, Input, Row, Col, Spinner,
} from "reactstrap";
import { assignSubscriptionToClient, deleteUnonboardedClient } from "../../store/slice/client.slice";
import { selectSubscriptionPlans } from "../../store/slice/subscription.slice";
import Alert from "../shared/alert";

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
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  return (
    <>
      <Modal isOpen={isOpen} toggle={onClose} size="md" centered>
        <ModalHeader toggle={onClose}>
          Client Details
          <Badge color="warning" pill className="ms-2" style={{ fontSize: 11 }}>
            Pending Onboarding
          </Badge>
        </ModalHeader>
        <ModalBody>
          <h6 className="text-muted mb-3" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
            Basic Information
          </h6>
          <InfoRow label="Name" value={client.ClientName || client.UserName} />
          <InfoRow label="Email" value={client.EmailId} />
          <InfoRow label="Phone" value={client.Phone} />
          <InfoRow label="Address" value={[client.AddressLine1, client.City, client.State].filter(Boolean).join(", ")} />
          <InfoRow label="Registered" value={registeredDate} />

          <hr />

          <h6 className="text-muted mb-3" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
            Assign Subscription Plan
          </h6>
          <Row>
            <Col>
              <FormGroup>
                <Label for="planSelect" style={{ fontSize: 13 }}>Subscription Plan</Label>
                <Input
                  id="planSelect"
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
            </Col>
          </Row>

          <Button
            color="primary"
            size="sm"
            disabled={!selectedPlanId || assigning}
            onClick={handleAssign}
          >
            {assigning ? <Spinner size="sm" className="me-1" /> : null}
            Assign Plan
          </Button>
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
