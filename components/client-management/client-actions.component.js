import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { clientDeletion, clientPermanentDeletion, selectCurrentClientId, setCurrentClientId, setEdit } from "../../store/slice/client.slice";
import { selectAlertConfirm } from "../../store/slice/layout.slice";
import Alert from "../shared/alert";

function ClientActions({ ClientId ,Status}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const IsAlert = useSelector(selectAlertConfirm);
  const currentId = useSelector(selectCurrentClientId);
  const [alert, setAlert] = useState(false);




  const onHandleConfirm = async () => {
    setAlert(false);
    await dispatch(clientPermanentDeletion(currentId));
  };

  const onCancelDelete = () => {
    setAlert(false);
  };

  const onEdit = () => {
    router.push({
      pathname: "/clients/[clientId]",
      query: { clientId: ClientId, edit: "true" },
    });
  };
  const onView = () => {
    router.push({
      pathname: "/clients/[clientId]",
      query: { clientId: ClientId },
    });
  };
  const onDelete = (id) => {
    dispatch(setCurrentClientId(id));
    setAlert(true);
  };

  function HandleSuspend() {

    const valueToSend={
      clientId:ClientId,
      client:false
    }

    dispatch(clientDeletion(valueToSend));
  }
  function HandleEnable() {
    const valueToSend={
      clientId:ClientId,
      client:true
    }
    dispatch(clientDeletion(valueToSend));
  }



  return (
    <div className='dropdown float-right'>
      <Dropdown direction='right' isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle color='light' className='btn-rounded more_vert_btn' caret>
          <i className='mdi mdi-dots-vertical'></i>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-right-custom' style={{marginBottom:"-110%",marginRight:"20%"}}>
          <DropdownItem onClick={onView}>View Details</DropdownItem>
          <DropdownItem onClick={onEdit}>Edit</DropdownItem>
          {/* <DropdownItem>Suspend</DropdownItem> */}

        
        
          {Status? <DropdownItem onClick={HandleSuspend}>Suspend</DropdownItem> : <DropdownItem onClick={HandleEnable}>Enable</DropdownItem>}
          <DropdownItem divider />
          <DropdownItem className="text-danger" onClick={() => onDelete(ClientId)}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {alert ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onCancelDelete} /> : null}
    </div>
  );
}
export default ClientActions;
