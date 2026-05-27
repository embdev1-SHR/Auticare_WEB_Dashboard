
import { NavLink, NavItem, Nav } from "reactstrap";

const AssessmentList = (props) => {
  const { AssessmentData, activeTab, toggleTab } = props;
  return (
    <Nav tabs className="nav-tabs-custom nav-justified flex-column" role="tablist">
      {AssessmentData.map((assessment, key) => {
        return (
          <NavItem key={key}>
            <NavLink
              style={{ cursor: "pointer" }}
              className={activeTab === key + 1 ? "active" : ""}
              onClick={() => {
                toggleTab(key + 1,assessment.CategoryID);
              }}
            >
              <span className="d-none d-sm-block">{assessment.CategoryName}</span>
            </NavLink>
          </NavItem>
        );
      })}
    </Nav>
  );
};

export default AssessmentList;
