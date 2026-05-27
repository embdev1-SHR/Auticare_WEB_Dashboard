import { useEffect, useState } from "react";
import SimpleBarComponent from "../../../../components/shared/simplebar";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import FullScreen from "../../../../components/shared/header/full-screen";
import ToggleButton from "../../../../components/shared/header/toggle-button";
import { ProbeData } from "../../../../components/therapist-component/patient/features/probeData.component";

const StartProbdata = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1);
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  useEffect(() => {
    document.body.classList.add("layout-popup-full");

    // returned function will be called on component unmount
    return () => {
      document.body.classList.remove("layout-popup-full");
    };
  }, []);

  return (
    <div id='layout-wrapper'>
      <header id='page-topbar'>
        <div className='navbar-header'>
          <div className='d-flex'>
            <ToggleButton />
            <div className='d-flex align-items-center popup_title'>
              <h2>Start Prob Datasheet</h2>
            </div>
          </div>

          <div className='d-flex'>
            <div className='dropdown d-none d-lg-inline-block'>
              <FullScreen />
            </div>

            <div className='dropdown d-flex align-items-center'>
              <button onClick={() => router.back()} className='btn btn-rounded noti-icon waves-effect popup_close'>
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
            <div className='user_bio'>
              <h4>Mitchel Givens</h4>
              <h6>Gender : Male | Age : 4 years</h6>
              <h6>Department : KIMS Department</h6>
            </div>
          </div>
          <div className='sidebar_action'>
            <button onClick={() => router.back()} className='btn btn-outline-light'>
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
                <Nav tabs className='nav-tabs-custom nav-justified flex-column' role='tablist'>
                  {ProbeData.map((probe, key) => {
                    return (
                      <NavItem key={key}>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={activeTab === key + 1 ? "active" : ""}
                          onClick={() => {
                            toggleTab(key + 1);
                          }}>
                          <span className='d-none d-sm-block'>Prob Datasheet {key + 1}</span>
                        </NavLink>
                      </NavItem>
                    );
                  })}
                </Nav>
              </SimpleBarComponent>

              <SimpleBarComponent className='full_screen_content'>
                <TabContent activeTab={activeTab} className='p-0 text-muted' id='v-tabContent'>
                  {ProbeData.map((data, i) => {
                    return (
                      <TabPane key={i} tabId={i + 1} role='tabpanel'>
                        <div className='tab_data_header'>
                          <div className='tab_title'>
                            <h3>
                              <span className='qname-full'>Probe Datasheet {i + 1}</span>
                            </h3>
                          </div>
                        </div>

                        <div className='tab_data_table table-responsive'>
                          <table className='table table-bordered dt-responsive nowrap hide_length' style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
                            <thead>
                              <tr>
                                <th>Q.No</th>
                                <th>Targets</th>
                                <th>Score</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.Questions.map((question, key) => {
                                return (
                                  <tr key={key}>
                                    <td>Q{key + 1}</td>
                                    <td>{question.QuestionName}</td>
                                    <td>
                                      <div className='btn-group mt-2 mt-xl-0' role='group' aria-label='Basic radio toggle button group'>
                                        <input type='radio' className='btn-check' name={`opt${key}`} id={`option${key}1`} autoComplete='off' defaultChecked />
                                        <label className='btn btn-outline-green' htmlFor={`option${key}1`} style={{ borderTopLeftRadius: " 0.25rem", borderBottomLeftRadius: " 0.25rem" }}>
                                          Yes
                                        </label>

                                        <input type='radio' className='btn-check' name={`opt${key}`} id={`option${key}2`} autoComplete='off' />
                                        <label className='btn btn-outline-green' htmlFor={`option${key}2`}>
                                          No
                                        </label>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </TabPane>
                    );
                  })}
                </TabContent>

                <div className='container-action d-flex justify-content-end'>
                  <button type='button' onClick={() => router.back()} className='btn btn-light btn-md waves-effect waves-light action_btn'>
                    Cancel
                  </button>

                  <Link href='screening-result'>
                    <a className='btn btn-primary btn-md waves-effect waves-light action_btn ml-2'>Finish Prob Data</a>
                  </Link>
                </div>
              </SimpleBarComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartProbdata;
