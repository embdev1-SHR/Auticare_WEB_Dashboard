import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DropdownComponent from "../../components/shared/dropdown";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import PageTitle from "../../components/shared/pagetitle";
import Search from "../../components/shared/search";
import { AppointmentsList } from "../../components/therapist-component/appointments/appointmentsList.component";
import { fetchAllAppointments, selectAppointmentsList, selectAppointmentsLoading } from "../../store/slice/appointment.slice";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import withAuth from "../../util/helpers/withAuth";
import { tableSearch } from "../../store/slice/payment.slice";

const Appointments = () => {
  const dispatch = useDispatch();
  const isAppointmentsLoading = useSelector(selectAppointmentsLoading);
  const appoinments = useSelector(selectAppointmentsList);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Appointments Records", link: "appointments" },
    ];
    dispatch(changeTitle("Appointments Records"));
    dispatch(changeBreadcrumb(breadcrumb_Items));

    dispatch(fetchAllAppointments());
  }, [dispatch]);


  const searchHandle = async (event) => {
    console.log("trigger ");
    let key = event.target.value;
    setSearchValue(key);
  };

  useEffect(() => {
    const timeOutFn = setTimeout(async () => {
      if (searchValue) {
        const searchData = appoinments.filter((item) => item.PatientName?.toLowerCase().includes(searchValue.toLowerCase()));
        await dispatch(tableSearch(searchData));
      } else {
        await dispatch(tableSearch(appoinments));
      }
    }, 400);
    return () => clearTimeout(timeOutFn);
  }, [searchValue, appoinments]);


  return (
    <Layout>
      <div className='page-content'>
        <PageTitle />
        {isAppointmentsLoading ? (
          <Loader />
        ) : (
          <div className='main_listing'>
            <div className='tab_data_header'>
              {appoinments.length === 0 ? <></>: <div className='tab_actions'>
                {/* Search To Handle Search function */}
                <Search searchHandle={searchHandle}/>
                {/* Export DropDown To Handle Download The data as Different Formats*/}
                <DropdownComponent color={"secondary"} name={"Export"} items={["Excel", "CSV", "JSON", "XML"]} names={"Appointments"} />
              </div>}
            </div>
            {/* Appointments List Table */}
            {appoinments.length ===0 ? "- No appointments -" :<AppointmentsList />}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default withAuth(Appointments, "AppointmentsManagement");
