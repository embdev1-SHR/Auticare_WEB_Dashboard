import React from "react";
import { NavLink, NavItem, Nav, Input, Label } from "reactstrap";
import { Domains } from "../../patient/features/sessionData.component";

const SessionDomain = (props) => {
  const { activeTab, toggleTab } = props;
  return (
    <Nav tabs className='nav-tabs-custom nav-justified flex-column' role='tablist'>
      {Domains.map((domain, key) => {
        return (
          <NavItem key={key} className='session'>
            <NavLink
              style={{ cursor: "pointer" }}
              className={activeTab === key + 1 ? "active" : ""}
              onClick={() => {
                toggleTab(key + 1);
              }}>
              <div className='d-none d-sm-block pl-1' style={{ minWidth: "100%" }}>
                <Input className='form-check-input' type='checkbox' id={`defaultCheck${key}`} style={{ borderRadius: "50%" }} />
                <Label className='form-check-label ml-1' htmlFor={`defaultCheck${key}`}>
                  {domain}
                  <div className='score mt-2' style={{ minHeight: 8, width: 200 }}>
                    <span style={{ backgroundColor: "#51d4c3" }}></span>
                    <span style={{ backgroundColor: "#51d4c3" }}></span>
                    <span style={{ backgroundColor: "#f46994" }}></span>
                    <span style={{ backgroundColor: "#51d4c3" }}></span>
                    <span></span>
                    <span></span>
                  </div>
                </Label>
              </div>
              {/* <span className='d-none d-sm-block'>{domain}</span> */}
            </NavLink>
            {/* <div className='score-block ml-2'>
              <div className='score'>
                <span style={{ backgroundColor: "#51d4c3" }}></span>
                <span style={{ backgroundColor: "#51d4c3" }}></span>
                <span style={{ backgroundColor: "#f46994" }}></span>
                <span style={{ backgroundColor: "#51d4c3" }}></span>
                <span></span>
                <span></span>
              </div>
            </div> */}
          </NavItem>
        );
      })}
    </Nav>
  );
};

export default SessionDomain;
