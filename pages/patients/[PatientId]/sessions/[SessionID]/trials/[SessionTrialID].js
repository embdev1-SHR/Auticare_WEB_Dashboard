import { useEffect, useState } from "react";
import SimpleBarComponent from "../../../../../../components/shared/simplebar";
import { TabContent, TabPane, Button, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import { useRouter } from "next/router";
import FullScreen from "../../../../../../components/shared/header/full-screen";
import ToggleButton from "../../../../../../components/shared/header/toggle-button";
import NavTabs from "../../../../../../components/shared/navtabs";
import SessionDetails from "../../../../../../components/therapist-component/patientDetails/session/start-session/sessionDetails.component";
import BehaviourData from "../../../../../../components/therapist-component/patientDetails/session/start-session/behaviourData.component";
import MandData from "../../../../../../components/therapist-component/patientDetails/session/start-session/mandData.component";
import ActivityInstructions from "../../../../../../components/therapist-component/patientDetails/session/start-session/activityInstructions.component";
import Tutorials from "../../../../../../components/therapist-component/patientDetails/session/start-session/tutorials.component";
import { BehaviorList, DetailsSession, DetailsSessionListData, MandList, PatientBehaviorListData, ScaleIdList, SelectPatient, SessionDataList, SessionDataListSlice, SessionTrailFinish, TrailData, TrailDetails, patientHlist, patientIsLoading, patientmlist, resetBDData, selectPatientDetails } from "../../../../../../store/slice/patient.slice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import moment from "moment";
import Loader from "../../../../../../components/shared/loader";


const StartSession = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(1);
  const [customActiveTab, setCustomActiveTab] = useState(1);
  const { PatientId } = router.query
  const { SessionID } = router.query
  const { SessionTrialID } = router.query
  const [date, setdate] = useState();
  const [time, settime] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const PatientDetails = useSelector(selectPatientDetails);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const value = useSelector(patientHlist);
  useEffect(() => {
    const valueToSend = {
      PatientId,
      SessionID
    }
    dispatch(ScaleIdList(SessionTrialID));
    if (PatientId !== undefined) { dispatch(DetailsSession(valueToSend)); }
  }, [PatientId, SessionID]);

  useEffect(() => {
    dispatch(
      SelectPatient(PatientId)
    );
  }, [PatientId]);

  const data = useSelector(DetailsSessionListData);
  const TrailValue = useSelector(TrailData);
  const BehaviorValueList = useSelector(PatientBehaviorListData);
  const ValueList = useSelector(patientHlist);
  const ValueMandList = useSelector(patientmlist);
  const listData = useSelector(SessionDataListSlice);
  const loading = useSelector(patientIsLoading);



  useEffect(() => {

    if (SessionTrialID !== undefined) {
      dispatch(MandList(SessionTrialID));
      dispatch(TrailDetails(SessionTrialID));
      dispatch(BehaviorList(SessionTrialID));
    }
  }, [SessionTrialID]);

  const currentDateAndTime = new Date();

  useEffect(() => {

    const ValueToSend = {
      PatientId,
      SessionID
    }
    dispatch(SessionDataList(ValueToSend));
    setdate(currentDateAndTime);
  }, [PatientId, SessionID]);




  const onSubmit = () => {

    function flattenArray(arr) {
      return arr.reduce((result, item) => {
        if (Array.isArray(item)) {
          return result.concat(flattenArray(item));
        }
        result.push(item);
        return result;
      }, []);
    }

    setTimeout(function () {
      const date2 = new Date()
      let valueTime = (date2 - currentDateAndTime) / 1000;
      settime(valueTime)

      const data = {
        "BehaviourData": ValueList?.length == 0 ? undefined : flattenArray(ValueList),
        "MandData": ValueMandList?.length == 0 ? undefined : flattenArray(ValueMandList),
        "Duration": parseInt(time, 10)
      }
      const valueToSend = {
        data,
        PatientId,
        SessionID,
        SessionTrialID
      }
      dispatch(SessionTrailFinish(valueToSend))
      dispatch(resetBDData())

    }, );

  }

  const toggleCustomJustified = (tab) => {
    if (customActiveTab !== tab) {
      setCustomActiveTab(tab);
    }
  };
  const TabNavArray = ["Session Details", "Behaviour Data", "Mand Data", "Activity Instructions", "Tutorials"];
  useEffect(() => {
    document.body.classList.add("layout-popup-full");

    return () => {
      document.body.classList.remove("layout-popup-full");
    };
  }, []);
  function createFormatDate(date) {
    return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
  }

  let str = router.asPath.substring(0, router.asPath?.length - SessionTrialID?.length);

  const ViewDetails = (question) => {
    router.push(`${str}/${question.SessionTrialID}`);
  };

  const calculateDuration = (date1, date2) => {
    const duration = moment.duration(moment(date2).diff(moment(date1)));
    return Math.floor(duration.asMinutes());
  };

  const calculateDurationHours = (date1, date2) => {
    const duration = moment.duration(moment(date2).diff(moment(date1)));
    return Math.floor(duration.asHours());
  };

  function calculateAge(dateOfBirth) {
    const today = moment();
    const birthDate = moment(dateOfBirth);
    const age = today.diff(birthDate, 'years');
    return age;
  }

  return (
    <>
      <Modal
        className="start_assessment_modal app_modal"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
        isOpen={modalOpen}
        toggle={toggleModal}
        centered={true}
      >
        <ModalHeader toggle={toggleModal}>VR Session</ModalHeader>
        <ModalBody className="pt-1">
          <Row>
            <Col lg='6'>
              <div className="mb-4">
                <label className="form-label">AFD</label>
                <input className="form-control" value={modalData.AFD}></input>
              </div>
              <div className="mb-4">
                <label className="form-label">AttentionSpan</label>
                <input className="form-control" value={modalData.AttentionSpan}></input>
              </div>
              <div className="mb-4">
                <label className="form-label">CompletionTime</label>
                <input className="form-control" value={modalData.CompletionTime}></input>
              </div>
              <div className="mb-4">
                <label className="form-label">NoOfFail</label>
                <input className="form-control" value={modalData.NoOfFail}></input>
              </div>
              <div className="mb-4">
                <label className="form-label">NoOfPrompts</label>
                <input className="form-control" value={modalData.NoOfPrompts}></input>
              </div>
            </Col>
            <Col lg='6'>
              <div className="mb-4">
                <label className="form-label">FFD</label>
                <input className="form-control" value={modalData.FFD}></input>
              </div>
              <div className="mb-4">
                <label className="form-label">SFC</label>
                <input className="form-control" value={modalData.SFC}></input>
              </div>
              <div className="mb-4">
                <label className="form-label">StartingTime</label>
                <input className="form-control" value={modalData.StartingTime}></input>
              </div>
              <div className="mb-4">
                <label className="form-label">NoOfSuccess</label>
                <input className="form-control" value={modalData.SNoOfSuccess}></input>
              </div>
              <div className="mb-4">
                <label className="form-label">NoOfTrails</label>
                <input className="form-control" value={modalData.NoOfTrails}></input>
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="light" className="btn btn-md waves-effect waves-light action_btn" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      <div id='layout-wrapper'>
        <header id='page-topbar'>
          <div className='navbar-header'>
            <div className='d-flex'>
              <ToggleButton />
              <div className='d-flex align-items-center popup_title'>
                <h2>Start Session</h2>
              </div>
            </div>
            <div className='d-flex'>
              {/* <div className='d-flex align-items-center pr-2'>
                <label>
                  Session Time : <span className='text-primary'>00:08:24</span>
                </label>
              </div> */}
              <div className='dropdown d-none d-lg-inline-block'>
                <FullScreen />
              </div>
              <div className='dropdown d-flex align-items-center'>
                <button onClick={() => router.push("/patients/" + PatientId)} className='btn btn-rounded noti-icon waves-effect popup_close'>
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
                <h4>{PatientDetails && PatientDetails.length ? PatientDetails[0]?.PatientName : ""}</h4>
                <h6>Gender : {PatientDetails && PatientDetails.length ? PatientDetails[0]?.Gender : ""} | Age : {PatientDetails && PatientDetails.length ? calculateAge(PatientDetails[0].DOB) : ""} years</h6>
                {/* <h6>Department : KIMS Department</h6> */}
              </div>
            </div>
            <div className='sidebar_action'>
              <button onClick={() => router.push("/patients/" + PatientId)} className='btn btn-outline-light'>
                <span>Back to Patient Details</span>
                <i className='ri-home-5-line'></i>
              </button>
            </div>
          </SimpleBarComponent>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className='main-content'>
            <div className='page-content'>
              <div className='vertical_tab mx-2'>
                <SimpleBarComponent className='full_screen_content'>
                  <TabContent activeTab={activeTab} className='p-0 text-muted session-trial' id='h-tabContent'>
                    <div className='tab_data'>
                      <NavTabs customActiveTab={customActiveTab} toggleCustomJustified={toggleCustomJustified} NavigationArray={TabNavArray} />
                      <TabContent activeTab={customActiveTab} style={{ paddingRight: "0 !important" }}>
                        <TabPane tabId={1}>
                          <SessionDetails />
                        </TabPane>
                        <TabPane tabId={2} className='p-3'>
                          <BehaviourData />
                        </TabPane>
                        <TabPane tabId={3} className='p-3'>
                          <MandData />
                        </TabPane>
                        <TabPane tabId={4} className='p-3'>
                          <ActivityInstructions />
                        </TabPane>
                        <TabPane tabId={5} className='p-3'>
                          <Tutorials />
                        </TabPane>
                      </TabContent>
                    </div>
                  </TabContent>
                  {TrailValue[0]?.IsFinished === 1 ? <></> : <div className='container-action d-flex justify-content-end pb-1'>
                    <button type='button' onClick={() => router.back()} className='btn btn-light btn-md waves-effect waves-light action_btn'>
                      Cancel
                    </button>
                    <button onClick={onSubmit} disabled={loading} className='btn btn-primary btn-md waves-effect waves-light action_btn ml-2'>Finish Session</button>
                  </div>}
                  {customActiveTab === 1 ? (
                    <div className='tab-content'>
                      <div className='tab_data_header'>
                        <div className='tab_title'>
                          <h3>Trial List</h3>
                        </div>
                      </div>
                      <div className='tab_data_table table-responsive'>
                        <table className='datatable table table-bordered dt-responsive nowrap hide_length' style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
                          <thead>
                            <tr>
                              <th>Trail</th>
                              <th>Duration</th>
                              <th>Date</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {listData.map((question, key) => {
                              const durationHours = calculateDurationHours(question.StartingTime, question.CompletionTime ? question.CompletionTime : new Date())
                              const durationMinutes = calculateDuration(question.StartingTime, question.CompletionTime ? question.CompletionTime : new Date())
                              return (
                                <tr key={key}>
                                  <td>#{key + 1} {question.SessionTrialID == SessionTrialID ? <Badge className='bg-success me-1 rounded-pill'>Active</Badge> : <></>}</td>
                                  <td>{`${durationHours} hrs ${durationMinutes - (durationHours * 60)} Minutes`}</td>
                                  <td>{createFormatDate(question.Create_TS)}</td>
                                  <td>
                                    {question.SessionTrialID != SessionTrialID ? <Button color='primary' size='sm' onClick={() => ViewDetails(question)}>
                                      Switch
                                    </Button> : <></>}

                                    {data[0]?.ContentCategory === "VR" ? <Button color='primary' size='sm' style={{ marginLeft: "20px" }} onClick={() => { setModalOpen(!modalOpen), setModalData(question) }}>
                                      More Details
                                    </Button> : null}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}
                </SimpleBarComponent>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StartSession;
