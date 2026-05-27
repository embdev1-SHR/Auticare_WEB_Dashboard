
import Image from "next/image";
import { Button, Label } from "reactstrap";
import UserImage from "../../public/images/users/avatar-3.jpg";
import Breadcrumb from "../shared/breadcrumb";

function UserHeader() {
  return (
    <div className="patient_card">
      <div className="patient_details">
        <div className="user_pic">
          <Image src={UserImage} alt="profile picture" />
          {/* <img src="/images/users/avatar-3.jpg" /> */}
        </div>
        <div className="user_basic">
          <h2>Leanne Graham</h2>
          <Breadcrumb other={"p-0"} />
        </div>
      </div>
      <div className="patient_plan">
        <div className="plan_grid">
          <div className="plan_ico">
            <i className="ri-heart-line"></i>
          </div>
          <div className="plan_dtl">
            <Label>Current Plan</Label>
            <h4>Primary app plan</h4>
          </div>
        </div>
        <div className="plan_grid">
          <div className="plan_ico">
            <i className="ri-calendar-line"></i>
          </div>
          <div className="plan_dtl">
            <Label>Due Date</Label>
            <h4>12 Sep, 2022</h4>
          </div>
        </div>
        <div className="plan_grid">
          <div className="plan_ico">
            <i className="ri-line-chart-line"></i>
          </div>
          <div className="plan_dtl">
            <Label>Plan Progress</Label>
            <div className="plan_progress">
              <div className="progress animated-progess">
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: "75%" }}
                  aria-valuenow="75"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <span>75%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="card_action justify-content-end">
        <Button
          type="button"
          className="btn btn-danger waves-effect waves-light"
        >
          Suspend
        </Button>
      </div>
    </div>
  );
}
export default UserHeader;
