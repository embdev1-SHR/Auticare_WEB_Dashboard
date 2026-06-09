import { useRouter } from "next/router";
import { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

const SessionListActions = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleStartSession = () => {
    router.push(`/start-session`);
  };

  const handleSessionReport = () => {
    router.push(`/session-report`);
  };

  return (
    <Dropdown direction='right' isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
      <DropdownToggle color='light' className='btn-rounded more_vert_btn' caret>
        <i className='mdi mdi-dots-vertical'></i>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={handleStartSession}>Start Session</DropdownItem>
        <DropdownItem onClick={handleSessionReport}>Session Report</DropdownItem>
        <DropdownItem>View Details</DropdownItem>
        <DropdownItem>Suspend</DropdownItem>
        <DropdownItem>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default SessionListActions;
