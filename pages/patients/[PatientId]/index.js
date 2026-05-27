import ViewPatientDetails from "../../../components/patient-management/view-patient/view-patient-details";
import Layout from "../../../components/shared/layout";
import { useDispatch, useSelector } from "react-redux";
import { PatientDetailsLoading, SelectPatient, selectPatientDetails } from "../../../store/slice/patient.slice";
import { changeBreadcrumb } from "../../../store/slice/layout.slice";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Loader from "../../../components/shared/loader";
import PatientHeader from "../../../components/patient-management/view-patient/patient-header";

const PatientDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { PatientId } = router.query;
  const Patient = useSelector(selectPatientDetails);

  const IsLoading = useSelector(PatientDetailsLoading);
  useEffect(() => {
    if (PatientId){dispatch(SelectPatient(PatientId));} 
  }, [PatientId, dispatch]);

  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "/dashboard" },
      { title: "Patients", link: "/patients" },
      {
        title: `${Patient && Patient[0]?.PatientName !== undefined ? Patient[0]?.PatientName : ""}`,
      },
    ];
    dispatch(changeBreadcrumb(breadcrumb_Items));
    
  }, [Patient, dispatch]);

  return Patient === null || IsLoading ? (
    <Loader />
  ) : (
    <Layout>
      <div className='page-content'>
        <PatientHeader patient={Patient} />
        <div className='tab_data'>
          <ViewPatientDetails />
        </div>
      </div>
    </Layout>
  );
};

export default PatientDetails;
