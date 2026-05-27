import { useEffect, useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import CreateSession from "./createSession.component";
import SessionList from "./sessionList.component";
import { useRouter } from "next/router";
import { patientSessionList } from "../../../../store/slice/patient.slice";
import { useDispatch } from "react-redux";

const Sessions = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <div className='tab_data_header'>
        <div className='tab_title'>
          <h3>Sessions List</h3>
        </div>
        <div className='tab_actions'>
          <div className='app-search'>
            <div className='position-relative'>
              <input type='text' className='datatable_search form-control' placeholder='Search...' />
              <span className='ri-search-line'></span>
            </div>
          </div>
          <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
            <DropdownToggle color={"secondary"} caret>
              Export <i className='mdi mdi-chevron-down'></i>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>Excel</DropdownItem>
              <DropdownItem>PDF</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <CreateSession />
        </div>
      </div>
      <div className='tab_data_table table-responsive'>
        <SessionList />
      </div>
    </>
  );
};

export default Sessions;
