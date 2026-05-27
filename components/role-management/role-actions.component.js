import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import {
  selectSetModalOpenState,
  setModalOpen,
} from "../../store/slice/layout.slice";

function RoleActions() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const ModalOpenState = useSelector(selectSetModalOpenState);

  const tog_standard = () => {
    dispatch(setModalOpen(!ModalOpenState));
  };

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
          <DropdownItem onClick={tog_standard}> Edit</DropdownItem>
          <DropdownItem>Suspend</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
export default RoleActions;
