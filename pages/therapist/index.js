import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Layout from "../../components/shared/layout";
import Pagetitle from "../../components/shared/pagetitle";

import Search from "../../components/shared/search";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/shared/loader";
import { selectRole } from "../../store/slice/auth.slice";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import { getAllTherapists, selectIsLoading, selectSearchLoading, therapistSearch } from "../../store/slice/therapist.slice";
import withAuth from "../../util/helpers/withAuth";

const DynamicDropdownComponent = dynamic(() => import("../../components/shared/dropdown"));
const DynamicAddTherapist = dynamic(() => import("../../components/therapist-management/add-therapist/add-therapist.component"));
const DynamicTherapistList = dynamic(() => import("../../components/therapist-management/therapist-list.component"));

function Therapist() {
  const dispatch = useDispatch();
  const role = useSelector(selectRole);
  const IsLoading = useSelector(selectIsLoading);
  const isSearchLoading = useSelector(selectSearchLoading);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Therapist", link: "therapist" },
    ];
    dispatch(changeTitle("Therapist"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(getAllTherapists());
  }, []);

  const searchHandle = async (event) => {
    let key = event.target.value;
    setSearchKey(key);
  };

  useEffect(() => {
    const timeOutFn = setTimeout(async () => {
      if (searchKey) {
        const therapistNames = await dispatch(therapistSearch({ Name: searchKey }));
        const therapistEmails = therapistNames.payload.length === 0 ? await dispatch(therapistSearch({ EmailId: searchKey })) : therapistNames;
        const therapistPhones = therapistEmails.payload.length === 0 ? await dispatch(therapistSearch({ Phone: searchKey })) : therapistEmails;
        const therapistFacilitatorType =
          therapistPhones.payload.length === 0 ? await dispatch(therapistSearch({ FacilitatorType: searchKey })) : therapistPhones;
        const therapistDepartmentName =
          therapistFacilitatorType.payload.length === 0 ? await dispatch(therapistSearch({ DepartmentName: searchKey })) : therapistFacilitatorType;
      } else {
        await dispatch(getAllTherapists());
      }
    }, 500);
    return () => clearTimeout(timeOutFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey]);

  return (
    <Layout>
      <div className="page-content">
        <Pagetitle />
        {IsLoading ? (
          <Loader />
        ) : (
          <div className="main_listing">
            <div className="tab_data_header">
              <div className="tab_actions">
                {/* Search To Handle Search function */}
                <Search searchHandle={searchHandle} />
                <div className="d-flex">
                  <div className="mb-0"></div>
                </div>
                {/* Export DropDown To Handle Download The data as Different Formats*/}
                <DynamicDropdownComponent color={"secondary"} name={"Export"} items={["Excel", "CSV", "JSON", "XML"]} names={"Therapist"} />
                {/* DynamicAddTherapist page to add therapist */}
                {role !== "SuperAdmin" && <DynamicAddTherapist />}
              </div>
            </div>
            {/* TherapistList table to handle therapist data */}
            {isSearchLoading ? <Loader /> : <DynamicTherapistList />}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default withAuth(Therapist, "TherapistManagement");