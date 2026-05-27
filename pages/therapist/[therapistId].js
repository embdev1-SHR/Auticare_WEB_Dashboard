import { Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TabContent, TabPane } from "reactstrap";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import NavTabs from "../../components/shared/navtabs";
import TherapistBasicDetails from "../../components/therapist-management/view-therapist/therapistBasicDetails.component";
import TherapistDocuments from "../../components/therapist-management/view-therapist/therapistDocuments.components";
import TherapistHeader from "../../components/therapist-management/view-therapist/therapistHeader.component";
import TherapistJobDetails from "../../components/therapist-management/view-therapist/therapistJobDetails.component";
import { changeBreadcrumb } from "../../store/slice/layout.slice";
import { getTherapist, selectIsLoading, selectTherapist } from "../../store/slice/therapist.slice";
import withAuth from "../../util/helpers/withAuth";

function TherapistDetail() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { therapistId } = router.query;
  const IsLoading = useSelector(selectIsLoading);
  const Therapist = useSelector(selectTherapist);
  const [customActiveTab, setCustomActiveTab] = useState(1);

  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "/dashboard" },
      { title: "Therapist", link: "/therapist" },
      { title: `${Therapist[0]?.Salutation} ${Therapist[0]?.Name}` },
    ];

    dispatch(changeBreadcrumb(breadcrumb_Items));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Therapist]);

  useEffect(() => {
    if (therapistId !== undefined) dispatch(getTherapist(therapistId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [therapistId]);

  const NavArray = ["Basic Details", "Profile & Documents", "Job Details"];
  const toggleCustomJustified = (tab) => {
    if (customActiveTab !== tab) {
      setCustomActiveTab(tab);
    }
  };

  return (
    <Layout>
      {IsLoading || Therapist.length === 0 ? (
        <Loader />
      ) : (
        <Formik initialValues={Therapist[0]}>
          <div className="page-content">
            <TherapistHeader />

            <div className="tab_data">
              <NavTabs customActiveTab={customActiveTab} toggleCustomJustified={toggleCustomJustified} NavigationArray={NavArray} />

              <TabContent activeTab={customActiveTab}>
                <TabPane tabId={1} className="p-3">
                  <TherapistBasicDetails />
                </TabPane>
                <TabPane tabId={2} className="p-3">
                  <TherapistDocuments />
                </TabPane>
                <TabPane tabId={3} className="p-3">
                  <TherapistJobDetails />
                </TabPane>
              </TabContent>
            </div>
          </div>
        </Formik>
      )}
    </Layout>
  );
}
export default withAuth(TherapistDetail, "TherapistManagement");
