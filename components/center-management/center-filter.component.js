import { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function CenterFilterModal() {
  const [modalOpen, setModalOpen] = useState(false);

  const tog_standard = () => {
    setModalOpen(!modalOpen);
    removeBodyCss();
  };
  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };
  return (
    <>
      <Button
        type="button"
        onClick={tog_standard}
        color="light"
        className="waves-effect waves-light"
      >
        <i className="ri-filter-3-line align-middle mr-2"></i>
        Filter
      </Button>
      <Modal isOpen={modalOpen} toggle={tog_standard}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          Filter
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-4">
                <label className="form-label required">Center Type</label>
                <select className="form-control">
                  <option>Select</option>
                  <option>Text</option>
                  <option>Video</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-4">
                <label className="form-label required">Areas</label>
                <select className="form-control">
                  <option>Select</option>
                </select>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            onClick={tog_standard}
            color="light"
            className="waves-effect"
          >
            Cancel
          </Button>
          <Button
            type="button"
            color="primary"
            className="waves-effect waves-light"
          >
            Apply
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default CenterFilterModal;
