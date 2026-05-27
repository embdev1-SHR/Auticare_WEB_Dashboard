import { useSelector } from "react-redux";
import { NavLink, NavItem, Nav } from "reactstrap";
import { selectpatientIsEdit } from "../../../store/slice/patient.slice";

function PatientTabNavigation(props) {
  const { customActiveTab, toggleCustomJustified, hasErrors, isTherapistManagementAccess } = props;
  const isEdit = useSelector(selectpatientIsEdit);

  const NavArr = isTherapistManagementAccess && !isEdit ?["Basic Details", "Historical Data", "Screening", "Assessments", "Plan", "Sessions", "Home Sessions ", "Reports", "Probe Datasheet", "Comments"]:["Basic Details", "Historical Data"];

  return (
    <Nav tabs className='nav-tabs-custom nav-justified'>
      {NavArr.map((element, key) => {
        return (
          <NavItem key={key}>
            <NavLink
              style={{ cursor: "pointer" }}
              className={customActiveTab === key + 1 ? "active" : ""}
              onClick={() => {
                !hasErrors && toggleCustomJustified(key + 1);
              }}>
              <span className='d-none d-sm-block'>{element}</span>
            </NavLink>
          </NavItem>
        );
      })}
    </Nav>
  );
}
export default PatientTabNavigation;
