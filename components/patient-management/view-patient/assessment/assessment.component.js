import { useState } from "react";
import AssessmentMainList from "./assessmentList.component";
import StartAssessment from "./startAssessment.component";

const Assessment = () => {
  const [activeTab, setActiveTab] = useState(1);
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  return (
    <>
      <div className='tab_data_header'>
        <div className='tab_title'>
          <h3>Assessment List</h3>
        </div>
        <StartAssessment />
      </div>
      <AssessmentMainList />
    </>
  );
};

export default Assessment;
