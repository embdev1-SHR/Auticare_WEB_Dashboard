import { useRouter } from "next/router";
import { useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalHeader, Input, InputGroup, Button } from "reactstrap";
import { useDispatch } from "react-redux";
import Alert from "../../../shared/alert";
import { setHomeSessionEdit, updateHomeSession } from "../../../../store/slice/patient.slice";
import { generateHomeSessionShareLinkService } from "../../../../services/patient.services";
import { ToastNotification } from "../../../shared/toast";

function ResourceActions({ value }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClickView = async () => {
    dispatch(setHomeSessionEdit(false));
    await router.push(`/patients/${value.PatientID}/home-session/${value.HomeSessionID}`);
  };
  const handleClickEdit = async () => {
    dispatch(setHomeSessionEdit(true));
    await router.push(`/patients/${value.PatientID}/home-session/${value.HomeSessionID}?edit=true`);
  };
  const onDelete = () => setAlert(true);
  const onHandleConfirm = async () => {
    dispatch(updateHomeSession({
      data: {
        ResourceTitle: value.ResourceTitle,
        ResourceDescription: value.ResourceDescription,
        ResourceType: value.ResourceType,
        ResourceURL: value.ResourceURL,
        Status: 0,
      },
      HomeSessionID: value.HomeSessionID,
      PatientID: value.PatientID,
      msg: "Deleted successfully",
    }));
    setAlert(false);
  };
  const onHandleDelete = () => setAlert(false);

  const handleShareLink = async () => {
    setShareLoading(true);
    try {
      const { data } = await generateHomeSessionShareLinkService(value.HomeSessionID);
      const token = data.results.token;
      const url = `${window.location.origin}/home-session/view?token=${encodeURIComponent(token)}`;
      setShareUrl(url);
      setShareModal(true);
    } catch (e) {
      ToastNotification("error", "Could not generate share link");
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: value.ResourceTitle, url: shareUrl });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="dropdown float-right">
      <Dropdown direction="right" isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle color="light" className="btn-rounded more_vert_btn" caret>
          <i className="mdi mdi-dots-vertical"></i>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-right-custom" style={{ marginBottom: "-100%", marginRight: "25%" }}>
          <DropdownItem onClick={handleClickView}>View Details</DropdownItem>
          <DropdownItem onClick={handleClickEdit}>Edit</DropdownItem>
          <DropdownItem onClick={handleShareLink} disabled={shareLoading}>
            {shareLoading ? "Generating..." : <><i className="mdi mdi-share-variant me-1"></i>Share Link</>}
          </DropdownItem>
          <DropdownItem onClick={onDelete}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {alert && <Alert onHandleConfirm={onHandleConfirm} onDelete={onHandleDelete} />}

      <Modal isOpen={shareModal} toggle={() => { setShareModal(false); setCopied(false); }} centered size="md">
        <ModalHeader toggle={() => { setShareModal(false); setCopied(false); }}>
          Share Home Session with Parent
        </ModalHeader>
        <ModalBody>
          <p className="text-muted small mb-2">
            Send this link to the parent. They can open it in any browser — no login required.
          </p>
          <p className="mb-2"><strong>{value.ResourceTitle}</strong></p>
          <InputGroup>
            <Input value={shareUrl} readOnly style={{ fontSize: 13 }} />
            <Button color={copied ? "success" : "secondary"} onClick={handleCopy} title="Copy link">
              <i className={`mdi ${copied ? "mdi-check" : "mdi-content-copy"}`}></i>
            </Button>
            <Button color="info" onClick={handleShare} title="Share">
              <i className="mdi mdi-share-variant"></i>
            </Button>
          </InputGroup>
          <p className="text-muted mt-2" style={{ fontSize: 12 }}>
            <i className="mdi mdi-clock-outline me-1"></i>Link expires in 30 days.
          </p>
        </ModalBody>
      </Modal>
    </div>
  );
}
export default ResourceActions;
