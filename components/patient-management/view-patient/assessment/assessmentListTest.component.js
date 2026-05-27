import { useEffect, useState } from "react";

const AssessmentListTests = ({ AssessmentQuestions, Tab }) => {

  const [assessmentObj, setAssessmentObj] = useState([]);

  const setDateColor = () => {
    let responseDateColor = [];
    if (AssessmentQuestions?.length) {
      AssessmentQuestions?.forEach((response) => {
        response?.Response.forEach((response) => {
          const respDate = response?.Date?.slice(0, 10);
          const found = responseDateColor.some((obj) => obj.AssessmentDate === respDate && obj.AssessmentColor === response.Colour);
          if (!found) {
            responseDateColor = [...responseDateColor, { AssessmentDate: respDate, AssessmentColor: response.Colour }];
          }
        })
        
      });
      setAssessmentObj(responseDateColor);
    }
  };

  useEffect(() => {
    setDateColor();
  }, [AssessmentQuestions]);

  return (
    <>
      {assessmentObj.map((item, k) => {
        return (
          <span key={k} className='text-muted mb-0 me-3'>
            <i className='mdi mdi-square align-middle font-size-20' style={{ color: item.AssessmentColor }}></i> {item.AssessmentDate}
          </span>
        );
      })}
      <table className='table table-bordered dt-responsive nowrap hide_length' style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
        <thead>
          <tr>
            <th>Q.No</th>
            <th>Assessment Name</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>
          {AssessmentQuestions?.map((Question, key) => {
            let InputsArr = [];
            {
              /* const sortedResponse = [...Question.Response].sort((a, b) => b.ResponseID - a.ResponseID); */
            }

            for (let i = 0; i < Question.NumberOfScore; i++) {
              const newResponse = [...Question.Response].sort((a, b) => a.ResponseID - b.ResponseID);
              InputsArr.push(
                <span
                  key={`score${Tab}-${Question.CategoryID}-${Question.MetricID}-${i}`}
                  style={{ backgroundColor: newResponse[i]?.Colour }}
                  id={`score${Tab}-${Question.CategoryID}-${Question.MetricID}-${i}`}
                  data-toggle='tooltip'
                  data-placement='bottom'
                  title={newResponse[i]?.Date}></span>
              );
            }
            return (
              <tr key={key}>
                <td>{Question.QuestionNumber}</td>
                <td>{Question.Question}</td>
                <td>
                  <div className='score'>{InputsArr}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default AssessmentListTests;
