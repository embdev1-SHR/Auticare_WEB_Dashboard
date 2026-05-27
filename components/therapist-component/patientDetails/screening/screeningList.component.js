import { ScreeningData } from "../../patient/features/screeningData.component";
import ScreeningListActions from "./screeningListActions.component";

function ScreeningList() {
  return (
    <table className="datatable table table-bordered dt-responsive nowrap hide_length" style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
      <thead>
        <tr>
          <th>SL.No</th>
          <th>Screening ID</th>
          <th>Screening Type</th>
          <th>Date</th>
          <th>Performed by</th>
          <th>Score</th>
          <th>Result</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {ScreeningData.map((screening, key) => {
          const { ScreeningId, ScreeningType, ScreeningDate, TherapistPhoto, TherapistName, Score, Result } = screening;
          return (
            <tr key={key}>
              <td>#{key + 1}</td>
              <td>#{ScreeningId}</td>
              <td>{ScreeningType}</td>
              <td>{ScreeningDate}</td>
              <td>
                <div className="user_media d-flex align-items-center">
                  {TherapistPhoto !== "" ? (
                    <div className="user_icon d-flex align-items-center justify-content-center mr-2">
                      <img src={`/images/users/${TherapistPhoto}`} />
                    </div>
                  ) : (
                    <div className={`user_icon d-flex align-items-center justify-content-center mr-2 user_color${key + 1}`}>
                      <span>ES</span>
                    </div>
                  )}

                  <div className="user_media_body align-items-center">
                    <span>{TherapistName}</span>
                  </div>
                </div>
              </td>
              <td>{Score}</td>
              <td>
                <span className={`badge badge-pill badge-soft-${Score < 70 ? "success" : Score < 107 ? "warning" : Score < 154 ? "info" : "danger"}`}>
                  {Result}
                </span>
              </td>
              <td>
                <ScreeningListActions />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ScreeningList;
