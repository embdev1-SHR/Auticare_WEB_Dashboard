
import { Button } from "reactstrap";
import Breadcrumb from "../shared/breadcrumb";

import { useSelector } from "react-redux";
import { selectClient } from "../../store/slice/client.slice";

function CenterHeader() {
  const client = useSelector(selectClient);
  return (
    <div className="patient_card">
      <div className="patient_details">
        <div className="user_basic">
          <h2>{client[0] ? client[0].ClientName : ""}</h2>
          <Breadcrumb other={"p-0"} />
        </div>
      </div>

      <div className="card_action justify-content-end">
        <Button
          type="button"
          className="btn btn-danger waves-effect waves-light"
        >
          Suspend
        </Button>
      </div>
    </div>
  );
}
export default CenterHeader;
