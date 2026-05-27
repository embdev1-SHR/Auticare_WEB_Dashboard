import { Button } from "reactstrap";
import { SessionData } from "../../../therapist-component/patient/features/sessionData.component";

const SessionReport = () => {
  return (
    <table className='datatable table table-bordered dt-responsive nowrap hide_length' style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
      <thead>
        <tr>
          <th>SL.No</th>
          <th>Session Name</th>
          <th>Session Type</th>
          <th>Date</th>
          <th>Duration</th>
          <th>Completion %</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {SessionData.map((session, key) => {
          return (
            <tr key={key}>
              <td>#{key + 1}</td>
              <td>{session.SessionName}</td>
              <td>VR Therapy</td>
              <td>12 June 2022</td>
              <td>14 min 28 sec</td>
              <td>70%</td>
              <td>
                <Button color='info' size='sm'>
                  Download
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default SessionReport;
