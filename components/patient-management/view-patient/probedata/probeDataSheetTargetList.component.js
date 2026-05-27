import { Button } from "reactstrap";
import { ProbeData } from "../../../therapist-component/patient/features/probeData.component";
import { useSelector } from "react-redux";
import { probDataMarkAsRead, probeDataListSlice } from "../../../../store/slice/patient.slice";
import moment from "moment/moment";
import { useDispatch } from "react-redux";

const ProbeDataTargetList = () => {
  const dispatch = useDispatch();

  function createFormatDate(date) {
    return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
  }

const data=useSelector(probeDataListSlice);
let values = data?.filter((e) => e.Status == 1);
let TableFirstValues = values?.filter((e) => e.IsAchieved == 0);
let TableSecondValues = values?.filter((e) => e.IsAchieved == 1);


const MarkAsRead = (question) => {

const valueToSend={
  "TargetQuestion": question.TargetQuestion,
  "IsAchieved": 1,
  "Status": question.Status,
  ProbDataID:question.ProbDataID,
  PatientID:question.PatientID
}
  dispatch(probDataMarkAsRead(valueToSend));
};

  return (
    <>
      <table className='table table-bordered dt-responsive nowrap hide_length' style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
        <thead>
          <tr>
            <th>Q.No</th>
            <th>Targets</th>
            <th>Introduced Date</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {TableFirstValues.map((question, key) => {
            return (
              <tr key={key}>
                <td>Q{key + 1}</td>
                <td>{question.TargetQuestion}</td>
                <td>{createFormatDate(question.IntroDate)}</td>
                <td>
                  
                  <Button color='success' onClick={()=>MarkAsRead(question)} outline className='waves-effect waves-light me-1' name={`opt${key}`} id={`option${key}2`}>
                    Mark as achieved
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <hr />
      <h6 className='my-3 text-success'>Achieved Targets</h6>
      <table className='table table-bordered dt-responsive nowrap hide_length' style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
        <thead>
          <tr>
            <th>Q.No</th>
            <th>Targets</th>
            <th>Introduced Date</th>
            <th>Achieved Date</th>
          </tr>
        </thead>

        <tbody>
          {TableSecondValues.map((question, key) => {
            return (
              <tr key={key}>
                <td>Q{key + 1}</td>
                <td>{question.TargetQuestion}</td>
                <td>{createFormatDate(question.IntroDate)}</td>
                <td>{createFormatDate(question.AchieveDate)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default ProbeDataTargetList;
