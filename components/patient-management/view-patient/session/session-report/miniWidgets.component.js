import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { miniWidgetData } from "../../../patient/features/sessionData.component";

const MiniWidgets = () => {
  return (
    <Row>
      <Col md={3}>
        <Card>
          <CardBody>
            <div className='d-flex'>
              <div className='flex-1 overflow-hidden'>
                <p className='text-truncate font-size-14 mb-2'>No</p>
                <h4 className='mb-0'>{miniWidgetData.No}</h4>
              </div>
              <span className='badge badge-soft-info my-1' style={{ fontSize: 30 }}>
                <i className={"ri  ri-bar-chart-line font-size-24"} style={{ position: "relative", top: "10%" }}></i>
              </span>
              {/* <div className='text-primary'>
                <i className={"ri ri-stack-line font-size-24"}></i>
              </div> */}
            </div>
          </CardBody>
          {/* <CardBody className='border-top py-3'>
          <div className='text-truncate'>
            <span className='badge badge-soft-success font-size-11 me-1'>
              <i className='mdi mdi-menu-up'> </i> 20
            </span>
            <span className='text-muted ms-2'>dknwhdwdwdk</span>
          </div>
        </CardBody> */}
        </Card>
      </Col>
      <Col md={3}>
        <Card>
          <CardBody>
            <div className='d-flex'>
              <div className='flex-1 overflow-hidden'>
                <p className='text-truncate font-size-14 mb-2'>Prompted</p>
                <h4 className='mb-0'>{miniWidgetData.Prompted}</h4>
              </div>
              <span className='badge badge-soft-primary my-1' style={{ fontSize: 30 }}>
                <i className={"ri ri-volume-down-line font-size-24"} style={{ position: "relative", top: "10%" }}></i>
              </span>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col md={3}>
        <Card>
          <CardBody>
            <div className='d-flex'>
              <div className='flex-1 overflow-hidden'>
                <p className='text-truncate font-size-14 mb-2'>Correct</p>
                <h4 className='mb-0'>{miniWidgetData.Correct}</h4>
              </div>
              <span className='badge badge-soft-success my-1' style={{ fontSize: 30 }}>
                <i className={"ri  ri-checkbox-circle-line font-size-24"} style={{ position: "relative", top: "10%" }}></i>
              </span>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col md={3}>
        <Card>
          <CardBody>
            <div className='d-flex'>
              <div className='flex-1 overflow-hidden'>
                <p className='text-truncate font-size-14 mb-2'>Incorrect</p>
                <h4 className='mb-0'>{miniWidgetData.Incorrect}</h4>
              </div>
              <span className='badge badge-soft-danger my-1' style={{ fontSize: 30 }}>
                <i className={"ri ri-close-circle-line font-size-24"} style={{ position: "relative", top: "10%" }}></i>
              </span>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default MiniWidgets;
