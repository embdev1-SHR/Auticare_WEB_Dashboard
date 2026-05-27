import { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

function VendorActions() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="dropdown float-right">
      <Dropdown
        direction="right"
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
      >
        <DropdownToggle
          color="light"
          className="btn-rounded more_vert_btn"
          caret
        >
          <i className="mdi mdi-dots-vertical"></i>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-right">
          <DropdownItem>View Details</DropdownItem>
          <DropdownItem>Edit</DropdownItem>
          <DropdownItem>Suspend</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
export default VendorActions;
