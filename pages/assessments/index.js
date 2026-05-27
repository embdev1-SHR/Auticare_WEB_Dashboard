import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssessmentList from "../../components/assessment-management/assessment-list.component";
import CreateAssessment from "../../components/assessment-management/create-assessment.component";
import DropdownComponent from "../../components/shared/dropdown";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import Pagetitle from "../../components/shared/pagetitle";
import Search from "../../components/shared/search";
import { fetchAllAssessments, selectAssessmentIsLoading } from "../../store/slice/assessment.slice";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import withAuth from "../../util/helpers/withAuth";

function AssessmentCreation() {
  const dispatch = useDispatch();
  const assessmentsLoading = useSelector(selectAssessmentIsLoading);
  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Assessments", link: "assessments" },
    ];
    dispatch(changeTitle("Assessments"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(fetchAllAssessments());
  }, [dispatch]);

  return (
    <Layout>
      <div className='page-content'>
        <Pagetitle />
        {assessmentsLoading ? (
          <Loader />
        ) : (
          <div className='main_listing'>
            <div className='tab_data_header'>
              <div className='tab_actions'>
                {/* Search To Handle Search function */}
                <Search />
                {/* Export DropDown To Handle Download The data as Different Formats*/}
                <DropdownComponent color={"secondary"} name={"Export"} items={["Excel", "CSV", "JSON", "XML"]} />
                <CreateAssessment
                />
              </div>
            </div>
            {/* AssessmentList Table */}
            <AssessmentList />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default withAuth(AssessmentCreation, "AssessmentManagement");
