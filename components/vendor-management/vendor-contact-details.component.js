import { Col, Input, Label, Row } from "reactstrap";

function VendorContactDetails() {
  return (
    <div>
      <Row>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label required">Full Name</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="enter full name"
            />
          </div>
        </Col>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label required">Email ID</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="enter email id"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label required">Phone Number</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="enter phone no"
            />
          </div>
        </Col>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label required">Designation</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="enter designation"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
export default VendorContactDetails;
