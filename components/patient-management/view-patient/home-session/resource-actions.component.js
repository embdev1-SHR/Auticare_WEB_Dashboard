import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { FetchAllResources, UpdateFreeResources, ViewResourcesSlice, setResourceEdit, viewResource, } from "../../../../store/slice/resource.slice";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../../../shared/alert";
import { MarkAsRead, currentHomeSessionID, setEdit, setHomeSessionEdit, updateHomeSession } from "../../../../store/slice/patient.slice";

function ResourceActions({ value }) {

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);

  const handleClickView = async () => {
    dispatch(setHomeSessionEdit(false));
    await router.push(`/patients/${value.PatientID}/home-session/${value.HomeSessionID}`);
  };
  const handleClickEdit = async () => {
    dispatch(setHomeSessionEdit(true));
    await router.push(`/patients/${value.PatientID}/home-session/${value.HomeSessionID}?edit=true`);
  };
  const onDelete = () => {
    setAlert(true);
  };
  const onHandleConfirm = async () => {
    const data = {
      "ResourceTitle": value.ResourceTitle,
      "ResourceDescription": value.ResourceDescription,
      "ResourceType": value.ResourceType,
      "ResourceURL": value.ResourceURL,
      "Status": 0
  }
  const valueToSend = {
      data,
      HomeSessionID:value.HomeSessionID,
      PatientID:value.PatientID,
      msg:"Deleted successfully"
  }
  dispatch(updateHomeSession(valueToSend))
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
        <DropdownMenu className='dropdown-menu-right-custom'  style={{marginBottom:"-100%",marginRight:"25%"}}>
          <DropdownItem onClick={handleClickView}>View Details</DropdownItem>
          <DropdownItem onClick={handleClickEdit}>Edit</DropdownItem>
          <DropdownItem onClick={onDelete}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {alert ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onHandleDelete} /> : null}
    </div>
  );
}
export default ResourceActions;
