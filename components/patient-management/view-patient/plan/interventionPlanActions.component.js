import { useState } from "react";
import { useDispatch } from "react-redux";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { setAlertConfirm, setGoalId } from "../../../../store/slice/layout.slice";
import InterventionGoalEdit from "./interventionGoalEdit.component";

const InterventionPlanActions = ({ GoalObj }) => {
  console.log("GoalObj",GoalObj);
  const dispatch = useDispatch();

  const onHandleDelete = () => {
    dispatch(setAlertConfirm(true));
    dispatch(setGoalId(GoalObj.PlanGoalID));
  };

  const [editModalOpen, setEditModalOpen] = useState(false);
  const tog_static = () => {
    setEditModalOpen(!editModalOpen);
  };

  return (
    <>
      <InterventionGoalEdit setEditModalOpen={setEditModalOpen} editModalOpen={editModalOpen} GoalObj={GoalObj} />
      <UncontrolledDropdown className='float-right'>
        <DropdownToggle tag='i' style={{ cursor: "pointer" }} className='arrow-none'>
          <i className='mdi mdi-dots-vertical m-0 text-muted font-size-20'></i>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-end'>
          <DropdownItem type='button' onClick={tog_static}>
            Edit
          </DropdownItem>
          <DropdownItem onClick={onHandleDelete}>Delete</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </>
  );
};

export default InterventionPlanActions;
