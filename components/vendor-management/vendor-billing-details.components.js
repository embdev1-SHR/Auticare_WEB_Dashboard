import { Col, Input, Label, Row } from "reactstrap";

function VendorBillingDetails() {
  return (
    <div>
      <h6 className="mb-3">Billing Address</h6>
      <Row>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label required">Address Line 1</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="enter address line 1"
            />
          </div>
        </Col>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label">Address Line 2</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="enter address line 2"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label required">Country</Label>
            <select className="form-control">
              <option>Select</option>
              <option>India</option>
              <option>Japan</option>
              <option>Australia</option>
            </select>
          </div>
        </Col>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label required">State</Label>
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
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label required">GST Number</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="enter gst no"
            />
          </div>
        </Col>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label">Bank Account Number</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="enter account no"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label">IFSC Code</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="enter ifsc code"
            />
          </div>
        </Col>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label">Bank Branch</Label>
            <Input
              type="text"
              className="form-control"
              placeholder="enter branch"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
export default VendorBillingDetails;
