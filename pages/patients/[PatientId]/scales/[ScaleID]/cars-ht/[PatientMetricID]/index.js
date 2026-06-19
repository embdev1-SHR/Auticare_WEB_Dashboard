import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TabContent, TabPane } from "reactstrap";
import ScreeningDomain from "../../../../../../../components/patient-management/view-patient/screening/startScreeningDomain.component";
import ScreeningTest from "../../../../../../../components/patient-management/view-patient/screening/startScreeningTesting.component";
import FullScreen from "../../../../../../../components/shared/header/full-screen";
import ToggleButton from "../../../../../../../components/shared/header/toggle-button";
import Loader from "../../../../../../../components/shared/loader";
import SimpleBarComponent from "../../../../../../../components/shared/simplebar";
import { patientCompleteCheckService } from "../../../../../../../services/patient.services";
import { patientIsLoading, patientScreeningMetricResponse, SelectPatient, selectPatientDetails, selectResponseData, setResponseData, UpdatePatientCheck } from "../../../../../../../store/slice/patient.slice";
import { ScaleDetails, fetchAllCategoryScaleID, fetchAllQuestions, selectByScaleIDCategory, selectQuestion, selectScaleDetail, selectScaleIsLoading } from "../../../../../../../store/slice/scale.slice";
import moment from "moment";

const StartScreening = () => {
  const { query, back, push, asPath } = useRouter();
  const { ScaleID, PatientMetricID, PatientId } = query;
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(1);
  const categories = useSelector(selectByScaleIDCategory);
  const loading = useSelector(selectScaleIsLoading);
  const questions = useSelector(selectQuestion);
  const responseData = useSelector(selectResponseData);
  const IsButton = useSelector(patientIsLoading);
  const CompleteCheck = useSelector(UpdatePatientCheck);
  const scaleDetail = useSelector(selectScaleDetail);
  const PatientDetails = useSelector(selectPatientDetails);

  const [selectedItem, setSelectedItem] = useState([]);

  useEffect(() => {
    dispatch(SelectPatient(PatientId));
  }, []);

  function calculateAge(dateOfBirth) {
    const today = moment();
    const birthDate = moment(dateOfBirth);
    const age = today.diff(birthDate, 'years');
    return age;
  }

  const toggleTab = (tab, catID) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
    const qn = arrangeQuestions(questions, catID).map((q, index) => {
      return {
        Score: [
          { value: q.ResponseOption1, weight: q.ResponseScore1 },
          { value: q.ResponseOption2, weight: q.ResponseScore2 },
          { value: q.ResponseOption3, weight: q.ResponseScore3 },
          { value: q.ResponseOption4, weight: q.ResponseScore4 },
          { value: q.ResponseOption5, weight: q.ResponseScore5 },
        ],
        index: index,
        ...q,
      };
    });
  };

  const arrangeQuestions = (questions, catID) => {
    const qn = questions.filter((q) => q.CategoryID === catID).sort((a, b) => a.QuestionNumber - b.QuestionNumber);
    return qn;
  };

  useEffect(() => {
    if (PatientId && PatientMetricID) {
      const valueToSend = { PatientId, PatientMetricID };
      patientCompleteCheckService(valueToSend).then((res) => {
        if (res.data.results.data[0]?.CompletionStatus == "Completed") {
          push(`${asPath}/result`);
        }
      });
    }
  }, [PatientId, PatientMetricID]);

  useEffect(() => {
    document.body.classList.add("layout-popup-full");
    return () => {
      document.body.classList.remove("layout-popup-full");
    };
  }, []);

  useEffect(() => {
    dispatch(ScaleDetails(ScaleID));
    dispatch(fetchAllCategoryScaleID(ScaleID));
    dispatch(fetchAllQuestions(ScaleID));
    const responses = questions.map((Question) => {
      return {
        MetricID: Question.MetricID,
        QuestionNumber: Question.QuestionNumber,
        ResponseSelected: "",
        ResponseScore: 0,
      };
    });
    const data = responses.filter(obj => obj.ResponseSelected !== "");
    const initResponseData = {
      ScaleID: ScaleID,
      Score: 0,
      Result: "",
      CompletionStatus: "Completed",
      Responses: data,
    };
    dispatch(setResponseData(initResponseData));
  }, [ScaleID]);

  const handleFinishScreening = () => {
    let Score = 0;
    const updatedData = {
      ...responseData,
      Responses: responseData.Responses.filter(item => item !== null && item !== undefined),
    };

    for (let i = 0; i < updatedData.Responses.length; i++) {
      Score += updatedData.Responses[i]?.ResponseScore;
    }

    function getAutismCategory(value) {
      var array = scaleDetail;
      if (value >= 0 && value < array[0].NoAutismScore) {
        return "No Autism";
      } else if (value > array[0]?.NoAutismScore && value <= array[0].MildAutismScore) {
        return "Mild Autism";
      } else if (value > array[0]?.MildAutismScore && value <= array[0].ModerateAutismScore) {
        return "Moderate Autism";
      } else if (value > array[0]?.ModerateAutismScore) {
        return "Severe Autism";
      } else {
        return "Invalid value";
      }
    }

    var result = getAutismCategory(Score);
    dispatch(patientScreeningMetricResponse({ PatientID: PatientId, PatientMetricID: PatientMetricID, body: { ...updatedData, Score: Score, Result: result }, asPath }));
  };

  useEffect(() => {
    toggleTab(activeTab, categories[0]?.CategoryID);

    const catArr = categories.map((elem, i) => {
      const catQArr = questions.map((q, index) => {
        if (elem.CategoryID === q.CategoryID)
          return {
            Score: [
              { value: q.ResponseOption1, weight: q.ResponseScore1 },
              { value: q.ResponseOption2, weight: q.ResponseScore2 },
              { value: q.ResponseOption3, weight: q.ResponseScore3 },
              { value: q.ResponseOption4, weight: q.ResponseScore4 },
              { value: q.ResponseOption5, weight: q.ResponseScore5 },
            ],
            index: index,
            ...q,
          };
      });
      return { ...elem, Questions: catQArr.filter((cur) => cur !== undefined) };
    });
    setSelectedItem(catArr);
  }, [categories, questions]);

  return (
    <div id='layout-wrapper'>
      {loading ? (
        <Loader />
      ) : (
        <>
          <header id='page-topbar'>
            <div className='navbar-header'>
              <div className='d-flex'>
                <ToggleButton />
                <div className='d-flex align-items-center popup_title'>
                  <h2>Start Screening</h2>
                </div>
              </div>
              <div className='d-flex'>
                <div className='d-flex align-items-center pr-2'>
                  <label className='selected_label'>
                    Selected Scale : <span>CARS-HT</span>
                  </label>
                </div>
                <div className='dropdown d-none d-lg-inline-block'>
                  <FullScreen />
                </div>
                <div className='dropdown d-flex align-items-center'>
                  <button onClick={() => back()} className='btn btn-rounded noti-icon waves-effect popup_close'>
                    <i className=' ri-close-line'></i>
                  </button>
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
                <div className="user_bio">
                  <h4>{PatientDetails ? PatientDetails[0]?.PatientName : ""}</h4>
                  <h6>Gender : {PatientDetails ? PatientDetails[0]?.Gender : ""} | Age : {calculateAge(PatientDetails ? PatientDetails[0]?.DOB : "")} years</h6>
                </div>
              </div>
              <div className='sidebar_action'>
                <button onClick={() => back()} className='btn btn-outline-light'>
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
                    <ScreeningDomain Categories={categories} activeTab={activeTab} toggleTab={toggleTab} />
                  </SimpleBarComponent>
                  <SimpleBarComponent className='full_screen_content'>
                    <TabContent activeTab={activeTab} className='p-0 text-muted' id='v-tabContent'>
                      {selectedItem.map((cat, key) => {
                        return (
                          <TabPane key={key} tabId={key + 1} role='tabpane'>
                            <div className='tab_data_header'>
                              <div className='tab_title'>
                                <h3>
                                  <span className='qname-full'>{cat.CategoryName}</span>
                                </h3>
                              </div>
                            </div>
                            <div className='tab_data_table table-responsive'>
                              <ScreeningTest Tab={key + 1} DomainQuestions={cat.Questions} />
                            </div>
                          </TabPane>
                        );
                      })}
                    </TabContent>
                    <div className='container-action d-flex justify-content-end'>
                      <button type='button' onClick={back} className='btn btn-light btn-md waves-effect waves-light action_btn'>
                        Cancel
                      </button>
                      <button disabled={IsButton} className='btn btn-primary btn-md waves-effect waves-light action_btn ml-2' onClick={handleFinishScreening}>Finish Screening</button>
                    </div>
                  </SimpleBarComponent>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StartScreening;
