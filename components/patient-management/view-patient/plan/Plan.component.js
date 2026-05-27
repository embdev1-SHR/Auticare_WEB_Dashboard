import CreatePlan from "./createPlan.component";
import InterventionPlan from "./interventionPlan.component";
import { useEffect, useState } from "react";
import {
  selectPlanList,
  fetchPatientPlanList,
  updatePatientPlan,
  fetchPatientPlanGoalList,
  setSelectedPlan,
  selectIsPlanLoading, selectSelectedPlan
} from "../../../../store/slice/patient.slice";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../shared/loader";
import { Col, Row } from "reactstrap";
import moment from "moment";
import PreviousPlan from "./previousPlan.component";

const Plan = () => {
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  const { PatientId } = router.query;
  const dispatch = useDispatch();
  const PlanList = useSelector(selectPlanList);
  const isPlanLoading = useSelector(selectIsPlanLoading);
  const [activePlan, setActivePlan] = useState({});
  const [active, setActive] = useState(false);
  const selectedPlan = useSelector(selectSelectedPlan)
  const disabledButton = useSelector(selectIsPlanLoading);


  useEffect(() => {
    dispatch(fetchPatientPlanList(PatientId));
  }, [dispatch, PatientId]);

  useEffect(() => {
    const plan = PlanList?.filter((plan) => plan.CompletionStatus === 0)?.[0];

    if (plan?.CompletionStatus === 0) {
      dispatch(
        fetchPatientPlanGoalList({ PatientID: PatientId, PlanID: plan?.PlanID })
      );
      setIsActive(true);
      dispatch(setSelectedPlan(plan))
      setActivePlan(plan);
    }
  }, [PlanList]);
  const onUpdate = () => {
    dispatch(
      updatePatientPlan({
        PatientID: PatientId,
        PlanID: activePlan.PlanID,
        payload: {
          StartDate: moment(new Date(activePlan.StartDate))
            .locale("en-in")
            .format("MM/DD/YYYY"),
          EndDate: moment(new Date()).locale("en-in").format("MM/DD/YYYY"),
          CompletionStatus: 1,
          Status: true,
        },
      })
    );
    setActive(false)
    setActivePlan({});
    dispatch(setSelectedPlan({}))
  };

  useEffect(() => {

    if (selectedPlan.PlanID != null) {

      setActive(true)
    }
  }, [selectedPlan]);


  const Active = () => {
    setActive(false)
    setIsActive(false);
  };

  return (
    <>


      {disabledButton ? (
        <Loader />
      ) : (
        <>

          {isActive || active ? (
            <InterventionPlan
              isActives={isActive}
              selectedPlan={selectedPlan}
              activePlan={active}
              Active={Active}
              setEnd={setIsActive}
              onUpdate={onUpdate}
              PatientID={PatientId}
              PlanID={activePlan.PlanID}
            />
          ) : isPlanLoading ? (
            <Loader />
          ) : (
            <>
              <Row className="my-2">
                <Col md="6">
                  <h5>Intervention Plan</h5>
                </Col>
                <Col md="6">
                  <div className="float-right">
                    {/* <Button
                  type="button"
                  onClick={() => setIsActive(true)}
                  color="secondary"
                  className="waves-effect waves-light "
                >
                  Previous Plan
                </Button> */}
                    <PreviousPlan />
                  </div>
                </Col>
              </Row>
              <div className="dropzone mb-4">
                <section>
                  <div
                    className="dz-message needsclick"
                    style={{ textAlign: "center" }}
                  >
                    <div className="mb-2">
                      <i className="display-4 text-muted ri-folder-open-line" />
                    </div>
                    <h5 className="mb-5">This patient has no plans yet.</h5>
                    <CreatePlan />
                  </div>
                </section>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Plan;
