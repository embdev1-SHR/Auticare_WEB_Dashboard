import React from "react";
import { Button, Col, Label, Row } from "reactstrap";
import AddFieldMand from "../../../../patient-management/view-patient/session/addFieldMand.component";
import MandListComponent from "../mandList.component";
import { useSelector } from "react-redux";
import { TrailData } from "../../../../../store/slice/patient.slice";

const MandData = () => {
  const TrailValue = useSelector(TrailData);

  return (
    <>
      {TrailValue[0]?.IsFinished === 1 ? <></> :<AddFieldMand />}
      <MandListComponent></MandListComponent>
    </>
  );
};

export default MandData;
