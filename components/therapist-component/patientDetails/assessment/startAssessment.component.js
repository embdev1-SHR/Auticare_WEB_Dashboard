import Link from "next/link";
import { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const StartAssessment = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <>
      <div className="tab_actions">
        <Button
          className="btn btn-md waves-effect waves-light action_btn"
          color="primary"
          data-toggle="modal"
          data-target=".start_assessment_modal"
          onClick={toggleModal}
        >
          Start Assessment
        </Button>
      </div>

      <Modal
        className="start_assessment_modal app_modal"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
        isOpen={modalOpen}
        toggle={toggleModal}
        centered={true}
      >
        <ModalHeader toggle={toggleModal}>Start Assessment</ModalHeader>
        <ModalBody className="pt-1">
          <div className="mb-4">
            <label className="form-label">Choose Type</label>
            <select className="form-control" defaultValue={"Type 1"}>
              <option>Select type</option>
              <option>Type 1</option>
              <option>Type 2</option>
              <option>Type 3</option>
            </select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="light" className="btn btn-md waves-effect waves-light action_btn" onClick={toggleModal}>
            Cancel
          </Button>
          <Link href="start-assessment">
            <a className="btn btn-primary btn-md waves-effect waves-light action_btn">Continue</a>
          </Link>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default StartAssessment;
