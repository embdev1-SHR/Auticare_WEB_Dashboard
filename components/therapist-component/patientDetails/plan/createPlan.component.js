import "flatpickr/dist/flatpickr.css";
import { useState } from "react";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { Button, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import GoalsLibrary from "./goalsLibrary.component";

const CreatePlan = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMulti, setSelectedMulti] = useState(null);

  const optionGroup = [
    {
      label: "Picnic",
      options: [
        { label: "Mustard", value: "Mustard" },
        { label: "Ketchup", value: "Ketchup" },
        { label: "Relish", value: "Relish" },
      ],
    },
    {
      label: "Camping",
      options: [
        { label: "Tent", value: "Tent" },
        { label: "Flashlight", value: "Flashlight" },
      ],
    },
  ];
  const handleMulti = (selectedMulti) => {
    setSelectedMulti(selectedMulti);
  };

  const tog_standard = () => {
    setModalOpen(!modalOpen);
  };
  return (
    <>
      <Button type='button' onClick={tog_standard} color='primary' className='waves-effect waves-light mb-4'>
        Create Plan
      </Button>
      <Modal isOpen={modalOpen} toggle={tog_standard} scrollable={true} className='modal right app_modal'>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>Create Plan</ModalHeader>
        <ModalBody>
          <Row>
            <Col lg='6'>
              <div className='mb-4'>
                <Label className='form-label required' htmlFor='plan-name'>
                  Plan Name
                </Label>
                <Input type='text' className='form-control' id='plan-name' placeholder='Enter plan name' />
              </div>
            </Col>
            <Col lg='6'>
              <div className='mb-4'>
                <Label className='form-label required' htmlFor='accreditation'>
                  Plan Duration
                </Label>
                <Row>
                  <Col lg='6'>
                    <Flatpickr
                      className='form-control'
                      placeholder='from'
                      options={{
                        altInput: true,
                        altFormat: "j M, Y",
                        dateFormat: "Y-m-d",
                      }}
                    />
                  </Col>
                  <Col lg='6'>
                    <Flatpickr
                      className='form-control'
                      placeholder='to'
                      options={{
                        altInput: true,
                        altFormat: "j M, Y",
                        dateFormat: "Y-m-d",
                      }}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='plan-name'>
              Type of Therapy
            </Label>
            <Select value={selectedMulti} isMulti={true} onChange={handleMulti} options={optionGroup} classNamePrefix='select2-selection' />
          </div>
          <Row>
            <div className='mb-4'>
              <GoalsLibrary />
            </div>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type='button' color='primary' className='btn-md m-1 waves-effect waves-light action_btn'>
            Create Plan
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CreatePlan;
