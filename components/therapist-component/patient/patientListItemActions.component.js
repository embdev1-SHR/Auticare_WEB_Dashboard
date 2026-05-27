import { useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

function PatientActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown direction="right" isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
      <DropdownToggle color="light" className="btn-rounded more_vert_btn" caret>
        <i className="mdi mdi-dots-vertical"></i>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem>View Details</DropdownItem>
        <DropdownItem>Suspend</DropdownItem>
        <DropdownItem>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default PatientActions;
