
import { SessionData } from "../../patient/features/sessionData.component";
import SessionListActions from "./sessionListActions.component";

const SessionList = () => {
  return (
    <table className="datatable table table-bordered dt-responsive nowrap hide_length" style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
      <thead>
        <tr>
          <th>SL.No</th>
          <th>Session Name</th>
          <th>Date</th>
          <th>Session Type</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {SessionData.map((session, key) => {
          return (
            <tr key={key}>
              <td>#{key + 1}</td>
              <td>{session.SessionName}</td>
              <td>12 June 2022</td>
              <td>VR Therapy</td>
              <td>
                <span className="badge badge-pill badge-soft-warning">Upcoming</span>
              </td>
              <td>
                <SessionListActions />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default SessionList;
