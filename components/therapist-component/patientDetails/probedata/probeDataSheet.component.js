import { useRouter } from "next/router";
import { useState } from "react";
import { ProbeData } from "../../patient/features/probeData.component";
import ProbeDataSheetDate from "./probeDataSheetDate.component";
import ProbeDataTargetList from "./probeDataSheetTargetList.component";

const ProbeDataSheet = () => {
  const router = useRouter();
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
          <h3>Prob Datasheet List</h3>
        </div>
        <div className='tab_actions'>
          <button type='button' className='btn btn-primary btn-md waves-effect waves-light action_btn' onClick={() => router.push("start-probdata")}>
            Start Prob Data
          </button>
        </div>
      </div>

      <div className='vertical_tab'>
        <div className='tab_grid'>
          <ProbeDataSheetDate ProbeData={ProbeData} activeTab={activeTab} toggleTab={toggleTab} />
          <ProbeDataTargetList />
          <div className='tab-content p-0 text-muted'>
            <div className='tab-pane active' id='prob_item1' role='tabpanel'>
              <div className='tab_data_table table-responsive'></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProbeDataSheet;
