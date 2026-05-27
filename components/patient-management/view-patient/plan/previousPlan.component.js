import { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from "reactstrap";
import { selectPlanList, fetchPatientPlanGoalList, setSelectedPlan, selectIsPlanLoading } from "../../../../store/slice/patient.slice";
import { useSelector } from "react-redux";
import moment from "moment";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Loader from "../../../shared/loader";

const PreviousPlan = () => {
  const router = useRouter();
  const { PatientId } = router.query;
  const PlanList = useSelector(selectPlanList);
  const disabledButton = useSelector(selectIsPlanLoading);

  const [previousPlans, setPreviousPlans] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const previousPlans = PlanList;
    setPreviousPlans(previousPlans);
  }, [PlanList]);

  const onViewDetails = async (id) => {
    await setModalOpen(false)
    const plan = PlanList?.filter((plan) => plan.PlanID == id)?.[0];
    await dispatch(fetchPatientPlanGoalList({ PatientID: PatientId, PlanID: id }));
    await dispatch(setSelectedPlan(plan))
  };
  return (
    <>
      <>
        <Button type='button' onClick={() => setModalOpen(!modalOpen)} color='secondary' className='waves-effect waves-light '>
          Previous Plan
        </Button>
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} scrollable={true} className='modal right app_modal'>
          <ModalHeader toggle={() => setModalOpen(!modalOpen)}> Previous Plan</ModalHeader>
          <ModalBody>
            <table className='table table-bordered dt-responsive nowrap hide_length' style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Duration</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {previousPlans?.map((plan, key) => {
                  return plan.CompletionStatus === 0 ? (
                    <tr key={key}>
                      <td>
                        {plan.PlanName} <Badge className='bg-success me-1 rounded-pill'>Active</Badge>
                      </td>
                      <td>{moment(plan.EndDate).diff(moment(plan.StartDate), "week")} Week</td>
                      <td>
                        {/* <Button
                        onClick={(e) => {
                          onViewDetails(e.target.id);
                        }}
                        size='sm'
                        color='primary'
                        id={plan.PlanID}>
                        Load Data
                      </Button> */}
                      </td>
                    </tr>
                  ) : (
                    <tr key={key}>
                      <td>{plan.PlanName}</td>
                      <td>{moment(plan.EndDate).diff(moment(plan.StartDate), "week")} Week</td>
                      <td>
                        <Button
                          onClick={(e) => {
                            onViewDetails(e.target.id);
                          }}
                          size='sm'
                          color='primary'
                          disabled={disabledButton}
                          id={plan.PlanID}>
                          Load Data
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ModalBody>
          <ModalFooter>
            <Button type='button' color='light' onClick={() => setModalOpen(!modalOpen)} className='btn-md m-1 waves-effect waves-light action_btn'>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    </>

  );
};

export default PreviousPlan;
