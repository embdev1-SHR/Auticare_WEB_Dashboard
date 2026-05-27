import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { UpdateSubscriptionPlans, setEdit } from "../../store/slice/subscription.slice";

function PlanActions({SubscriptionPlanID, data}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();


  const onView = () => {
    dispatch(setEdit(false));
    router.push({
      pathname: "subscriptions/[SubscriptionPlanID]",
      query: { SubscriptionPlanID },
    });
  };

  const onEdit = () => {
    dispatch(setEdit(true));
    router.push({
      pathname: "subscriptions/[SubscriptionPlanID]",
      query: { SubscriptionPlanID },
    });
  };

  const HandleDisable = () => {
    const body = {
      "PlanName": data.PlanName,
      "Contents": data.Contents,
      "NumberOfPlanActiveDays": data.NumberOfPlanActiveDays,
      "Frequency": data.Frequency,
      "NumberofTherapists": data.NumberofTherapists,
      "NumberofPatients": data.NumberofPatients,
      "NumberofCustomScales": data.NumberofCustomScales,
      "NumberofCustomSkills": data.NumberofCustomSkills,
      "NumberofCustomAssessment": data.NumberofCustomAssessment,
      "NumberofCustomContents": data.NumberofCustomContents,
      "Price": data.Price,
      "OnetimeFee": data.OnetimeFee,
      "PlanType": data.PlanType,
      "Status": 0
  }
  const ValueToSend = {
      body,
      SubscriptionPlanID,
      msg:"Disable successfully"
  }
    dispatch(UpdateSubscriptionPlans(ValueToSend));
  };

  const HandleEnable = () => {
    const body = {
      "PlanName": data.PlanName,
      "Contents": data.Contents,
      "NumberOfPlanActiveDays": data.NumberOfPlanActiveDays,
      "Frequency": data.Frequency,
      "NumberofTherapists": data.NumberofTherapists,
      "NumberofPatients": data.NumberofPatients,
      "NumberofCustomScales": data.NumberofCustomScales,
      "NumberofCustomSkills": data.NumberofCustomSkills,
      "NumberofCustomAssessment": data.NumberofCustomAssessment,
      "NumberofCustomContents": data.NumberofCustomContents,
      "Price": data.Price,
      "OnetimeFee": data.OnetimeFee,
      "PlanType": data.PlanType,
      "Status": 1
  }
  const ValueToSend = {
      body,
      SubscriptionPlanID,
      msg:"Enable successfully"
  }
    dispatch(UpdateSubscriptionPlans(ValueToSend));
  };


  return (
    <div className="dropdown float-right">
      <Dropdown
        direction="right"
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
      >
        <DropdownToggle
          color="light"
          className="btn-rounded more_vert_btn"
          caret
        >
          <i className="mdi mdi-dots-vertical"></i>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-right" style={{marginBottom:"-100%",marginRight:"-150%"}}>
          <DropdownItem onClick={onView}>View Details</DropdownItem>
          <DropdownItem onClick={onEdit}>Edit</DropdownItem>
          {data.Status? <DropdownItem onClick={HandleDisable}>Disable</DropdownItem> : <DropdownItem onClick={HandleEnable}>Enable</DropdownItem>}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
export default PlanActions;
