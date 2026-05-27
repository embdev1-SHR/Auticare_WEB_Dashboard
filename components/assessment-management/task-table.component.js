import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAlertConfirm
} from "../../store/slice/layout.slice";
import { setUpdateData, setViewUpdateModal, updateTask } from "../../store/slice/scale.slice";
import Alert from "../shared/alert";

const AssessmentTaskTable = (question) => {

  const [alert, setAlert] = useState(false)
  const [data, setData] = useState()

  let value = question.question?.filter((e) => e.Status == 1);
  console.log("value", value);

  const dispatch = useDispatch();
  const isAlertOpen = useSelector(selectAlertConfirm);
  const handleTaskDelete = (key) => {
    setData(key)
    setAlert(true)
  };
  const onHandleConfirm = () => {

    let payloadValue = question.question?.filter((e) => e.MetricID == data);

    const payload = {
      ScaleID: payloadValue[0]?.ScaleID,
      MetricID: payloadValue[0]?.MetricID,
      "CategoryID": payloadValue[0]?.CategoryID,
      "ContentID": payloadValue[0]?.ContentID,
      "QuestionNumber": payloadValue[0]?.QuestionNumber,
      "Question": payloadValue[0].Question,
      "TaskName": payloadValue[0].TaskName,
      "TaskObjective": payloadValue[0].TaskObjective,
      "NumberOfScore": payloadValue[0].NumberOfScore,
      "Example": payloadValue[0].Example,
      "Criteria": payloadValue[0].Criteria,
      "ResponseScore5": 1,
      Status: 0
    }
    dispatch(updateTask(payload))
    setAlert(false)
  };
  const onDelete = () => {
    setAlert(false)
  };
  const onEdit = (key) => {
    dispatch(setViewUpdateModal(true))
    dispatch(setUpdateData(question.question[key]))
  }
  return (
    <>
      {alert ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onDelete} /> : null}
      <table
        className="table table-bordered dt-responsive nowrap hide_length"
        style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Task Name</th>
            <th>Question</th>
            <th>Number of Scores</th>
            <th>Objective</th>
            <th>Criteria</th>
            <th>Example</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {value?.map((qn, key) => {
            return (
              <tr key={"task_" + key}>
                <td>{qn.CategoryLabel}{key + 1}</td>
                <td>{qn.TaskName}</td>
                <td>{qn.Question}</td>
                <td>{qn.NumberOfScore}</td>
                <td>{qn.TaskObjective}</td>
                <td>{qn.Criteria}</td>
                <td>{qn.Example}</td>
                 <td>
                  <span className="me-3 text-primary" style={{ cursor: "pointer" }} onClick={() => { onEdit(key) }} >
                    <i className="mdi mdi-pencil font-size-18"></i>
                  </span>
                  <span className="text-danger" style={{ cursor: "pointer" }} onClick={() => handleTaskDelete(qn.MetricID)}>
                    <i className="mdi mdi-trash-can font-size-18"></i>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default AssessmentTaskTable;
