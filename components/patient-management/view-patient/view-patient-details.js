import { useEffect, useState } from "react";

import { TabContent, TabPane } from "reactstrap";

import { useRouter } from "next/router";

import { ActiveTab,  ActiveTabSlice, fetchPatientMetrics, selectpatientIsEdit, setCustomActiveTab } from "../../../store/slice/patient.slice";
import { useDispatch, useSelector } from "react-redux";
import BasicDetails from "./basic-details.component";
import PatientTabNavigation from "./patientTab-navigation-component";
import { getAllCountries } from "../../../store/slice/common.slice";
import HistoricalData from "./historicalData.component";
import Screening from "./screening/screening.component";
import Assessment from "./assessment/assessment.component";
import Plan from "./plan/Plan.component";
import Sessions from "./session/sessions.component";
import Reports from "./reports.component";
import ProbeDataSheet from "./probedata/probeDataSheet.component";
import Comments from "./comments/comments.component";
import { selectRoleBasedModules } from "../../../store/slice/auth.slice";
import HomeSession from "./home-session/home-sessions.component";

function ViewPatientDetails() {
  //const [customActiveTab, setCustomActiveTab] = useState(1);
  const customActiveTab = useSelector(ActiveTabSlice);
  const dispatch = useDispatch();
  const router = useRouter();
  const { PatientId } = router.query;
  const isEdit = useSelector(selectpatientIsEdit);



  const roleBasedModules = useSelector(selectRoleBasedModules);
  const isTherapistManagementAccess = roleBasedModules.some(
    (module) => module.ModuleName === "TherapistPatientSection"
  );
  useEffect(() => {
    dispatch(getAllCountries());
  }, [dispatch]);
  // Screening and Assessment list
  useEffect(() => {
    if (PatientId) dispatch(fetchPatientMetrics(PatientId));
  }, [dispatch, PatientId]);

  const toggleCustomJustified = (tab) => {
    if (customActiveTab !== tab) {
      dispatch(setCustomActiveTab(tab));
      //setCustomActiveTab(tab);
    }
  };

  return (
    <>
      <PatientTabNavigation
        customActiveTab={customActiveTab}
        toggleCustomJustified={toggleCustomJustified}
        isTherapistManagementAccess={isTherapistManagementAccess}
      />

      <TabContent activeTab={customActiveTab}>
        <TabPane tabId={1} className="p-3">
          <BasicDetails />
        </TabPane>
        <TabPane tabId={2} className="p-3">
          <HistoricalData />
        </TabPane>
        {isTherapistManagementAccess && !isEdit ? (
          <>
            <TabPane tabId={3} className="p-3">
              <Screening />
            </TabPane>
            <TabPane tabId={4} className="p-3">
              <Assessment />
            </TabPane>
            <TabPane tabId={5} className="p-3">
              <Plan />
            </TabPane>
            <TabPane tabId={6} className="p-3">
              <Sessions />
            </TabPane>
            <TabPane tabId={7} className="p-3">
              <HomeSession />
            </TabPane>
            <TabPane tabId={8} className="p-3">
            <Reports />
            </TabPane>
            <TabPane tabId={9} className="p-3">
            <ProbeDataSheet />
            </TabPane>
            <TabPane tabId={10} className="p-3">
            <Comments />
            </TabPane>
          </>
        ):null}
      </TabContent>
    </>
  );
}

export default ViewPatientDetails;
