
import ScreeningScoreSystem from "./startScreeningScoring.component";

const ScreeningTest = ({ DomainQuestions }) => {
  return (
    <table className="table table-bordered dt-responsive nowrap hide_length" style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
      <thead>
        <tr>
          <th>Q.No</th>
          <th>Question Name</th>
          <th style={{ width: "400px" }}>Score</th>
        </tr>
      </thead>

      <tbody>
        {DomainQuestions.map((Question, key) => {
          return (
            <tr key={key}>
              <td>{key + 1}</td>
              <td>{Question.QuestionName}</td>
              <td>
                <ScreeningScoreSystem id={key + 1} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ScreeningTest;
