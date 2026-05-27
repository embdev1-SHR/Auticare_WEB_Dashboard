import Link from "next/link";
import { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const StartScreening = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  return (
    <>
      <Button
        type="button"
        className="btn-md waves-effect waves-light action_btn"
        color="primary"
        data-toggle="modal"
        data-target="start_screening_modal"
        onClick={toggleModal}
      >
        Start Screening
      </Button>
      <Modal className="start_screening_modal app_modal" tabIndex="-1" role="dialog" aria-hidden="true" isOpen={modalOpen} toggle={toggleModal} centered={true}>
        <ModalHeader toggle={toggleModal}>Start Screening</ModalHeader>
        <ModalBody>
          <div className="mb-4">
            <label className="form-label">Choose Scale</label>
            <select className="form-control" defaultValue={"ISSA"}>
              <option>Select scale</option>
              <option>ISSA</option>
              <option>Scale 2</option>
              <option>Scale 3</option>
            </select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="light" className="btn-md waves-effect waves-light action_btn" onClick={toggleModal}>
            Cancel
          </Button>

          <Link href="start-screening">
            <a className="btn btn-primary btn-md waves-effect waves-light action_btn">Continue</a>
          </Link>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default StartScreening;
