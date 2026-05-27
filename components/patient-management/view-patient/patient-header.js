/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
//SweetAlert
// import SweetAlert from "react-bootstrap-sweetalert";
// import { Button, Label } from "reactstrap";
import BreadcrumbComponent from "../../shared/breadcrumb";
import patientImage from "../../../public/images/users/patient_dummy.jpg";
// import { useState } from "react";

function PatientHeader({ patient }) {
console.log("2",patient);
  return (
    <div className='patient_card'>
      <div className='patient_details'>
        {/* <div className='user_pic'>
          <Image src={patientImage} height={140} width={140} alt='' />
        </div> */}
        <div className='user_basic'>
          <h2>{patient.PatientName}</h2>
          <BreadcrumbComponent other={"p-0"} name={patient[0]?.PatientName}/>
        </div>
      </div>

      {/* <div className='patient_plan'>
        <div className='plan_grid'>
          <div className='plan_ico'>
            <i className='ri-heart-line'></i>
          </div>
          <div className='plan_dtl'>
            <label>Current Plan</label>
            <h4>Primary app plan</h4>
          </div>
        </div>
        <div className='plan_grid'>
          <div className='plan_ico'>
            <i className='ri-calendar-line'></i>
          </div>
          <div className='plan_dtl'>
            <label>Due Date</label>
            <h4>12 Sep, 2022</h4>
          </div>
        </div>
        <div className='plan_grid'>
          <div className='plan_ico'>
            <i className='ri-line-chart-line'></i>
          </div>
          <div className='plan_dtl'>
            <label>Plan Progress</label>
            <div className='plan_progress'>
              <div className='progress animated-progess'>
                <div className='progress-bar bg-success' role='progressbar' style={{ width: "75%" }} aria-valuenow='75' aria-valuemin='0' aria-valuemax='100'></div>
              </div>
              <span>75%</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className='card_action justify-content-end'>
        <Button
          type='button'
          className='btn btn-danger waves-effect waves-light'
          onClick={() => {
            setSuspendAlert(true);
          }}>
          Suspend
        </Button>
      </div> */}
      {/* {suspendAlert ? (
        <SweetAlert
          title='Are you sure to suspend?'
          confirmBtnText='Yes'
          cancelBtnText='No'
          closeOnClickOutside={false}
          warning
          showCancel
          confirmBtnBsStyle='success'
          cancelBtnBsStyle='danger'
          onConfirm={() => {
            setSuspendAlert(false);
          }}
          onCancel={() => {
            setSuspendAlert(false);
          }}></SweetAlert>
      ) : null} */}
    </div>
  );
}
export default PatientHeader;
