import React from "react";
import { Row, Col, Label, Input, Button } from "reactstrap";
import AddField from "../../../../patient-management/view-patient/session/addField.component";
import BehaviorListComponent from "../BehaviourList.component";
import { useSelector } from "react-redux";
import { TrailData } from "../../../../../store/slice/patient.slice";

const BehaviourData = () => {
  const TrailValue = useSelector(TrailData);

  return (
    <>
      {TrailValue[0]?.IsFinished === 1 ? <></> : <AddField></AddField>}
      <BehaviorListComponent></BehaviorListComponent>
    </>
  );
};

export default BehaviourData;
