import React from "react";
import { Row, Col, Label, Input, Button } from "reactstrap";

const BehaviourData = () => {
  return (
    <>
      <Row>
        <Col md='8'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='ClientID'>
              Behaviour Name
            </Label>
            <Input type='text' className='form-control' id='ClientID' name='ClientID' />
          </div>
        </Col>

        <Col md='3'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='EmailId'>
              Timer
            </Label>
            <Input type='email' className='form-control' id='EmailId' name='EmailId' placeholder='Enter email id' />
          </div>
        </Col>
        <Col md='1 text-center'>
          <div className='mb-4'>
            <Button style={{ position: "absolute", top: "25%", left: "25%", borderRadius: "50%" }} color='success'>
              <i className='mdi mdi-plus-thick'></i>
            </Button>
            {/* <Button style={{ position: "absolute", top: "25%", left: "25%", borderRadius: "50%" }} color='danger'>
              <i className='mdi mdi-trash-can'></i>
            </Button> */}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default BehaviourData;
