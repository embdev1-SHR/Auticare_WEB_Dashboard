import { useState } from "react";
import Select from "react-select";
import { Button, Col, Input, Label, Row } from "reactstrap";

function UserBasicDetails() {
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
        { label: "Toilet Paper", value: "Toilet Paper" },
      ],
    },
  ];

  const handleMulti = (selectedMulti) => {
    setSelectedMulti(selectedMulti);
  };

  return (
    <div>
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
      {/* <h6 className="mb-3">Address</h6> */}
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

      <div className="mb-4">
        <Label className="form-label required" htmlFor="address">
          Address
        </Label>
        <Input
          type="text"
          className="form-control"
          id="address"
          placeholder="Enter address"
        />
      </div>

      <div className="container-action d-flex justify-content-end">
        <Button
          type="button"
          color="primary"
          className="btn-md waves-effect waves-light action_btn"
        >
          Edit Details
        </Button>
      </div>
    </div>
  );
}
export default UserBasicDetails;
