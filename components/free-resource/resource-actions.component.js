import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { UpdateFreeResources, setResourceEdit } from "../../store/slice/resource.slice";
import Alert from "../shared/alert";
import { useSelector } from "react-redux";
import { selectUserID } from "../../store/slice/auth.slice";

function ResourceActions({ FreeResourceID, value }) {

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);
  const UserId = useSelector(selectUserID);

  const handleClickView = async () => {
    dispatch(setResourceEdit(false));
    await router.push(`/free-resource/${FreeResourceID.FreeResourceID || FreeResourceID}`);
  };
  const handleClickEdit = async () => {
    dispatch(setResourceEdit(true));
    await router.push(`/free-resource/${FreeResourceID.FreeResourceID || FreeResourceID}?edit=true`);
  };
  const onDelete = (id) => {
    setAlert(true);
  };
  const onHandleConfirm = async () => {
    const data = {
      "ResourceTitle": value?.ResourceTitle,
      "ResourceDescription": value?.ResourceDescription,
      "ResourceType": value?.ResourceType,
      "ResourceURL": value?.ResourceURL,
      "Status": 0
    }
    const valueToSend = {
      data,
      FreeResourceID: FreeResourceID,
      msg: "Deleted successfully"
    }
    dispatch(UpdateFreeResources(valueToSend));
    setAlert(false);
  };
  const onHandleDelete = async () => {
    setAlert(false);
  };

  return (
    <div className='dropdown float-right'>
      <Dropdown direction='right' isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle color='light' className='btn-rounded more_vert_btn' caret>
          <i className='mdi mdi-dots-vertical'></i>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-right-custom' style={{marginBottom:"-110%",marginRight:"20%"}}>
          <DropdownItem onClick={handleClickView}>View Details</DropdownItem>
          {UserId === value?.Create_By && <><DropdownItem onClick={handleClickEdit}>Edit</DropdownItem>
          <DropdownItem onClick={() => onDelete(FreeResourceID)}>Delete</DropdownItem></>}
        </DropdownMenu>
      </Dropdown>
      {alert ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onHandleDelete} /> : null}
    </div>
  );
}
export default ResourceActions;
