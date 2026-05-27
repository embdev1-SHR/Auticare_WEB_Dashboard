import Flatpickr from "react-flatpickr";
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import "flatpickr/dist/flatpickr.css";
import { updatePatientPlanGoal } from "../../../../store/slice/patient.slice";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useState } from "react";

const InterventionGoalEdit = ({ setEditModalOpen, editModalOpen, GoalObj }) => {
  const { GoalName, StartDate, TherapyName, PlanGoalID, Progress, PlanID, PatientID } = GoalObj;
  const dispatch = useDispatch();
  const [fromDate, setFromDate] = useState(StartDate);

  const planGoalUpdate = () => {
    dispatch(updatePatientPlanGoal({ PlanID: PlanID, PatientID: PatientID, PlanGoalID: PlanGoalID, payload: { StartDate: moment(new Date(fromDate)).locale("en-in").format("MM/DD/YYYY"), Progress: Progress, Status: true } }))
    setEditModalOpen(false);
  }
  return (
    <>
      <Modal isOpen={editModalOpen} toggle={() => setEditModalOpen(!editModalOpen)} backdrop='static' centered={true}>
        <ModalHeader toggle={() => setEditModalOpen(false)}>Edit Plan</ModalHeader>
        <ModalBody>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='GoalName'>
              Goal Name
            </Label>
            <Input type='text' className='form-control' name='GoalName' id='GoalName' placeholder='Enter goal' value={GoalName} />
          </div>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='StartDate'>
              Start Date
            </Label>
            {/* <Input type='text' className='form-control' name='StartDate' id='StartDate' placeholder='Enter date' value={StartDate} /> */}
            <Flatpickr
              options={{
                altInput: true,
                altFormat: "j M, Y",
                dateFormat: "d.m.Y",
              }}
              className='form-control'
              name='StartDate'
              id='StartDate'
              placeholder='Enter date'
              value={fromDate}
              onChange={(res) => {
                setFromDate(res[0].toISOString());

              }}
            />
          </div>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='TherapyName'>
              Therapy
            </Label>
            <Input type='text' className='form-control' name='TherapyName' id='TherapyName' placeholder='Enter therapy name' value={TherapyName} />
          </div>
          <ModalFooter>
            <Button
              type='button'
              color='light'
              onClick={() => {
                setEditModalOpen(false);
              }}>
              Close
            </Button>
            <Button onClick={planGoalUpdate} type='button' color='primary'>
              Update
            </Button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </>
  );
};

export default InterventionGoalEdit;
