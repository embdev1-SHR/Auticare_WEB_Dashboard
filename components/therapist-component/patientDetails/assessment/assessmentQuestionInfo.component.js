import { useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const AssessmentQuestionInformations = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <>
      <span className="info_ico" data-toggle="modal" data-target=".question_info" onClick={toggleModal}>
        <i className="ri-information-line"></i>
      </span>
      <Modal className="question_info app_modal" tabIndex="-1" role="dialog" aria-hidden="true" centered={true} isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Basic Language & Learning Skills</ModalHeader>
        <ModalBody className="pt-2">
          <div className="notes_block mb-3">
            <h6 className="form-label mb-1 text-primary">Task Name</h6>
            <p>Cooperation & Reinforcer Effectiveness</p>
          </div>
          <div className="notes_block mb-3">
            <h6 className="form-label mb-1 text-primary">Task Objective</h6>
            <p>When offered a known reinforcing item or activity, the student will take/ use the item or activity.</p>
          </div>
          <div className="notes_block mb-3">
            <h6 className="form-label mb-1 text-primary">Question</h6>
            <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas?</p>
          </div>
          <div className="notes_block mb-3">
            <h6 className="form-label mb-1 text-primary">Criteria</h6>
            <p>
              2= takes within 3 seconds all the time,
              <br />
              1= either not all the time or takes more than 3 seconds to respond
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-light btn-md waves-effect waves-light action_btn" onClick={toggleModal}>
            Cancel
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AssessmentQuestionInformations;
