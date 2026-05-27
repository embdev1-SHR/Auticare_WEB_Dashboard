import dynamic from "next/dynamic";
import "@asseinfo/react-kanban/dist/styles.css";
import { Row, Col, Badge, CardBody, Card, Button } from "reactstrap";
import PreviousPlan from "./previousPlan.component";
import { useEffect, useState } from "react";
import moment from "moment";
import { resetPlanState, updatePatientPlanGoal } from "../../../../store/slice/patient.slice";
import { useDispatch } from "react-redux";
import InterventionPlanActions from "./interventionPlanActions.component";
import Alert from "../../../shared/alert";
import { useSelector } from "react-redux";
import {
  getGoalId,
  selectAlertConfirm,
  setAlertConfirm,
} from "../../../../store/slice/layout.slice";
import { selectPlanGoals, selectSelectedPlan, deletePatientPlanGoal } from "../../../../store/slice/patient.slice";
const Board = dynamic(() => import("@asseinfo/react-kanban"), {
  ssr: false,
});

const InterventionPlan = ({ isActives, selectedPlan, Active, setEnd, onUpdate, PlanID, PatientID }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState();
  const [goals, setGoals] = useState();
  const goalsData = useSelector(selectPlanGoals);
  const plan = useSelector(selectSelectedPlan)

  const deleteAlertOpen = useSelector(selectAlertConfirm);
  const deleteGoalId = useSelector(getGoalId);
  useEffect(() => {
    const statusData = goalsData?.filter((e) => e.Status == 1);
    setGoals(statusData);
  }, [goalsData]);

  const onHandleConfirm = () => {
    dispatch(setAlertConfirm(false));

    const valueToSend = {
      PatientID,
      PlanID,
      PlanGoalID: deleteGoalId
    }
    dispatch(deletePatientPlanGoal(valueToSend));
  };
  const onHandleDelete = async () => {
    dispatch(setAlertConfirm(false));
  };

  const isPlanActive = plan?.CompletionStatus === 0

  const data = async () => {

    const todoList = goals
      ?.filter((goal) => goal.Progress === "Pending")
      .map((goal, index) => {
        return { ...goal, id: goal.PlanGoalID };
      });
    const progressList = goals
      ?.filter((goal) => goal.Progress === "Progress")
      .map((goal, index) => {
        return { ...goal, id: goal.PlanGoalID };
      });
    const reviewList = goals
      ?.filter((goal) => goal.Progress === "Review")
      .map((goal, index) => {
        return { ...goal, id: goal.PlanGoalID };
      });
    const completedList = goals
      ?.filter((goal) => goal.Progress === "Completed")
      .map((goal, index) => {
        return { ...goal, id: goal.PlanGoalID };
      });
    const content = {
      columns: [
        {
          id: 1,
          title: "Todo",
          columnsubtitle: "2 Tasks",
          cards: todoList,
        },
        {
          id: 2,
          title: "In Progress",
          columnsubtitle: "3 Tasks",
          cards: progressList,
        },
        {
          id: 3,
          title: "In Review",
          columnsubtitle: "3 Tasks",
          cards: reviewList,
        },
        {
          id: 4,
          title: "Completed",
          columnsubtitle: "4 Tasks",
          cards: completedList,
        },
      ],
    };
    if (completedList?.length > 0 || reviewList?.length > 0 || progressList?.length > 0 || todoList?.length > 0) {
      setContent(content);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      data();
    },);
  }, [goals]);
  async function handleCardMove(card, source, destination) {
    let newProgress = "";
    switch (destination.toColumnId) {
      case 1:
        newProgress = "Pending";
        break;
      case 2:
        newProgress = "Progress";
        break;
      case 3:
        newProgress = "Review";
        break;
      case 4:
        newProgress = "Completed";
        break;
    }
    setContent(prev => {
      const columns = prev.columns
      let cardToMove = columns[source.fromColumnId - 1].cards.splice(source.fromPosition, 1)[0];
      columns[destination.toColumnId - 1].cards.push(cardToMove);
      return { columns }
    })

    dispatch(
      updatePatientPlanGoal({
        PlanID: card.PlanID,
        PatientID: card.PatientID,
        PlanGoalID: card.PlanGoalID,
        payload: {
          StartDate: moment(new Date(card.StartDate))
            .locale("en-in")
            .format("MM/DD/YYYY"),
          Progress: newProgress,
          Status: true,
        },
      })
    );
  }

  return (
    <>
      {deleteAlertOpen ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onHandleDelete} /> : null}
      <Row className="my-2">
        <Col md="6">
          <h5>Intervention Plan</h5>
        </Col>
        <Col md="6">
          <div className="float-right">
            <PreviousPlan />
            {isActives && selectedPlan.PlanID != null ? <></> : <Button
              color="primary"
              className="waves-effect waves-light ml-2"
              onClick={() => {
                Active();
                dispatch(resetPlanState());
              }}
            >
              Close Plan
            </Button>}
            {isActives && isPlanActive && <Button
              color="primary"
              className="waves-effect waves-light ml-2"
              onClick={() => {
                onUpdate();
                setEnd(false);
              }}
            >
              End Plan
            </Button>}
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={12}>
          {content == undefined ? <></> : <Board
            // initialBoard={content}
            onCardDragEnd={handleCardMove}
            disableColumnDrag
            disableCardDrag={!isPlanActive}
            renderColumnHeader={({ title, columnsubtitle }) => (
              <CardBody key={title}>
                <h4 className="card-title">{title}</h4>
              </CardBody>
            )}
            renderCard={(
              { GoalName, StartDate, TherapyName, PlanGoalID, Progress, PlanID, PatientID },
            ) => (
              <Card className="task-box" key={GoalName}>
                <CardBody className="borad-width">
                  {isPlanActive && <InterventionPlanActions
                    GoalObj={{
                      GoalName,
                      StartDate,
                      TherapyName,
                      PlanGoalID,
                      Progress,
                      PlanID,
                      PatientID
                    }}
                  />}

                  <div>
                    <h5 className="font-size-16">
                      <a
                        id={`${GoalName}`}
                        className="text-dark"
                      >
                        <span>{GoalName}</span>
                      </a>
                    </h5>
                  </div>

                  <div className="float-start">
                    <div>
                      <span className="text-danger m-1 align-middle">
                        <i className="ri ri-calendar-2-line "></i>
                      </span>
                      {moment(StartDate).format("DD MMM YYYY")}
                    </div>
                  </div>
                  <div className="float-right">
                    <Badge className="badge-soft-primary rounded-pill mr-1">
                      {TherapyName}
                    </Badge>
                  </div>
                </CardBody>
              </Card>
            )}
          >{content}</Board>}
        </Col>
      </Row>
    </>
  );
};

export default InterventionPlan;
