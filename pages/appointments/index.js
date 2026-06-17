import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DropdownComponent from "../../components/shared/dropdown";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import PageTitle from "../../components/shared/pagetitle";
import Search from "../../components/shared/search";
import { AppointmentsList } from "../../components/therapist-component/appointments/appointmentsList.component";
import AddAppointment from "../../components/therapist-component/appointments/add-appointment.component";
import { fetchAllAppointments, selectAppointmentsList, selectAppointmentsLoading } from "../../store/slice/appointment.slice";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import withAuth from "../../util/helpers/withAuth";
import { tableSearch } from "../../store/slice/payment.slice";
import { getAllTherapists } from "../../store/slice/therapist.slice";
import { fetchAllPatients } from "../../store/slice/patient.slice";
import { selectRole } from "../../store/slice/auth.slice";

const Appointments = () => {
  const dispatch = useDispatch();
  const isAppointmentsLoading = useSelector(selectAppointmentsLoading);
  const appoinments = useSelector(selectAppointmentsList);
  const role = useSelector(selectRole);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Appointments Records", link: "appointments" },
    ];
    dispatch(changeTitle("Appointments Records"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(fetchAllAppointments());
    dispatch(getAllTherapists());
    if (role !== "Patient") {
      dispatch(fetchAllPatients());
    }
  }, [dispatch]);


  const searchHandle = async (event) => {
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
              <div className='tab_actions'>
                <AddAppointment />
                {appoinments.length > 0 && (
                  <>
                    <Search searchHandle={searchHandle} />
                    <DropdownComponent color={"secondary"} name={"Export"} items={["Excel", "CSV", "JSON", "XML"]} names={"Appointments"} />
                  </>
                )}
              </div>
            </div>
            {appoinments.length === 0 ? "- No appointments -" : <AppointmentsList />}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default withAuth(Appointments);
