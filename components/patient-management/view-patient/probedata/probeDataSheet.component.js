import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ProbeData } from "../../../therapist-component/patient/features/probeData.component";
import ProbeDataSheetDate from "./probeDataSheetDate.component";
import ProbeDataTargetList from "./probeDataSheetTargetList.component";
import CreateTarget from "./createTarget.component";
import { patientIsLoading, probeDataList } from "../../../../store/slice/patient.slice";
import { useDispatch } from "react-redux";
import Loader from "../../../../components/shared/loader";
import { useSelector } from "react-redux";

const ProbeDataSheet = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { PatientId } = router.query;
  const [activeTab, setActiveTab] = useState(1);
  const loading = useSelector(patientIsLoading);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    dispatch(probeDataList(PatientId));
  }, [dispatch]);

  return (
    <>
      <div className='tab_data_header'>
        <div className='tab_title'>
          <h3>Prob Datasheet List</h3>
        </div>
        <div className='tab_actions'>
          {/* <button type='button' className='btn btn-primary btn-md waves-effect waves-light action_btn' onClick={() => router.push(`${PatientId}/probdata`)}>
            Start Prob Data
          </button> */}
          <CreateTarget />
        </div>
      </div>
      {/* <div className='vertical_tab'>
        <div className='tab_grid'> */}
      {/* <ProbeDataSheetDate ProbeData={ProbeData} activeTab={activeTab} toggleTab={toggleTab} /> */}
      
      {loading ? (
          <Loader />
        ) : (
      <ProbeDataTargetList />
      )}
      {/* <div className='tab-content p-0 text-muted'>
        <div className='tab-pane active' id='prob_item1' role='tabpanel'>
          <div className='tab_data_table table-responsive'></div>
        </div>
      </div> */}
      {/* </div>
      </div> */}
    </>
  );
};

export default ProbeDataSheet;
