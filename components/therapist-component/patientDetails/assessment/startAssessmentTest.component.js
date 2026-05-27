
import { Fragment } from "react";
import AssessmentQuestionInformations from "./assessmentQuestionInfo.component";

const StartAssessmentTest = ({ AssessmentQuestions, color }) => {
  const handleScore = (e) => {
    if (e.target.checked) {
      e.target.nextSibling.style.background = color;
    } else {
      e.target.nextSibling.style.background = "transparent";
    }
  };

  return (
    <table className="table table-bordered dt-responsive nowrap hide_length" style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
      <thead>
        <tr>
          <th>Q.No</th>
          <th>Assessment Name</th>
          <th>Score</th>
        </tr>
      </thead>

      <tbody>
        {AssessmentQuestions.map((Question, key) => {
          let InputsArr = [];
          for (let i = 0; i < Question.MaxScore; i++) {
            InputsArr.push(
              <Fragment key={i}>
                <input type="checkbox" className="btn-check" id={`btncheck${key}${i}`} autoComplete="off" />
                <label className="btn" htmlFor={`btncheck${key}${i}`}></label>
              </Fragment>
            );
          }

          return (
            <tr key={key}>
              <td>
                {Question.QuestionId}
                <AssessmentQuestionInformations data={Question} />
              </td>
              <td>{Question.QuestionName}</td>
              <td>
                <div className="btn-group btn-group-sm score-group" role="group" aria-label="Basic checkbox toggle button group" onChange={handleScore}>
                  {InputsArr}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default StartAssessmentTest;
