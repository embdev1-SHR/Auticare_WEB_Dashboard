import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Layout from "../components/shared/layout";
import PageTitle from "../components/shared/pagetitle";
import { changeBreadcrumb, changeTitle } from "../store/slice/layout.slice";
import { useSelector } from "react-redux";
import CenterDashboardComponent from "../components/dashboard/center-dashboard";
import ClientDashboardComponent from "../components/dashboard/client-dashboard";
import DashboardComponent from "../components/dashboard/dashboard.component";
import TherapistDashboardComponent from "../components/dashboard/therapist-dashboard";
import { selectRole } from "../store/slice/auth.slice";
import { getDashboard, selectDashboardData } from "../store/slice/common.slice";

function Dashboard() {
  const dispatch = useDispatch();
  const role = useSelector(selectRole);
  const dashboardAnalyticsData = useSelector(selectDashboardData);
  useEffect(() => {
    const breadcrumb_Items = [{ title: "Dashboard", link: "dashboard" }];
    dispatch(changeTitle("Dashboard"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(getDashboard());
  }, [dispatch]);

  return (
    <Layout>
      <div className='page-content dashboard'>
        <PageTitle />
        {role === "SuperAdmin" && <DashboardComponent />}
        {role === "ClientAdmin" && <ClientDashboardComponent />}
        {role === "Center" && <CenterDashboardComponent />}
        {role === "Therapist" && <TherapistDashboardComponent />}
      </div>
    </Layout>
  );
}
export default Dashboard;

