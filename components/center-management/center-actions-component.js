import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import {
  deleteCenter,
  fetchAllCenters,
  selectCurrentCenterId,
  setCenterEdit,
  setCurrentCenterId,
} from "../../store/slice/center.slice";
import {
  selectAlertConfirm
} from "../../store/slice/layout.slice";
import Alert from "../shared/alert";

function CenterActions({ CenterID }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const IsAlert = useSelector(selectAlertConfirm);
  const currentId = useSelector(selectCurrentCenterId);
  const [alert, setAlert] = useState(false);

  const onHandleConfirm = async () => {
    setAlert(false);
    await dispatch(deleteCenter(currentId));
    await dispatch(fetchAllCenters());
  };
  const onDelete = (id) => {
    dispatch(setCurrentCenterId(id));
    setAlert(true);
  };
  const handleClickEdit = async () => {
    await dispatch(setCenterEdit(true));
    await router.push(`centers/${CenterID}`);
  };
  const handleClickView = async () => {
    await dispatch(setCenterEdit(false));
    await router.push(`centers/${CenterID}`);
  };
  const onHandleDelete = async () => {
    setAlert(false);
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
        <DropdownMenu className="dropdown-menu-right-custom"  style={{marginBottom:"-110%",marginRight:"20%"}}>
          <DropdownItem onClick={handleClickView}>View Details</DropdownItem>
          <DropdownItem onClick={handleClickEdit}>Edit</DropdownItem>
          <DropdownItem onClick={() => onDelete(CenterID)}>
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {alert ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onHandleDelete}/> : null}
    </div>
  );
}

export default CenterActions;
