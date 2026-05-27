import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Rating from "react-rating";
import { Row, Col, Card, CardBody, Label, Button } from "reactstrap";
import SimpleBarComponent from "../../../../../components/shared/simplebar";
import MiniWidgets from "../../../../../components/therapist-component/patientDetails/session/session-report/miniWidgets.component";
import { useSelector } from "react-redux";
import { DetailsSession, DetailsSessionListData, SelectPatient, SessionBehaviorList, SessionBehaviorListDataSlice, SessionDataList, SessionDataListSlice, SessionMandList, SessionMandListDataSlice, patientIsLoading, selectPatientDetails, updatePatientSession } from "../../../../../store/slice/patient.slice";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import Loader from "../../../../../components/shared/loader";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});


const SessionReport = () => {

  const router = useRouter();
  const { SessionID } = router.query
  const { PatientId } = router.query

  const dispatch = useDispatch();
  const listData = useSelector(SessionDataListSlice);
  const BehavourData = useSelector(SessionMandListDataSlice);
  const Manddata = useSelector(SessionBehaviorListDataSlice);
  const Details = useSelector(DetailsSessionListData);
  const loading = useSelector(patientIsLoading);
  const PatientDetails = useSelector(selectPatientDetails);

  let sumOfNoOfPrompts = 0;
  let sumOfNoOfSuccess = 0;
  let sumOfNoOFails = 0;

  for (let i = 0; i < listData.length; i++) {
    sumOfNoOfPrompts += listData[i].NoOfPrompts || 0;
  }
  for (let i = 0; i < listData.length; i++) {
    sumOfNoOfSuccess += listData[i].NoOfSuccess || 0;
  }
  for (let i = 0; i < listData.length; i++) {
    sumOfNoOFails += listData[i].NoOfFail || 0;
  }

  const [rating, setRating] = useState(Details[0]?.Rating != null ? Details[0]?.Rating : 4);
  const validationSchema = (Yup.object().shape({
    feedback: Yup.string().min(2, "Too Short!").max(500, "Too Long!").required("Please enter Feedback"),
    starRating: Yup.number().required("Please enter Star Rating")
  }))
  function createFormatDate(date) {
    return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
  }



  useEffect(() => {

    const ValueToSend = {
      PatientId,
      SessionID
    }
    dispatch(SessionDataList(ValueToSend));
  }, [PatientId, SessionID]);



  useEffect(() => {
    const ValueToSend1 = {
      PatientId,
      SessionID
    }
    dispatch(SessionDataList(ValueToSend1));
    const valueToSend = {
      PatientId: PatientId,
      SessionID: SessionID
    }
    dispatch(DetailsSession(valueToSend));
    dispatch(SessionMandList(SessionID));
    dispatch(SessionBehaviorList(SessionID));
  }, [PatientId, SessionID]);


  useEffect(() => {
    dispatch(
      SelectPatient(PatientId)
    );
  }, [PatientId]);


  function calculateAge(dateOfBirth) {
    const today = moment();
    const birthDate = moment(dateOfBirth);
    const age = today.diff(birthDate, 'years');
    return age;
  }

  let sumOfDifferences = moment.duration(0);

  for (let i = 0; i < listData.length; i++) {
    const startingTime = moment(listData[i].StartingTime);
    const completionTime = moment(listData[i].CompletionTime);

    if (startingTime.isValid() && completionTime.isValid()) {
      const difference = moment.duration(completionTime.diff(startingTime));
      sumOfDifferences.add(difference);
    }
  }

  const sumHours = Math.floor(sumOfDifferences.asHours());
  const sumMinutes = sumOfDifferences.minutes();


  const onSubmit = async (values) => {

    const valueToSend = {
      "SessionName": Details[0]?.SessionName,
      "SessionDate": createFormatDate(Details[0]?.SessionDate),
      "NoOfAttempt": Details[0]?.NoOfAttempt,
      "NoOfSuccess": Details[0]?.NoOfSuccess,
      "NoOfFail": Details[0]?.NoOfFail,
      "Feedback": values.feedback,
      "Rating": rating,
      "Status": true,
      SessionID,
      msg: "Feedback & Rating Added Successfully",
      PatientId
    }
    dispatch(updatePatientSession(valueToSend));
  };

  const sum = listData.reduce((accumulator, object) => {
    return accumulator + object.Duration;
  }, 0);

  useEffect(() => {
    setRating(Details[0]?.Rating != null ? Details[0]?.Rating : 4)
  }, [Details])

  useEffect(() => {
    document.body.classList.add("layout-popup-full");

    // returned function will be called on component unmount
    return () => {
      document.body.classList.remove("layout-popup-full");
    };
  }, []);

  const series = [
    {
      data: [sumOfNoOfPrompts, sumOfNoOfSuccess, sumOfNoOFails, sumHours,],
    },
  ];
  const options = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },

    title: {
      text: "Report Data",
    },
    legend: {
      show: false,
    },
    colors: ["#2E93fA", "#66DA26", "#546E7A", "#E91E63", "#FF9800"],
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true,
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "Prompted",
        "Correct",
        "Incorrect",
        "Duration",
      ],
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div id="layout-wrapper">
          <header id="page-topbar">
            <div className="navbar-header">
              <div className="d-flex">
                <button
                  type="button"
                  className="btn btn-sm px-3 font-size-24 header-item waves-effect"
                  id="vertical-menu-btn"
                >
                  <i className="ri-menu-2-line align-middle"></i>
                </button>
                <div className="d-flex align-items-center popup_title">
                  <h2>Session Report </h2>
                </div>
              </div>

              <div className="d-flex">
                <div className="dropdown d-none d-lg-inline-block">
                  <button
                    type="button"
                    className="btn header-item noti-icon waves-effect"
                    data-toggle="fullscreen"
                  >
                    <i className="ri-fullscreen-line"></i>
                  </button>
                </div>
                <div className='dropdown d-flex align-items-center'>
                  <button onClick={() => router.push("/patients/" + PatientId)} className='btn btn-rounded noti-icon waves-effect popup_close'>
                    <i className=' ri-close-line'></i>
                  </button>
                </div>
              </div>
            </div>
          </header>
          <div className="vertical-menu user_bg">
            <SimpleBarComponent className="nav-area h-100">
              <div className="sidebar_user">
                <div className="user_pic">
                  <img src="/images/users/patient_dummy.jpg" />
                </div>
                <div className="user_bio">
                  <h4>{PatientDetails && PatientDetails.length ? PatientDetails[0]?.PatientName : ""}</h4>
                  <h6>Gender : {PatientDetails && PatientDetails.length ? PatientDetails[0]?.Gender : ""} | Age : {PatientDetails && PatientDetails.length ? calculateAge(PatientDetails[0].DOB) : ""} years</h6>
                  {/* <h6>Department : KIMS Department</h6> */}
                </div>
              </div>
              <div className="sidebar_action">
                <button
                  onClick={() => router.push("/patients/" + PatientId)}
                  className="btn btn-outline-light"
                >
                  <span>Back to Patient Details</span>
                  <i className="ri-home-5-line"></i>
                </button>
              </div>
            </SimpleBarComponent>
          </div>
          <div className="main-content">
            <div className="page-content">
              <SimpleBarComponent className="full_screen_content data-content">
                <Row>
                  <Col xl={8}>
                    <MiniWidgets listData={listData} />
                    <Row>
                      <Col xl={9}>
                        <div id="chart">
                          <ReactApexChart
                            options={options}
                            series={series}
                            type="bar"
                            height={400}
                          />
                        </div>
                      </Col>
                      <Col xl={3}>
                        <Card className="mb-3">
                          <CardBody>
                            <div className="d-flex">
                              <div className="flex-1 overflow-hidden">
                                <h6 className="mb-0">{sumHours} hrs {sumMinutes} Minutes</h6>
                                <p className="text-truncate font-size-14 mb-2">
                                  Total Time
                                </p>
                              </div>
                              <span
                                className="badge badge-soft-success my-1"
                                style={{ fontSize: 17 }}
                              >
                                <i
                                  className={"ri ri-alarm-line font-size-24"}
                                  style={{ position: "relative", top: "5%" }}
                                ></i>
                              </span>
                            </div>
                          </CardBody>
                        </Card>
                        <Card className="mb-3">
                          <CardBody>
                            <div className="d-flex">
                              <div className="flex-1 overflow-hidden">
                                <h6 className="mb-0">{listData.length}</h6>
                                <p className="text-truncate font-size-14 mb-2">
                                  Trails Completed
                                </p>
                              </div>
                              <span
                                className="badge badge-soft-info my-1"
                                style={{ fontSize: 17 }}
                              >
                                <i
                                  className={"ri ri-chat-check-line font-size-24"}
                                  style={{ position: "relative", top: "5%" }}
                                ></i>
                              </span>
                            </div>
                          </CardBody>
                        </Card>
                        <Card className="mb-3">
                          <CardBody>
                            <div className="d-flex">
                              <div className="flex-1 overflow-hidden">
                                <h6 className="mb-0">{Manddata.length}</h6>
                                <p className="text-truncate font-size-14 mb-2">
                                  Mand Data
                                </p>
                              </div>
                              <span
                                className="badge badge-soft-warning my-1"
                                style={{ fontSize: 15 }}
                              >
                                <i
                                  className={"ri ri-terminal-box-line font-size-24"}
                                  style={{ position: "relative", top: "5%" }}
                                ></i>
                              </span>
                            </div>
                          </CardBody>
                        </Card>
                        <Card className="mb-3">
                          <CardBody>
                            <div className="d-flex">
                              <div className="flex-1 overflow-hidden">
                                <h6 className="mb-0">{BehavourData.length}</h6>
                                <p className="text-truncate font-size-14 mb-2">
                                  Behaviors Data
                                </p>
                              </div>
                              <span
                                className="badge badge-soft-danger my-1"
                                style={{ fontSize: 15 }}
                              >
                                <i
                                  className={"ri  ri-git-branch-line font-size-24"}
                                  style={{ position: "relative", top: "5%" }}
                                ></i>
                              </span>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                  <Col xl={4}>
                    <Formik initialValues={{
                      feedback: Details[0]?.Feedback != null ? Details[0]?.Feedback : "",
                      starRating: Details[0]?.Rating != null ? Details[0]?.Rating : 4
                    }} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
                      {({ touched, errors, handleSubmit }) => (
                        <Card>
                          <CardBody>
                            <h4 className="card-title mb-2">Feedback</h4>
                            <div className="mb-2">
                              <Field
                                component="textarea"
                                className="form-control"
                                name="feedback"
                                rows={8}
                                disabled={Details[0]?.Feedback != null ? true : false}
                                placeholder="Type feedback here..."
                              ></Field>
                              {errors.feedback && touched.feedback ? <ErrorMessage className='text-danger small' name='feedback' component='div' /> : null}
                            </div>
                            <Row>
                              <div className="mb-4">
                                <Label className="form-label required">
                                  Rate this session
                                </Label>
                                <div className="avatar-md mx-auto my-3">
                                  <span
                                    className="avatar-title rounded-circle border-light pt-2"
                                    style={{
                                      backgroundColor: "#fff",
                                      border: "2px solid",
                                    }}
                                  >
                                    <h4>{rating}/5</h4>
                                  </span>
                                </div>
                                <div className="text-center">
                                  <Rating
                                    readonly={Details[0]?.Feedback != null ? true : false}
                                    initialRating={rating}
                                    emptySymbol="badge-soft-secondary rounded-circle p-2 mr-1 ri  ri-star-line ri-2x"
                                    fullSymbol="badge-soft-warning rounded-circle p-2 mr-1 ri ri-star-fill ri-2x"
                                    //  value={rating}
                                    onChange={(e) => setRating(e)}
                                    name="starRating"
                                  />
                                  {errors.starRating && touched.starRating ? <ErrorMessage className='text-danger small' name='starRating' component='div' /> : null}
                                </div>
                              </div>
                            </Row>
                            <Row>
                              {Details[0]?.Feedback != null ? <></> : <Button type='submit' color="primary" disabled={loading} onClick={handleSubmit}>Submit Feedback</Button>}
                            </Row>
                          </CardBody>
                        </Card>
                      )}
                    </Formik>
                    {/* <EarningReports /> */}
                  </Col>
                </Row>

                <Row>
                  {/* <Sources /> */}

                  {/* <RecentlyActivity /> */}

                  {/* <RevenueByLocations /> */}
                </Row>

                <Row>
                  {/* <ChatBox /> */}

                  {/* <LatestTransactions /> */}
                </Row>
              </SimpleBarComponent>
            </div>
          </div>
        </div>)}
    </>);
};

export default SessionReport;
