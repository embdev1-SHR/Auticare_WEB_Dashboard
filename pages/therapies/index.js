import dynamic from "next/dynamic";
import { useEffect } from "react";
import Layout from "../../components/shared/layout";
import Pagetitle from "../../components/shared/pagetitle";
import { getAllTherapiesSkillGoal } from "../../store/slice/therapies.slice";

import Search from "../../components/shared/search";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/shared/loader";
import AddTherapy from "../../components/therapy-management/add-therapy.component";
import ViewTherapyDetail from "../../components/therapy-management/view-therapy.component";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import { getAllTherapies, selectIsLoading, selectSearchLoading, selectTherapyView, therapySearch } from "../../store/slice/therapies.slice";
import withAuth from "../../util/helpers/withAuth";

const DynamicDropdownComponent = dynamic(() => import("../../components/shared/dropdown"));
const DynamicTherapyList = dynamic(() => import("../../components/therapy-management/therapy-list.component"));

function Therapies() {
  const dispatch = useDispatch();
  const IsLoading = useSelector(selectIsLoading);
  const SearchLoader = useSelector(selectSearchLoading);
  const IsTherapyView = useSelector(selectTherapyView);



  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Therapy Method", link: "therapies" },
    ];
    dispatch(changeTitle("Therapy Method"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(getAllTherapies());
    dispatch(getAllTherapiesSkillGoal());

  }, []);

  const searchHandle = (event) => {
    let key = event.target.value;
    if (key) {
      dispatch(therapySearch({ TherapyName: key }));
    } else {
      dispatch(getAllTherapies());
    }
  };

  return (
    <Layout>
      {IsTherapyView ? <ViewTherapyDetail /> : null}
      <div className='page-content'>
        <Pagetitle />
        {IsLoading ? (
          <Loader />
        ) : (
          <div className='main_listing'>
            <div className='tab_data_header'>
              <div className='tab_actions'>
                {/* Search To Handle Search function */}
                <Search searchHandle={searchHandle} />
                <div className='d-flex'>
                  <div className='mb-0'>{/* <SortDropdown /> */}</div>
                </div>
                {/* Export DropDown To Handle Download The data as Different Formats*/}
                <DynamicDropdownComponent color={"secondary"} name={"Export"} items={["Excel", "CSV", "JSON", "XML"]} names={"Therapy Method"} />
                {/* addTherapy page to create new therapy */}
                <AddTherapy />
              </div>
            </div>
            {SearchLoader ? <Loader /> : <DynamicTherapyList />}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default withAuth(Therapies, "TherapyMethodManagement");