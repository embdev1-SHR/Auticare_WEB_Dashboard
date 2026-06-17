import CreatePlan from "./createPlan.component";
import InterventionPlan from "./interventionPlan.component";
import { useEffect, useState } from "react";
import {
  selectPlanList,
  fetchPatientPlanList,
  updatePatientPlan,
  fetchPatientPlanGoalList,
  setSelectedPlan,
  selectIsPlanLoading,
  selectSelectedPlan,
  selectPlanGoals,
} from "../../../../store/slice/patient.slice";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../shared/loader";
import { Badge, Button, Col, Row } from "reactstrap";
import moment from "moment";

const Plan = () => {
  const router = useRouter();
  const { PatientId } = router.query;
  const dispatch = useDispatch();

  const PlanList = useSelector(selectPlanList);
  const isPlanLoading = useSelector(selectIsPlanLoading);
  const selectedPlan = useSelector(selectSelectedPlan);
  const planGoals = useSelector(selectPlanGoals);

  const [activePlan, setActivePlan] = useState({});
  const [showKanban, setShowKanban] = useState(false);
  const [planScores, setPlanScores] = useState({});

  useEffect(() => {
    dispatch(fetchPatientPlanList(PatientId));
  }, [dispatch, PatientId]);

  // cache score per plan so it persists after goals are reset
  useEffect(() => {
    if (selectedPlan?.PlanID && selectedPlan.CompletionStatus === 1 && planGoals?.length > 0) {
      const active = planGoals.filter((g) => g.Status == 1);
      if (active.length > 0) {
        const done = active.filter((g) => g.Progress === "Completed").length;
        const score = Math.round((done / active.length) * 100);
        setPlanScores((prev) => ({ ...prev, [selectedPlan.PlanID]: score }));
      }
    }
  }, [planGoals, selectedPlan?.PlanID]);

  useEffect(() => {
    const active = PlanList?.find((p) => p.CompletionStatus === 0);
    if (active) {
      dispatch(fetchPatientPlanGoalList({ PatientID: PatientId, PlanID: active.PlanID }));
      dispatch(setSelectedPlan(active));
      setActivePlan(active);
      setShowKanban(true);
    } else {
      setShowKanban(false);
      setActivePlan({});
    }
  }, [PlanList]);

  const onSelectPlan = (plan) => {
    dispatch(fetchPatientPlanGoalList({ PatientID: PatientId, PlanID: plan.PlanID }));
    dispatch(setSelectedPlan(plan));
    setActivePlan(plan);
    setShowKanban(true);
  };

  const onEndPlan = () => {
    dispatch(
      updatePatientPlan({
        PatientID: PatientId,
        PlanID: activePlan.PlanID,
        payload: {
          StartDate: moment(new Date(activePlan.StartDate)).locale("en-in").format("MM/DD/YYYY"),
          EndDate: moment(new Date()).locale("en-in").format("MM/DD/YYYY"),
          CompletionStatus: 1,
          Status: true,
        },
      })
    );
    setShowKanban(false);
    setActivePlan({});
    dispatch(setSelectedPlan({}));
  };

  const onBack = () => {
    setShowKanban(false);
    dispatch(setSelectedPlan({}));
  };

  const completedPlans = PlanList?.filter((p) => p.CompletionStatus === 1) || [];
  const activePlans = PlanList?.filter((p) => p.CompletionStatus === 0) || [];

  const computeScore = (plan) => planScores[plan.PlanID] ?? null;

  if (isPlanLoading) return <Loader />;

  return (
    <>
      {showKanban ? (
        <InterventionPlan
          isActives={activePlan.CompletionStatus === 0}
          selectedPlan={selectedPlan}
          activePlan={activePlan.CompletionStatus === 0}
          Active={onBack}
          setEnd={setShowKanban}
          onUpdate={onEndPlan}
          PatientID={PatientId}
          PlanID={activePlan.PlanID}
        />
      ) : (
        <>
          <Row className="my-2 align-items-center">
            <Col md="6">
              <h5 className="mb-0">Intervention Plan</h5>
            </Col>
            <Col md="6" className="text-end">
              <CreatePlan />
            </Col>
          </Row>

          {PlanList?.length === 0 ? (
            <div className="dropzone mb-4">
              <section>
                <div className="dz-message needsclick" style={{ textAlign: "center" }}>
                  <div className="mb-2">
                    <i className="display-4 text-muted ri-folder-open-line" />
                  </div>
                  <h5 className="mb-5">This patient has no plans yet.</h5>
                </div>
              </section>
            </div>
          ) : (
            <>
              {/* Active plans */}
              {activePlans.length > 0 && (
                <div className="mb-4">
                  <h6 className="text-muted mb-2">Active Plans</h6>
                  {activePlans.map((plan) => (
                    <div
                      key={plan.PlanID}
                      className="card border-0 shadow-sm mb-2"
                      style={{ borderLeft: "4px solid #28a745" }}
                    >
                      <div className="card-body py-3 d-flex align-items-center justify-content-between">
                        <div>
                          <strong>{plan.PlanName}</strong>
                          <span className="ms-2">
                            <Badge className="bg-success rounded-pill">Active</Badge>
                          </span>
                          <div className="text-muted small mt-1">
                            {moment(plan.StartDate).format("DD MMM YYYY")} &rarr;{" "}
                            {moment(plan.EndDate).format("DD MMM YYYY")}
                            <span className="ms-2">
                              ({moment(plan.EndDate).diff(moment(plan.StartDate), "week")} weeks)
                            </span>
                          </div>
                        </div>
                        <Button size="sm" color="primary" onClick={() => onSelectPlan(plan)}>
                          View Plan
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Completed plans */}
              {completedPlans.length > 0 && (
                <div>
                  <h6 className="text-muted mb-2">Completed Plans</h6>
                  {completedPlans.map((plan) => {
                    const score = computeScore(plan);
                    return (
                      <div
                        key={plan.PlanID}
                        className="card border-0 shadow-sm mb-2"
                        style={{ borderLeft: "4px solid #6c757d" }}
                      >
                        <div className="card-body py-3 d-flex align-items-center justify-content-between">
                          <div>
                            <strong>{plan.PlanName}</strong>
                            <span className="ms-2">
                              <Badge className="badge-soft-secondary rounded-pill">Completed</Badge>
                            </span>
                            {score !== null && (
                              <span className="ms-2">
                                <Badge
                                  className={`rounded-pill ${score >= 70 ? "bg-success" : score >= 40 ? "bg-warning" : "bg-danger"}`}
                                >
                                  Score: {score}%
                                </Badge>
                              </span>
                            )}
                            <div className="text-muted small mt-1">
                              {moment(plan.StartDate).format("DD MMM YYYY")} &rarr;{" "}
                              {moment(plan.EndDate).format("DD MMM YYYY")}
                              <span className="ms-2">
                                ({moment(plan.EndDate).diff(moment(plan.StartDate), "week")} weeks)
                              </span>
                            </div>
                          </div>
                          <Button size="sm" color="secondary" outline onClick={() => onSelectPlan(plan)}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Plan;
