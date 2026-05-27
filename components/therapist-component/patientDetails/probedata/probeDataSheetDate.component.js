
import { Nav, NavItem, NavLink } from "reactstrap";

const ProbeDataSheetDate = ({ ProbeData, activeTab, toggleTab }) => {
  return (
    <Nav tabs className="nav-tabs-custom nav-justified flex-column" role="tablist">
      {ProbeData.map((probe, key) => {
        return (
          <NavItem key={key}>
            <NavLink
              style={{ cursor: "pointer" }}
              className={activeTab === key + 1 ? "active" : ""}
              onClick={() => {
                toggleTab(key + 1);
              }}
            >
              <span className="d-none d-sm-block">{probe.ProbeDate}</span>
            </NavLink>
          </NavItem>
        );
      })}
    </Nav>
  );
};

export default ProbeDataSheetDate;
