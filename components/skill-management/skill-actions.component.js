import { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import Alert from "../shared/alert";

import { useDispatch, useSelector } from "react-redux";
import {
  selectAlertConfirm,
  selectSetModalOpenState,
  setModalOpen
} from "../../store/slice/layout.slice";
import {
  SelectSkill,
  deleteSkill,
  fetchAllSkills,
  selectCurrentSkillId,
  setCurrentSkillId,
  skillIsEditForm
} from "../../store/slice/skills.slice";
import { selectUserID } from "../../store/slice/auth.slice";

function SkillActions({ skill }) {
  const dispatch = useDispatch();
  const setModalOpenState = useSelector(selectSetModalOpenState);
  const [isOpen, setIsOpen] = useState(false);
  const IsAlert = useSelector(selectAlertConfirm);
  const currentId = useSelector(selectCurrentSkillId);
  const [alert, setAlert] = useState(false);
  const UserId = useSelector(selectUserID);

  const onHandleConfirm = async () => {
    setAlert(false);
    await dispatch(deleteSkill(currentId));
    await dispatch(fetchAllSkills());
  };
  const onDelete = (id) => {
    dispatch(setCurrentSkillId(id));
    setAlert(true);
  };
  const onEditHandle = async () => {
    await dispatch(skillIsEditForm(true));
    await dispatch(SelectSkill(skill.SkillID));
    dispatch(setModalOpen(!setModalOpenState));
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
        <DropdownMenu className="dropdown-menu-right-custom">
          {UserId === skill.Create_By ? <><DropdownItem onClick={onEditHandle}>Edit</DropdownItem>
            <DropdownItem onClick={() => onDelete(skill.SkillID)}>Delete</DropdownItem></> : 
            <DropdownItem >No Options</DropdownItem>}
        </DropdownMenu>
      </Dropdown>
      {alert ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onHandleDelete} /> : null}
    </div>
  );
}
export default SkillActions;
