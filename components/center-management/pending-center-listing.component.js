import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Badge } from "reactstrap";
import ReactTable from "../shared/react-table";
import Alert from "../shared/alert";
import {
  selectPendingCenterList,
  selectIsPendingLoading,
  rejectCenter,
} from "../../store/slice/center.slice";
import ApproveCenterModal from "./approve-center-modal.component";
import Loader from "../shared/loader";

function PendingCenterListing() {
  const dispatch = useDispatch();
  const pendingCenters = useSelector(selectPendingCenterList);
  const isLoading = useSelector(selectIsPendingLoading);
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  const handleRejectConfirm = () => {
    if (rejectTarget) {
      dispatch(rejectCenter(rejectTarget.UserID));
    }
    setRejectTarget(null);
  };

  const data = useMemo(() => pendingCenters || [], [pendingCenters]);

  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (_row, index) => index + 1,
      },
      {
        Header: "Center Name",
        accessor: "CenterName",
        Cell: ({ value }) => value || <span className="text-muted">—</span>,
      },
      {
        Header: "Email",
        accessor: "EmailId",
      },
      {
        Header: "Phone",
        accessor: "Phone",
        Cell: ({ value }) => value || <span className="text-muted">—</span>,
      },
      {
        Header: "Registration Date",
        accessor: "Create_TS",
        Cell: ({ value }) =>
          value ? new Date(value).toLocaleDateString() : <span className="text-muted">—</span>,
      },
      {
        Header: "Status",
        id: "status",
        accessor: () => (
          <Badge color="warning" pill>
            Pending
          </Badge>
        ),
      },
      {
        Header: "Actions",
        id: "Actions",
        accessor: (row) => row,
        Cell: ({ value: row }) => (
          <div className="d-flex gap-2">
            <Button
              color="success"
              size="sm"
              onClick={() => setApproveTarget(row)}
            >
              Approve
            </Button>
            <Button
              color="danger"
              size="sm"
              outline
              onClick={() => setRejectTarget(row)}
            >
              Reject
            </Button>
          </div>
        ),
      },
    ],
    [pendingCenters]
  );

  if (isLoading) return <Loader />;

  if (!data.length) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="ri-checkbox-circle-line" style={{ fontSize: 40, display: "block", marginBottom: 12 }} />
        No pending center registrations
      </div>
    );
  }

  return (
    <>
      <ReactTable columns={columns} data={data} />
      {approveTarget && (
        <ApproveCenterModal
          pendingCenter={approveTarget}
          onClose={() => setApproveTarget(null)}
        />
      )}
      {rejectTarget && (
        <Alert
          onHandleConfirm={handleRejectConfirm}
          onDelete={() => setRejectTarget(null)}
        />
      )}
    </>
  );
}

export default PendingCenterListing;
