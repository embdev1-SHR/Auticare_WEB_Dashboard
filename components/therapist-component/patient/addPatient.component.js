import { useState } from "react";
import { Button, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
const AddPatient = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    console.log(modalOpen);
    setModalOpen(!modalOpen);
  };
  return (
    <>
      <Button type="button" color="primary" className="btn-md waves-effect waves-light action_btn" onClick={toggleModal}>
        Add Patient
      </Button>
      <Modal isOpen={modalOpen} toggle={toggleModal} className="modal right add_patients app_modal" tabIndex="-1" role="dialog" scrollable={true}>
        <ModalHeader>
          Add Patients
          <Button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={toggleModal}>
            <i className="ri-close-line"></i>
          </Button>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md={4}>
              <div className="mb-4">
                <Label className="form-label required">First Name</Label>
                <Input type="text" className="form-control" placeholder="Enter first name" />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-4">
                <Label className="form-label">Middle Name</Label>
                <Input type="text" className="form-control" placeholder="Enter middle name" />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-4">
                <Label className="form-label required">Last Name</Label>
                <Input type="text" className="form-control" placeholder="Enter last name" />
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <div className="mb-4">
                <Label className="form-label required">Date of Birth</Label>
                <Input
                  type="text"
                  className="form-control"
                  placeholder="select date of birth"
                  data-provide="datepicker"
                  data-date-format="dd M, yyyy"
                  data-date-autoclose="true"
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-4">
                <Label className="form-label required">Gender</Label>
                <select className="form-control">
                  <option>Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <div className="mb-4">
                <Label className="form-label required">Guardian Name</Label>
                <Input type="text" className="form-control" placeholder="Enter guardian name" />
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-4">
                <Label className="form-label required">Guardian Phone No</Label>
                <Input type="text" className="form-control" placeholder="Enter guardian phone no" />
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <div className="mb-4">
                <Label className="form-label required">Facilitator Name</Label>
                <Input type="text" className="form-control" placeholder="Enter facilitator name" />
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-4">
                <Label className="form-label">Center</Label>
                <Input type="text" className="form-control" placeholder="Enter center name" />
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <div className="mb-4">
                <Label className="form-label required">Department Name</Label>
                <Input type="text" className="form-control" placeholder="Enter department name" />
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <div className="mb-4">
                <Label className="form-label required">Problem Details</Label>
                <textarea id="textarea" className="form-control min_equal" rows="5" placeholder="Enter problrm details..."></textarea>
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type="button" className="btn btn-md waves-effect waves-light action_btn" color="light" onClick={toggleModal}>
            Cancel
          </Button>
          <Button className="btn btn-md waves-effect waves-light action_btn" color="primary">
            Add Patients
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AddPatient;
