import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { useState } from "react";

const CommentActions = () => {
  const [isActive, setIsActive] = useState(false);
  const toggleNotification = () => setIsActive(!isActive);

  return (
    <div>
      <Dropdown isOpen={isActive} toggle={toggleNotification}>
        <DropdownToggle tag='button' className='btn dropdown-toggle' type='button'>
          <i className='mdi mdi-dots-horizontal font-size-20'></i>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-right'>
          <DropdownItem href='#'>Edit</DropdownItem>
          <DropdownItem href='#'>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default CommentActions;
