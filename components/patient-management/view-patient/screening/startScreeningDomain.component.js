import { NavLink, NavItem, Nav } from "reactstrap";

const ScreeningDomain = (props) => {
  const { Categories, activeTab, toggleTab } = props;

  return (
    <Nav tabs className='nav-tabs-custom nav-justified flex-column' role='tablist'>
      {Categories.map((cat, key) => {
        return (
          <NavItem key={key}>
            <NavLink
              style={{ cursor: "pointer" }}
              className={activeTab === key + 1 ? "active" : ""}
              onClick={() => {
                toggleTab(key + 1, cat.CategoryID);
              }}>
              <span className='d-none d-sm-block'>{cat.CategoryName}</span>
            </NavLink>
          </NavItem>
        );
      })}
    </Nav>
  );
};

export default ScreeningDomain;
