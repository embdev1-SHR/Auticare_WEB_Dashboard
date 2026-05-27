
import { Nav, NavItem, NavLink } from "reactstrap";

const ScreeningDomain = (props) => {
  const { ScaleData, activeTab, toggleTab } = props;

  return (
    <Nav tabs className="nav-tabs-custom nav-justified flex-column" role="tablist">
      {ScaleData.map((scale, key) => {
        return (
          <NavItem key={key}>
            <NavLink
              style={{ cursor: "pointer" }}
              className={activeTab === key + 1 ? "active" : ""}
              onClick={() => {
                toggleTab(key + 1);
              }}
            >
              <span className="d-none d-sm-block">{scale.Domain}</span>
            </NavLink>
          </NavItem>
        );
      })}
    </Nav>
  );
};

export default ScreeningDomain;
