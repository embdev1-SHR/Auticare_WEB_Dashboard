import { useState } from "react";
import { Modal, ModalFooter, ModalHeader, ModalBody } from "reactstrap";

const AssessmentQuestionInformations = ({data}) => {
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
        <ModalHeader toggle={toggleModal}>{data.CategoryName}</ModalHeader>
        <ModalBody className="pt-2">
          <div className="notes_block mb-3">
            <h6 className="form-label mb-1 text-primary">Task Name</h6>
            <p>{data?.TaskName}</p>
          </div>
          <div className="notes_block mb-3">
            <h6 className="form-label mb-1 text-primary">Task Objective</h6>
            <p>{data.TaskObjective}</p>
          </div>
          <div className="notes_block mb-3">
            <h6 className="form-label mb-1 text-primary">Question</h6>
            <p>{data.Question}</p>
          </div>
          <div className="notes_block mb-3">
            <h6 className="form-label mb-1 text-primary">Criteria</h6>
            <p>{data.Criteria}
            </p>
          </div>
          <div className="notes_block mb-3">
            <h6 className="form-label mb-1 text-primary">Example</h6>
            <p>{data.Example}
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-light btn-md waves-effect waves-light action_btn" onClick={toggleModal}>
            Close
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AssessmentQuestionInformations;
