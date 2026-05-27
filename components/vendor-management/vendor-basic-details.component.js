import { Col, Input, Label, Row } from "reactstrap";

import DropZoneForm from "../shared/dropzoneform";

function VendorBasicDetails() {
  return (
    <div>
      <div className="mb-4">
        <Label className="form-label required" htmlFor="client-name">
          Vendor Name
        </Label>
        <Input
          type="text"
          className="form-control"
          id="vendor-name"
          placeholder="Enter vendor name"
        />
      </div>

      <div className="mb-4">
        <Label className="form-label required" htmlFor="vendor-logo">
          Vendor Logo
        </Label>
        <DropZoneForm />
      </div>

      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="vendor-id">
              Vendor ID
            </Label>
            <Input
              type="text"
              className="form-control"
              id="vendor-id"
              disabled
            />
          </div>
        </Col>
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
      </Row>
      <h6 className="mb-3">Address</h6>
      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label
              className="form-label required"
              htmlFor="basicpill-address-input1"
            >
              Address Line 1
            </Label>
            <Input
              type="text"
              className="form-control"
              id="basicpill-address-input1"
              placeholder="Enter address line 1"
            />
          </div>
        </Col>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label" htmlFor="basicpill-address-input2">
              Address Line 2
            </Label>
            <Input
              type="text"
              className="form-control"
              id="basicpill-address-input2"
              placeholder="Enter address line 2"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="country">
              Country
            </Label>
            <select className="form-control">
              <option>Select</option>
              <option>India</option>
              <option>Japan</option>
              <option>Australia</option>
            </select>
          </div>
        </Col>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="state">
              State
            </Label>
            <select className="form-control">
              <option>Select</option>
              <option>State 1</option>
              <option>State 2</option>
              <option>State 3</option>
            </select>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label" htmlFor="basicpill-address-input1">
              City
            </Label>
            <Input
              type="text"
              className="form-control"
              id="basicpill-address-input1"
              placeholder="Enter city"
            />
          </div>
        </Col>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label" htmlFor="basicpill-address-input2">
              Pin/Zip
            </Label>
            <Input
              type="text"
              className="form-control"
              id="basicpill-address-input2"
              placeholder="Enter zip/pin"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label" htmlFor="basicpill-address-input1">
              Website URL
            </Label>
            <Input
              type="text"
              className="form-control"
              id="basicpill-address-input1"
              placeholder="Enter url"
            />
          </div>
        </Col>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="vendor-type">
              Vendor type
            </Label>
            <select className="form-control">
              <option>Select</option>
              <option>Software</option>
              <option>Hardware</option>
            </select>
          </div>
        </Col>
      </Row>
      <div className="mb-4">
        <Label className="form-label required mb-3">Category </Label>
        <select className="form-control">
          <option>Select</option>
          <option>Lowtech</option>
          <option>Midtech</option>
          <option>Hitech</option>
        </select>
      </div>
    </div>
  );
}
export default VendorBasicDetails;
