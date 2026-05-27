import { useState } from "react";
import { TabContent, TabPane } from "reactstrap";
import { AssessmentData } from "../../patient/features/assessmentData.component";
import AssessmentList from "./assessmentListDomain.component";
import AssessmentListTests from "./assessmentListTest.component";
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
      <div className="tab_data_header">
        <div className="tab_title">
          <h3>Assessment List</h3>
        </div>
        <StartAssessment />
      </div>

      <div className="vertical_tab">
        <div className="tab_grid">
          <AssessmentList AssessmentData={AssessmentData} activeTab={activeTab} toggleTab={toggleTab} />

          <TabContent activeTab={activeTab} className="p-0 text-muted" id="v-tabContent">
            {AssessmentData.map((Assessment, key) => {
              return (
                <TabPane key={key} tabId={key + 1} role="tabpanel">
                  <div className="tab_data_table table-responsive">
                    <AssessmentListTests AssessmentQuestions={Assessment.Questions} />
                  </div>
                </TabPane>
              );
            })}
          </TabContent>
        </div>
      </div>
    </>
  );
};

export default Assessment;
