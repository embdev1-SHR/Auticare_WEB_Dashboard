

const AssessmentListTests = ({ AssessmentQuestions }) => {
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
          return (
            <tr key={key}>
              <td>{Question.QuestionId}</td>
              <td>{Question.QuestionName}</td>
              <td>
                <div className="score">
                  <span style={{ backgroundColor: "#51d4c3" }} data-toggle="tooltip" data-placement="bottom" title="10 April 2022"></span>
                  <span style={{ backgroundColor: "#f46994" }} data-toggle="tooltip" data-placement="bottom" title="10 June 2022"></span>
                  <span></span>
                  <span></span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AssessmentListTests;
