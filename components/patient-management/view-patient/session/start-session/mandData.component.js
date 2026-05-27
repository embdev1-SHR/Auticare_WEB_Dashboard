import React from "react";
import { Button, Col, Label, Row } from "reactstrap";

const MandData = () => {
  return (
    <>
      <Row>
        <Col md='11'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='ClientID'>
              Mand Name
            </Label>
            <textarea type='text' className='form-control' rows={3} id='ClientID' name='ClientID' />
          </div>
        </Col>

        <Col md='1 text-center'>
          <div className='my-4'>
            <Button style={{ borderRadius: "50%" }} size='sm' color='success' className='m-1'>
              <i className='mdi mdi-plus-thick'></i>
            </Button>
            <Button style={{ borderRadius: "50%" }} size='sm' color='primary'>
              <i className='ri ri-check-line'></i>
            </Button>
            {/* <Button style={{ borderRadius: "50%" }} color='danger'>
          <i className='mdi mdi-trash-can'></i>
        </Button> */}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default MandData;
