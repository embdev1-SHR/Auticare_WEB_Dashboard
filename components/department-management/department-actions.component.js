import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import { departmentDeletion, getDepartment, selectCurrentDepartmentId, setCurrentDepartmentId, setEdit, setView } from "../../store/slice/department.slice";
import { selectAlertConfirm, setAlertConfirm, setModalOpen } from "../../store/slice/layout.slice";
import Alert from "../shared/alert";
import { selectUserID, selectRole } from "../../store/slice/auth.slice";

function DepartmentActions({ Department }) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const IsAlert = useSelector(selectAlertConfirm);
  const currentId = useSelector(selectCurrentDepartmentId);
  const [alert, setAlert] = useState(false);
  const UserId = useSelector(selectUserID);
  const role = useSelector(selectRole);
  const canManage = UserId === Department.Create_By || ["SuperAdmin", "Admin", "Center"].includes(role);

  const onDeleteHandle = (id) => {
    dispatch(setCurrentDepartmentId(id));
    setAlert(true);
  };
  const onDeleteConfirm = () => {
    setAlert(false);
    dispatch(departmentDeletion(currentId));
  };
  const onCancel = () => {
    setAlert(false);
  };

  const onEdit = async () => {
    dispatch(setEdit(true));
    await dispatch(getDepartment(Department.DepartmentID));
    dispatch(setView(true));
  };

  const onView = async () => {
    dispatch(setEdit(false));
    await dispatch(getDepartment(Department.DepartmentID));
    dispatch(setView(true));
  };

  return (
    <div className='dropdown float-right'>
      <Dropdown direction='right' isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle color='light' className='btn-rounded more_vert_btn' caret>
          <i className='mdi mdi-dots-vertical'></i>
        </DropdownToggle>
        <DropdownMenu style={{marginBottom:"-110%",marginRight:"20%"}}>
          <DropdownItem onClick={onView}>View Details</DropdownItem>
          {canManage && <><DropdownItem onClick={onEdit}>Edit</DropdownItem>
          <DropdownItem onClick={() => onDeleteHandle(Department.DepartmentID)}>Delete</DropdownItem> </>}
        </DropdownMenu>
      </Dropdown>
      {alert ? <Alert onHandleConfirm={onDeleteConfirm} onDelete={onCancel}/> : null}
    </div>
  );
}
export default DepartmentActions;
