import { useEffect, useState } from "react";

import { TabContent, TabPane } from "reactstrap";
import AssessmentList from "../../../../../../../../components/patient-management/view-patient/assessment/assessmentListDomain.component";
import { AssessmentData } from "../../../../../../../../components/therapist-component/patient/features/assessmentData.component";
import AssessmentListTests from "../../../../../../../../components/patient-management/view-patient/assessment/assessmentListTest.component";
import SimpleBarComponent from "../../../../../../../../components/shared/simplebar";
import FullScreen from "../../../../../../../../components/shared/header/full-screen";
import ToggleButton from "../../../../../../../../components/shared/header/toggle-button";
import { useRouter } from "next/router";
import Link from "next/link";
import { fetchAssessmentMetricResponseList, selectResponseList, SelectPatient, selectPatientDetails } from "../../../../../../../../store/slice/patient.slice";
import { fetchAllCategoryScaleID, selectByScaleIDCategory, fetchAllAssessmentQuestions, selectQuestion } from "../../../../../../../../store/slice/scale.slice";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

const Assessment = () => {
  const router = useRouter();
  const { PatientId, ScaleID, PatientMetricID } = router.query;
  const [activeTab, setActiveTab] = useState(1);
  const dispatch = useDispatch();
  const categories = useSelector(selectByScaleIDCategory);
  const questions = useSelector(selectQuestion);
  const patientDetails = useSelector(selectPatientDetails);
  const responseList = useSelector(selectResponseList);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState([]);
  console.log("3", patientDetails);
  const toggleTab = (tab, catID) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    dispatch(fetchAllCategoryScaleID(ScaleID));
    dispatch(fetchAllAssessmentQuestions(ScaleID));
  }, [dispatch, ScaleID]);
  useEffect(() => {
    dispatch(SelectPatient(PatientId));
    dispatch(fetchAssessmentMetricResponseList({ PatientID: PatientId, PatientMetricID: PatientMetricID }));
  }, [dispatch, PatientId, PatientMetricID]);
  useEffect(() => {
    toggleTab(activeTab, categories[0]?.CategoryID);

    const catArr = categories.map((elem, i) => {
      const catQArr = questions.map((q, j) => {
        if (elem.CategoryID === q.CategoryID) return { ...q };
      });
      return { ...elem, Questions: catQArr?.filter((cur) => cur !== undefined) };
    });

    setSelectedItem(catArr);
  }, [categories, questions]);
  useEffect(() => {
    const catArr = selectedItem[activeTab - 1]?.Questions.map((elem, i) => {
      const catQArr = responseList?.map((q, j) => {
        if (elem.MetricID === q.MetricID) return { ...q };
      });
      return { ...elem, Response: catQArr?.filter((cur) => cur !== undefined) };
    });

    setSelectedResponse(catArr);
  }, [responseList, selectedItem, activeTab]);

  useEffect(() => {
    document.body.classList.add("layout-popup-full");

    // returned function will be called on component unmount
    return () => {
      document.body.classList.remove("layout-popup-full");
    };
  }, []);


  function calculateAge(dateOfBirth) {
    const today = moment();
    const birthDate = moment(dateOfBirth);
    const age = today.diff(birthDate, 'years');
    return age;
  }

  return (
    <div id='layout-wrapper'>
      <header id='page-topbar'>
        <div className='navbar-header'>
          <div className='d-flex'>
            <ToggleButton />

            <div className='d-flex align-items-center popup_title'>
              <h2> Assessment Result</h2>
            </div>
          </div>

          <div className='d-flex'>
            <div className='d-flex align-items-center pr-2'>
              <label className='selected_label'>
                Selected Type : <span>Type 1</span>
              </label>
            </div>

            <div className='dropdown d-none d-lg-inline-block'>
              <FullScreen />
            </div>

            <div className='dropdown d-flex align-items-center'>
              <Link href={`/patients/${PatientId}`}>
                <a className='btn btn-rounded noti-icon waves-effect popup_close'>
                  <i className=' ri-close-line'></i>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className='vertical-menu user_bg'>
        <SimpleBarComponent className='nav-area h-100'>
          <div className='sidebar_user'>
            <div className='user_pic'>
              <img src='/images/users/patient_dummy.jpg' />
            </div>
            <div className='user_bio'>
              <h4>{patientDetails ? patientDetails[0]?.PatientName : ""}</h4>
              <h6>Gender : {patientDetails ?patientDetails[0]?.Gender : ""} | Age : {calculateAge(patientDetails ? patientDetails[0]?.DOB : "")} years</h6>
            </div>
          </div>
          <div className='sidebar_action'>
            <button onClick={() => router.push(`/patients/${PatientId}`)} className='btn btn-outline-light'>
              <span>Back to Patient Details</span>
              <i className='ri-home-5-line'></i>
            </button>
          </div>
        </SimpleBarComponent>
      </div>
      <div className='main-content'>
        <div className='page-content'>
          <div className='vertical_tab'>
            <div className='tab_grid'>
              <SimpleBarComponent className='sidebar_tab'>
                <AssessmentList AssessmentData={categories} activeTab={activeTab} toggleTab={toggleTab} />
              </SimpleBarComponent>
              <SimpleBarComponent className='full_screen_content'>
                <TabContent activeTab={activeTab} className='p-0 text-muted' id='v-tabContent'>
                  {selectedItem.map((Assessment, key) => {
                    return (
                      <TabPane key={key} tabId={key + 1} role='tabpanel'>
                        <div className='tab_data_table table-responsive'>

                          <AssessmentListTests AssessmentQuestions={selectedResponse} Tab={activeTab} />
                        </div>
                      </TabPane>
                    );
                  })}
                </TabContent>
              </SimpleBarComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
