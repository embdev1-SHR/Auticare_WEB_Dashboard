import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  SelectPatient,
  fetchMetricResponseDetails,
  fetchScreeningMetricResponseList,
  selectMetricDetails,
  selectPatientDetails,
  selectResponseList,
} from "../../../../../../.././../store/slice/patient.slice";
import ScreeningResultChart from "../../../../../../../../components/patient-management/view-patient/screening/screeningResultChart.component";
import { useDispatch, useSelector } from "react-redux";
import reactSelect from "react-select";
import moment from "moment/moment";
import FullScreen from "../../../../../../../../components/shared/header/full-screen";
const ScreeningResult = () => {
  const dispatch = useDispatch();
  const { query, asPath, push } = useRouter();
  const backToPatientRedirectionPath = asPath.split("/scales");
  function backToPatient() {
    push(backToPatientRedirectionPath[0]);
  }
  const { ScaleID, PatientMetricID, PatientId } = query;
  const responseList = useSelector(selectResponseList);
  const metricDetails = useSelector(selectMetricDetails);
  const PatientDetails = useSelector(selectPatientDetails);
  const [options, setOptions] = useState([]);
  const [series, setSeries] = useState([]);
  const [percentage, setPercentage] = useState([]);
  const [color, setColor] = useState([
    "#51cec7",
    "#7da7ed",
    "#ef9981",
    "#29344a",
    "#ffc977",
  ]);

  useEffect(() => {
    dispatch(
      SelectPatient(PatientId)
    );
  }, [PatientId]);

  useEffect(() => {
    document.body.classList.add("layout-popup-full");

    // returned function will be called on component unmount
    return () => {
      document.body.classList.remove("layout-popup-full");
    };
  }, []);
  useEffect(() => {
    dispatch(
      fetchMetricResponseDetails({
        PatientID: PatientId,
        PatientMetricID: PatientMetricID,
      })
    );
    dispatch(
      fetchScreeningMetricResponseList({
        PatientID: PatientId,
        PatientMetricID: PatientMetricID,
      })
    );
  }, [PatientId, PatientMetricID, ScaleID]);
  useEffect(() => {
    const unique = [
      ...new Set(responseList?.map((item) => item.ResponseSelected)),
    ];

    setOptions(unique);

    const series = unique?.map((response) => {
      const count = responseList.filter(
        (obj) => obj.ResponseSelected === response
      ).length;
      return count;
    });

    setSeries(series);
    const percentage = series.map((count) => {
      return Math.round((count * 100) / responseList.length);
    });
    setPercentage(percentage);
  }, [responseList]);

  function calculateAge(dateOfBirth) {
    const today = moment();
    const birthDate = moment(dateOfBirth);
    const age = today.diff(birthDate, 'years');
    return age;
  }

  return (
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
              <h2>Screening Result</h2>
            </div>
          </div>

          <div className="d-flex">
            <div className="d-flex align-items-center pr-2">
              <label className="selected_label">
                Selected Scale : <span>{metricDetails?.ScaleMetricType}</span>
              </label>
            </div>

            <div className="dropdown d-none d-lg-inline-block">
              {/* <button
                type="button"
                className="btn header-item noti-icon waves-effect"
                data-toggle="fullscreen"
              >
                <i className="ri-fullscreen-line"></i>
              </button> */}
              <FullScreen />
            </div>

            <div className="dropdown d-flex align-items-center">
              <button
                onClick={backToPatient}
                className="btn btn-rounded noti-icon waves-effect popup_close"
              >
                <i className=" ri-close-line"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="vertical-menu user_bg">
        <div data-simplebar className="nav-area h-100">
          <div className="sidebar_user">
            <div className="user_pic">
              <img src="/images/users/patient_dummy.jpg" />
            </div>
            <div className="user_bio">
              <h4>{PatientDetails ? PatientDetails[0]?.PatientName : ""}</h4>
              <h6>Gender : {PatientDetails ? PatientDetails[0]?.Gender : ""} | Age : {calculateAge(PatientDetails ? PatientDetails[0]?.DOB : "")} years</h6>
              {/* <h6>Department : KIMS Department</h6> */}
            </div>
          </div>
          <div className="sidebar_action">
            <button onClick={backToPatient} className="btn btn-outline-light">
              <span>Back to Patient Details</span>
              <i className="ri-home-5-line"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="page-content">
          <div data-simplebar className="calc_height">
            <div className="result_container">
              {/* ############ Score Class Names ### --

                          No Autism       - <div className="score_content success">
                          Severe Autism   - <div className="score_content danger">
                          Mild Autism     - <div className="score_content warning">
                          Moderate Autism - <div className="score_content info">

                      -- ############ Score Class Names ###  */}
              <div className="score_content warning">
                <div className="score_circle">
                  <span>{metricDetails?.Score}</span>
                  <span>Total Score</span>
                </div>
                <h2>
                  This patient has <span>{metricDetails?.Result}</span>
                </h2>
                {/* <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris commodo urna quis auctor 
                              interdum.Duis a nulla lacus. Nulla et urna vitae libero tempor lobortis.
                          </p>  */}

                <div className="graph_analytics mt-2 mb-3">
                  <div className="chart_area">
                    <div id="donut-chart" className="apex-charts">
                      <ScreeningResultChart
                        labels={options}
                        series={series}
                        colors={color}
                      />
                    </div>
                  </div>
                  <div className="chart_details">
                    <div className="row">
                      {options?.map((option, key) => {
                        return (
                          <div key={key} className="col-md-4">
                            <div className="donut_chart_info">
                              <h5>{percentage[key]}%</h5>
                              <p className="label_info">
                                <i
                                  className="ri-stop-fill"
                                  style={{ color: color[key] }}
                                ></i>
                                {option}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <butoon
                    onClick={backToPatient}
                    className="btn btn-primary btn-md waves-effect waves-light action_btn"
                  >
                    Back to Patients
                  </butoon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreeningResult;
