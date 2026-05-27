
import { ProbeData } from "../../patient/features/probeData.component";

const ProbeDataTargetList = () => {
  return (
    <table className="table table-bordered dt-responsive nowrap hide_length" style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
      <thead>
        <tr>
          <th>Q.No</th>
          <th>Targets</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {ProbeData[0].Questions.map((question, key) => {
          return (
            <tr key={key}>
              <td>Q{key + 1}</td>
              <td>{question.QuestionName}</td>
              <td>
                <div className="btn-group mt-2 mt-xl-0" role="group" aria-label="Basic radio toggle button group">
                  <input type="radio" className="btn-check" name={`opt${key}`} id={`option${key}1`} autoComplete="off" defaultChecked />
                  <label
                    className="btn btn-outline-green"
                    htmlFor={`option${key}1`}
                    style={{ borderTopLeftRadius: " 0.25rem", borderBottomLeftRadius: " 0.25rem" }}
                  >
                    Yes
                  </label>

                  <input type="radio" className="btn-check" name={`opt${key}`} id={`option${key}2`} autoComplete="off" />
                  <label className="btn btn-outline-green" htmlFor={`option${key}2`}>
                    No
                  </label>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ProbeDataTargetList;
