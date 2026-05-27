import React from "react";
import TextConfig from "../../../../patient-management/view-patient/session/textConfig.component";
import { useSelector } from "react-redux";
import { DetailsSessionListData } from "../../../../../store/slice/patient.slice";

const ActivityInstructions = () => {

  const data = useSelector(DetailsSessionListData);

  return (
    <>
      {data[0]?.ActivityInstructionTitle && data[0]?.ActivityInstructionDescription ? <>
        {data[0]?.ActivityInstructionTitle ? <div className="mb-4" style={{ paddingTop: "2%" }}>
          <TextConfig value={data[0]?.ActivityInstructionTitle} label={"Activity Instruction Title"} />
        </div> : null}
        {data[0]?.ActivityInstructionDescription ? <div className="mb-4" style={{ paddingTop: "1%" }}>
          <TextConfig value={data[0]?.ActivityInstructionDescription} label={"Activity Instruction Description"} />
        </div> : null}
      </> : "No Data Found"}
    </>
  );
};

export default ActivityInstructions;
