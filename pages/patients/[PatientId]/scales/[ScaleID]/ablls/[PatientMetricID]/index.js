import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SimpleBarComponent from "../../../../../../../components/shared/simplebar";
import { Button, TabContent, TabPane } from "reactstrap";
import FullScreen from "../../../../../../../components/shared/header/full-screen";
import ToggleButton from "../../../../../../../components/shared/header/toggle-button";
import { PopoverPicker } from "../../../../../../../components/shared/colorpicker/PopoverPicker";
import "flatpickr/dist/flatpickr.css";
import Flatpickr from "react-flatpickr";
import StartAssessmentTest from "../../../../../../../components/patient-management/view-patient/assessment/startAssessmentTest.component";
import AssessmentList from "../../../../../../../components/patient-management/view-patient/assessment/assessmentListDomain.component";
import { fetchAllCategoryScaleID, selectByScaleIDCategory, fetchAllAssessmentQuestions, selectQuestion, selectScaleIsLoading } from "../../../../../../../store/slice/scale.slice";
import { patientAssessmentMetricResponse, fetchAssessmentMetricResponseList, selectResponseList, patientIsLoading, SelectPatient, selectPatientDetails } from "../../../../../../../store/slice/patient.slice";
import Loader from "../../../../../../../components/shared/loader";
import moment from "moment";

const StartAssessment = () => {
  const { query, back, asPath, push } = useRouter();
  const backToPatientRedirectionPath = asPath.split("/scales");
  function backToPatient() {
    push(backToPatientRedirectionPath[0]);
  }
  const { ScaleID, PatientId, PatientMetricID } = query;
  const dispatch = useDispatch();
  const categories = useSelector(selectByScaleIDCategory);
  const questions = useSelector(selectQuestion);
  const [selectedElem, setSelectedElem] = useState([]);
  const PatientDetails = useSelector(selectPatientDetails);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [color, setColor] = useState("#2BC0C2");
  const [response, setResponse] = useState([]);
  const loading = useSelector(selectScaleIsLoading);
  const isbutton = useSelector(patientIsLoading);

  const [assessmentObj, setAssessmentObj] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [selectedItem, setSelectedItem] = useState([]);
  const responseList = useSelector(selectResponseList);
  const [selectedResponse, setSelectedResponse] = useState([]);
  const [isSelected, setIsSelected] = useState(false);

  const handleButtonClick = () => {
    setIsSelected(!isSelected);
  };

  function calculateAge(dateOfBirth) {
    const today = moment();
    const birthDate = moment(dateOfBirth);
    const age = today.diff(birthDate, 'years');
    return age;
  }
  useEffect(() => {
    dispatch(
      SelectPatient(PatientId)
    );
  }, [PatientId]);

  const setDateColor = () => {
    let responseDateColor = [];
    if (responseList?.length) {
      responseList.forEach((response) => {
        const respDate = response?.Date?.slice(0, 10);
        const found = responseDateColor.some((obj) => obj.AssessmentDate === respDate && obj.AssessmentColor === response.Colour);
        if (!found) {
          responseDateColor = [...responseDateColor, { AssessmentDate: respDate, AssessmentColor: response.Colour }];
          // setResponseDateColor(values); // set the new state
        }
      });
      -setAssessmentObj(responseDateColor);
    }
  };

  const toggleTab = (tab, catID) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
    const qn = arrangeQuestions(questions, catID).map((q) => {
      return { ...q };
    });

  };
  const arrangeQuestions = (questions, catID) => {
    const qn = questions.filter((q) => q.CategoryID === catID).sort((a, b) => a.QuestionNumber - b.QuestionNumber);
    return qn;
  };
  const handleShowColorDate = () => {
    const found = assessmentObj.some((obj) => obj.AssessmentDate === date && obj.AssessmentColor === color);

    if (!found) {
      const values = [...assessmentObj, { AssessmentDate: date, AssessmentColor: color }];
      setAssessmentObj(values); // set the new state
    }
  };
  const handleResponse = (score) => {
    const found = response.findIndex((obj) => {
      return obj.QuestionNumber === score.QuestionNumber && obj.MetricID === score.MetricID && obj.ScoreNumber === score.ScoreNumber;
    });

    if (found == -1) {
      setResponse((response) => [...response, score]);
    }
    else {
      setResponse((response) => {
        response[found] = score;
        return response
      });
    }
  };

  const handleRemoveResponse = (score) => {
    setResponse((response) => {
      return response.filter(item => !(item.MetricID == score.MetricID && item.QuestionNumber == score.QuestionNumber && item.ScoreNumber == score.ScoreNumber && item.NumberOfScore == score.NumberOfScore))
    });
  };



  const handleFinishAssessment = () => {
    console.log("response", response);
    const body = {
      ScaleID: ScaleID,
      CompletionStatus: "Pending",
      Responses: response,
    };
    console.warn({ response });
    dispatch(patientAssessmentMetricResponse({ PatientID: PatientId, PatientMetricID: PatientMetricID, body: body, asPath }));
  };

  useEffect(() => {
    dispatch(fetchAllCategoryScaleID(ScaleID));
    dispatch(fetchAllAssessmentQuestions(ScaleID));
    dispatch(fetchAssessmentMetricResponseList({ PatientID: PatientId, PatientMetricID: PatientMetricID }));
  }, [dispatch, ScaleID, PatientMetricID, PatientId]);

  useEffect(() => {
    setDateColor();
  }, [responseList]);

  useEffect(() => {
    toggleTab(activeTab, categories[0]?.CategoryID);

    if (categories.length > 0) {
      const catArr = categories.map((elem, i) => {
        const catQArr = questions.map((q, j) => {
          if (elem.CategoryID === q.CategoryID) return { ...q };
        });
        return { ...elem, Questions: catQArr.filter((cur) => cur !== undefined) };
      });

      setSelectedItem(catArr);
    }

  }, [categories, questions]);

  useEffect(() => {

    if (selectedItem.length > 0 && questions.length > 0) {
      const catArr = selectedItem[activeTab - 1]?.Questions.map((elem, i) => {
        const catQArr = responseList?.map((q, j) => {
          if (elem.MetricID === q.MetricID) return { ...q };
        });
        return { ...elem, Response: catQArr?.filter((cur) => cur !== undefined) };
      });

      setSelectedResponse(catArr);
      const updatedItem = { ...selectedItem[activeTab - 1], Questions: catArr.filter((cur) => cur !== undefined) };
      const updatedItems = [...selectedItem];
      updatedItems[activeTab - 1] = updatedItem;
      setSelectedElem(updatedItems);
      // setSelectedItem(updatedItems);
    }
  }, [responseList, activeTab, questions, selectedItem]);

  useEffect(() => {
    if (response.length > 0) {

      const catArr = selectedElem[activeTab - 1]?.Questions.map((elem, i) => {
        const catQArr = response.map((q, j) => {
          if (elem.MetricID === q.MetricID) return { ...q };
        });
        return { ...elem, curResponse: catQArr.filter((cur) => cur !== undefined) };
      });

      const updatedItem = { ...selectedItem[activeTab - 1], Questions: catArr.filter((cur) => cur !== undefined) };
      const updatedItems = [...selectedItem];
      updatedItems[activeTab - 1] = updatedItem;
      // setSelectedItem(updatedItems);
      setSelectedElem(updatedItems);
    }
  }, [response]);

  useEffect(() => {
    document.body.classList.add("layout-popup-full");

    // returned function will be called on component unmount
    return () => {
      document.body.classList.remove("layout-popup-full");
    };
  }, []);

  const buttonStyle = {
    backgroundColor: isSelected ? '#90EE90' : '#D3D3D3',
    border: 'none',
    borderRadius: "10px",
    cursor: isSelected ? 'pointer' : 'default',
  };


  return (
    <div id='layout-wrapper'>
      {loading || isbutton ? (
        <Loader />
      ) : (
        <>
          <header id='page-topbar'>
            <div className='navbar-header'>
              <div className='d-flex'>
                <ToggleButton />

                <div className='d-flex align-items-center popup_title'>
                  <h2>Start Assessment</h2>
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
                  <h6>Gender : {PatientDetails ? PatientDetails[0]?.Gender : " "} | Age : {calculateAge(PatientDetails ? PatientDetails[0]?.DOB : "")} years</h6>
                  {/* <h6>Department : KIMS Department</h6> */}
                </div>
              </div>
              <div className='sidebar_action'>
                <button onClick={backToPatient} className='btn btn-outline-light'>
                  <span>Back to Patient Details</span>
                  <i className='ri-home-5-line'></i>
                </button>
              </div>
            </SimpleBarComponent>
          </div>

          <div className='main-content'>
            <div className='page-content'>
              <div className='vertical_tab'>

                {categories.length > 0 && <div className='tab_grid'>
                  <SimpleBarComponent className='sidebar_tab'>
                    <AssessmentList AssessmentData={categories} activeTab={activeTab} toggleTab={toggleTab} />
                  </SimpleBarComponent>
                  <SimpleBarComponent className='full_screen_content'>
                    <TabContent activeTab={activeTab} className='p-0 text-muted' id='v-tabContent'>
                      {selectedElem.map((cat, key) => {
                        return (
                          <TabPane key={key + 1} tabId={key + 1} role='tabpanel'>
                            <div className='tab_data_header'>

                              <div className='tab_title'>
                                <h3>
                                  <span className='qname'>{cat.CategoryLabel}. </span>
                                  <span className='qname-full'>{cat.CategoryName}</span>
                                </h3>
                              </div>
                              <div className='tab_actions'>
                                <button style={buttonStyle} onClick={handleButtonClick}>
                                  <i className='mdi mdi-eraser'></i>
                                </button>
                                <div className='d-flex choose_date align-items-center'>
                                  <label>Date</label>
                                  <Flatpickr
                                    value={date}
                                    onChange={(selectedDates, dateStr) => {
                                      setDate(dateStr);
                                    }}
                                    className='form-control'
                                    options={{
                                      altInput: true,
                                      altFormat: "j M, Y",
                                      dateFormat: "Y-m-d",
                                    }}
                                  />
                                  {/* <input type="text" className="form-control" data-provide="datepicker" data-date-format="dd M, yyyy" data-date-autoclose="true" /> */}
                                </div>
                                <div className='d-flex color_picker align-items-center'>
                                  <label>Choose Color</label>
                                  <PopoverPicker color={color} onChange={setColor} />
                                </div>
                              </div>
                            </div>
                            {assessmentObj.map((item, k) => {
                              return (
                                <span key={k} className='text-muted mb-0 me-3'>
                                  <i className='mdi mdi-square align-middle font-size-20' style={{ color: item.AssessmentColor }}></i> {item.AssessmentDate}
                                </span>
                              );
                            })}
                            <div className='tab_data_table table-responsive'>
                              <StartAssessmentTest
                                Tab={key + 1}
                                AssessmentQuestions={cat.Questions}
                                color={color}
                                date={date}
                                handleShowColorDate={handleShowColorDate}
                                handleResponse={handleResponse}
                                isSelected={isSelected}
                                handleRemoveResponse={handleRemoveResponse}
                              />
                              {/* <StartAssessmentTest
                                Tab={key + 1}
                                AssessmentQuestions={selectedResponse}
                                color={color}
                                date={date}
                                handleShowColorDate={handleShowColorDate}
                                handleResponse={handleResponse}
                              /> */}
                            </div>
                          </TabPane>
                        );
                      })}
                    </TabContent>
                    <div className='container-action d-flex justify-content-end'>
                      <button type='button' onClick={() => back()} className='btn btn-light btn-md waves-effect waves-light action_btn'>
                        Cancel
                      </button>
                      <button disabled={isbutton} className='btn btn-primary btn-md waves-effect waves-light action_btn ml-2' onClick={handleFinishAssessment}>
                        Submit Assessment
                      </button>
                    </div>
                  </SimpleBarComponent>
                </div>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StartAssessment;
