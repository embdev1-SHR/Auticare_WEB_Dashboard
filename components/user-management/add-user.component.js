import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import {
  selectSetModalOpenState,
  setModalOpen,
} from "../../store/slice/layout.slice";

function AddUser() {
  const [selectedMulti, setSelectedMulti] = useState(null);

  const dispatch = useDispatch();
  const setModalOpenState = useSelector(selectSetModalOpenState);

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
        { label: "Toilet Paper", value: "Toilet Paper" },
      ],
    },
  ];

  const tog_standard = () => {
    dispatch(setModalOpen(!setModalOpenState));
  };

  const handleMulti = (selectedMulti) => {
    setSelectedMulti(selectedMulti);
  };

  return (
    <>
      <Button
        type="button"
        onClick={tog_standard}
        color="primary"
        className="waves-effect waves-light"
      >
        Add user
      </Button>
      <Modal
        isOpen={setModalOpenState}
        toggle={tog_standard}
        scrollable={true}
        className="modal right app_modal"
      >
        <ModalHeader toggle={() => dispatch(setModalOpen(!setModalOpenState))}>
          Add user
        </ModalHeader>
        <ModalBody>
          <div className="mb-4">
            <Label className="form-label required" htmlFor="full-name">
              Full Name
            </Label>
            <Input
              type="text"
              className="form-control"
              id="full-name"
              placeholder="Enter full name"
            />
          </div>

          <Row>
            <Col lg="6">
              <div className="mb-4">
                <Label className="form-label required" htmlFor="salutation">
                  Salutation
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="salutation"
                  placeholder="Enter salutation"
                />
              </div>
            </Col>
            <Col lg="6">
              <div className="mb-4">
                <Label className="form-label required" htmlFor="designation">
                  Designation
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="designation"
                  placeholder="Enter designation"
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg="6">
              <div className="mb-4">
                <Label className="form-label required" htmlFor="email-id">
                  Email ID
                </Label>
                <Input
                  type="email"
                  className="form-control"
                  id="email-id"
                  placeholder="Enter email id"
                />
              </div>
            </Col>
            <Col lg="6">
              <div className="mb-4">
                <Label className="form-label required" htmlFor="phone-number">
                  Phone Number
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="phone-number"
                  placeholder="Enter phone number"
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg="6">
              <div className="mb-4">
                <Label className="form-label required" htmlFor="user-password">
                  Password
                </Label>
                <Input
                  type="password"
                  className="form-control"
                  id="user-password"
                  placeholder="Enter password"
                />
              </div>
            </Col>
            <Col lg="6">
              <div className="mb-4">
                <Label className="form-label required" htmlFor="roles">
                  Roles
                </Label>
                <Select
                  value={selectedMulti}
                  isMulti={true}
                  onChange={handleMulti}
                  options={optionGroup}
                  classNamePrefix="select2-selection"
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Label className="form-label required" htmlFor="address">
              Address
            </Label>
            <Input
              type="text"
              className="form-control"
              id="address"
              placeholder="Enter address"
            />
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            color="primary"
            className="btn-md m-1 waves-effect waves-light action_btn"
          >
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
export default AddUser;
