import ScreeningScoreSystem from "./startScreeningScoring.component";
import { useDispatch, useSelector } from "react-redux";
import { selectResponseData,setResponseData } from "../../../../store/slice/patient.slice";

const ScreeningTest = ({ Tab, DomainQuestions }) => {
  const result=useSelector(selectResponseData);
  const dispatch=useDispatch();
 
  const handleResponse=(index,response)=>{
      const data=[...result.Responses]
      data[Number(index)]=response
      dispatch(setResponseData({...result,Responses:data}))

  }
  return (
    <table className='table table-bordered dt-responsive nowrap hide_length' style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
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
              <td>{Question.Question}</td>
              <td>
                <ScreeningScoreSystem keyId={Tab + "-" + Question.CategoryID + "-" + Question.QuestionNumber} score={Question.Score} Question={Question} handleResponse={handleResponse}/>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ScreeningTest;
