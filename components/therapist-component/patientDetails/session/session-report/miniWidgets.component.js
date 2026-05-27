import React from "react";
import { useSelector } from "react-redux";
import { Card, CardBody, Col, Row } from "reactstrap";
import { DetailsSessionListData } from "../../../../../store/slice/patient.slice";

const MiniWidgets = ({listData}) => {

  const data = useSelector(DetailsSessionListData);


let sumOfNoOfPrompts = 0;
let sumOfNoOfSuccess = 0;
let sumOfNoOFails = 0;

for (let i = 0; i < listData.length; i++) {
  sumOfNoOfPrompts += listData[i].NoOfPrompts || 0;
}
for (let i = 0; i < listData.length; i++) {
  sumOfNoOfSuccess += listData[i].NoOfSuccess || 0;
}
for (let i = 0; i < listData.length; i++) {
  sumOfNoOFails += listData[i].NoOfFail || 0;
}



  return (
    <Row>
      <Col md={3}>
        <Card>
          <CardBody>
            <div className='d-flex'>
              <div className='flex-1 overflow-hidden'>
                <p className='text-truncate font-size-14 mb-2'>Session No</p>
                <h4 className='mb-0'>{data[0]?.SessionID}</h4>
              </div>
              <span className='badge badge-soft-info my-1' style={{ fontSize: 30 }}>
                <i className={"ri  ri-bar-chart-line font-size-24"} style={{ position: "relative", top: "10%" }}></i>
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
                <p className='text-truncate font-size-14 mb-2'>Prompted</p>
                <h4 className='mb-0'>{sumOfNoOfPrompts}</h4>
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
                <h4 className='mb-0'>{sumOfNoOfSuccess}</h4>
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
                <h4 className='mb-0'>{sumOfNoOFails}</h4>
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
