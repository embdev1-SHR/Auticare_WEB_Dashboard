import React from "react";
import { Button, Card, CardBody, CardFooter, Col, Label, Row } from "reactstrap";

const SessionDetails = () => {
  return (
    <>
      <Card color='light'>
        <CardBody>
          <Row>
            <Col md={6}>
              <Label className='form-label text-secondary'>Session Name</Label>
              <h6 className='mb-3'>Strike while you can</h6>
            </Col>
            <Col md={6}>
              <Label className='form-label text-secondary'>Session Date</Label>
              <h6 className='mb-3'>12 July 2022</h6>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Label className='form-label text-secondary'>Session Type</Label>
              <h6 className='mb-3'>VR Therapy</h6>
            </Col>
            <Col md={6}>
              <Label className='form-label text-secondary'>Activity Name</Label>
              <h6 className='mb-3'>VR Session</h6>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <div className='text-center my-5'>
        <Button color='danger' size='lg' className='waves-effect waves-light' outline>
          <i className='ri-tape-line align-middle ms-2'></i> Start VR
        </Button>
      </div>
    </>
  );
};

export default SessionDetails;
