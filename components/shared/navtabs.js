
import { NavLink, NavItem, Nav } from "reactstrap";

const NavTabs = (props) => {
  const { customActiveTab, toggleCustomJustified, NavigationArray } = props;

  return (
    <Nav tabs className="nav-tabs-custom nav-justified app-tab">
      {NavigationArray.map((element, key) => {
        return (
          <NavItem key={key}>
            <NavLink
              style={{ cursor: "pointer" }}
              className={customActiveTab === key + 1 ? "active" : ""}
              onClick={() => {
                toggleCustomJustified(key + 1);
              }}
            >
              <span className="d-none d-sm-block">{element}</span>
            </NavLink>
          </NavItem>
        );
      })}
    </Nav>
  );
};

export default NavTabs;
