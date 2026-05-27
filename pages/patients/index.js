import { useEffect, useState } from "react";

import Layout from "../../components/shared/layout";
import Search from "../../components/shared/search";

import Pagetitle from "../../components/shared/pagetitle";
import { useDispatch, useSelector } from "react-redux";
import AddPatient from "../../components/patient-management/add-patient/add-patient.component";
import PatientListing from "../../components/patient-management/patient-list.component";
import DropdownComponent from "../../components/shared/dropdown";
import Loader from "../../components/shared/loader";
import { fetchAllCenters } from "../../store/slice/center.slice";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import { SelectSearchPatientLoading, fetchAllPatients, patientIsLoading, searchPatient, selectPatientList, tableSearch } from "../../store/slice/patient.slice";
import withAuth from "../../util/helpers/withAuth";
import { selectRole } from "../../store/slice/auth.slice";

function PatientManagement() {
  const dispatch = useDispatch();
  const isLoading = useSelector(patientIsLoading);
  const role = useSelector(selectRole);
  const patientListState = useSelector(selectPatientList);

  const isPatientSearch = useSelector(SelectSearchPatientLoading);
  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Patient", link: "patient" },
    ];
    dispatch(changeTitle("Patients List"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(fetchAllPatients());
    dispatch(fetchAllCenters());
  }, [dispatch]);


  const [searchValue, setSearchValue] = useState("");

  const searchHandle = async (event) => {
    let key = event.target.value;
    setSearchValue(key);
  };




  useEffect(() => {
    console.log("<><><><><>");
    const timeOutFn = setTimeout(async () => {
      if (searchValue) {
        const searchData = patientListState.filter((item) => item.PatientName?.toLowerCase().includes(searchValue.toLowerCase()));
        await dispatch(tableSearch(searchData));
      } else {
        await dispatch(tableSearch(patientListState));
      }
    }, 400);
    return () => clearTimeout(timeOutFn);
  }, [searchValue, patientListState]);









  // useEffect(() => {
  //   const timeOutFn = setTimeout(async () => {
  //     if (searchValue) {
  //       if (searchValue.match(/^\d+$/)) {
  //         await dispatch(searchPatient({ ParentPhone: searchValue }));
  //       } else {
  //         const result = await dispatch(searchPatient({ PatientName: searchValue }));
  //         result.payload?.length === 0 ? await dispatch(searchPatient({ ParentEmailID: searchValue })) : result;
  //       }
  //     } else {
  //       await dispatch(searchPatient({}));
  //     }
  //   }, 400);
  //   return () => clearTimeout(timeOutFn);
  // }, [searchValue]);

  useEffect(() => {
    searchHandle;
  }, []);

  
  return (
    <Layout>
      <div className='page-content'>
        <Pagetitle />
        {isLoading ? (
          <Loader />
        ) : (
          <div className='main_listing'>
            <div className='tab_data_header'>
              <div className='tab_actions'>
                {/* Search To Handle Search function */}
                <Search searchHandle={searchHandle} />
                {/* Export DropDown To Handle Download The data as Different Formats*/}
                <DropdownComponent color={"secondary"} name={"Export"} items={["Excel", "CSV", "JSON", "XML"]} names={"patient"} />
                {role !== "SuperAdmin" && <AddPatient />}
              </div>
            </div>
            {/* Patient List Table */}
            {isPatientSearch ? <Loader /> : <PatientListing className='mt-3' />}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default withAuth(PatientManagement, "PatientManagement");
