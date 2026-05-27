import { useState } from "react";
import { useDispatch } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { markAsRead } from "../../store/slice/store.slice";

function EnquiryActions({ StoreEnquiryID }) {

  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();


  const MarkAsRead = () => {

const payload={
  "IsAdminViewed": 1,
  "Status": 1
}

const valueToSend={
  payload,
  StoreEnquiryID
}
dispatch(markAsRead(valueToSend));

  };


  return (
    <div className='dropdown float-right'>
      <Dropdown direction='right' isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle color='light' className='btn-rounded more_vert_btn' caret>
          <i className='mdi mdi-dots-vertical'></i>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-right-custom'>
          <DropdownItem onClick={MarkAsRead}>Mark As Read</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
export default EnquiryActions;
