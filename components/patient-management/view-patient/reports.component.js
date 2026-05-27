import { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import ScreeningReport from "./reports/screeningReport.component";
import AssessmentReport from "./reports/assessmentReport.component";
import DropdownComponent from "../../shared/dropdown";
import SessionList from "./session/sessionList.component";

const Reports = () => {
  const [activeReport, setActiveReport] = useState(1);

  const toggleTabs = (tab) => {
    if (activeReport !== tab) {
      setActiveReport(tab);
    }
  };

  return (
    <>
      <div className='tab_data_header'>
        <div className='tab_title'>
          <h3>Reports</h3>
        </div>
        <div style={{ marginRight: "30%", flex: 1 }}>
          <Nav pills className='navtab-bg nav-justified'>
            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                className={activeReport === 1 ? "active" : null}
                onClick={() => {
                  toggleTabs(1);
                }}>
                Screening
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                className={activeReport === 2 ? "active" : null}
                onClick={() => {
                  toggleTabs(2);
                }}>
                Assessment
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                className={activeReport === 3 ? "active" : null}
                onClick={() => {
                  toggleTabs(3);
                }}>
                Session
              </NavLink>
            </NavItem>
          </Nav>
        </div>
        <div className='tab_actions'>
          <DropdownComponent
            color={"secondary"}
            name={"Export"}
            items={["Excel", "CSV", "JSON", "XML"]}
            names={"Report"}
          />
          {/* <div className='btn-group'>
            <button type='button' className='btn btn-secondary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
              Export <i className='mdi mdi-chevron-down'></i>
            </button>
            <div className='dropdown-menu dropdown-menu-right'>
              <a className='dropdown-item' href='#'>
                Excel
              </a>
              <a className='dropdown-item' href='#'>
                PDF
              </a>
            </div>
          </div> */}
        </div>
      </div>
      <TabContent activeTab={activeReport}>
        <TabPane tabId={1}>
          <ScreeningReport />
        </TabPane>
        <TabPane tabId={2}>
          <AssessmentReport />
        </TabPane>
        <TabPane tabId={3} className='p-3'>
          <SessionList report={true}/>
        </TabPane>
      </TabContent>
    </>
  );
};

export default Reports;
