
import { Nav, NavItem, NavLink } from "reactstrap";

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
                toggleTab(key + 1);
              }}
            >
              <span className="d-none d-sm-block">{assessment.Domain}</span>
            </NavLink>
          </NavItem>
        );
      })}
    </Nav>
  );
};

export default AssessmentList;
