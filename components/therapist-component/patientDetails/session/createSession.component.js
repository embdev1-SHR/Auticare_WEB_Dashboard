import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label, Row, Col } from "reactstrap";
import ActivitiesList from "./activitesList.component";

const CreateSession = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  return (
    <>
      <Button type='button' color='primary' className='btn-md waves-effect waves-light action_btn' onClick={toggleModal}>
        Create Session
      </Button>
      <Modal isOpen={modalOpen} toggle={toggleModal} className='modal right session app_modal' tabIndex='-1' role='dialog' scrollable={true}>
        <ModalHeader>
          Create Session
          <Button type='button' className='close' data-dismiss='modal' aria-label='Close' onClick={toggleModal}>
            <i className='ri-close-line'></i>
          </Button>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md={12}>
              <div className='mb-4'>
                <Label className='form-label required'>Session Name</Label>
                <Input type='text' className='form-control' placeholder='Enter session name' />
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <div className='mb-4'>
                <Label className='form-label required'>Session Date</Label>
                <Input type='text' className='form-control' placeholder='Select date' />
              </div>
            </Col>
            <Col md={6}>
              <div className='mb-4'>
                <Label className='form-label required'>Session Type</Label>
                <Input type='text' className='form-control' placeholder='Select type' />
              </div>
            </Col>
          </Row>
          <Row>
            <div className='mb-4'>
              <Label className='form-label required'>Activities</Label>
              <ActivitiesList />
            </div>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type='button' className='btn btn-md waves-effect waves-light action_btn' color='light' onClick={toggleModal}>
            Cancel
          </Button>
          <Button className='btn btn-md waves-effect waves-light action_btn' color='primary'>
            Create Session
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CreateSession;
