import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Badge, Button } from "reactstrap";
import ReactTable from "../shared/react-table";
import { selectPendingClientList, selectIsClientPendingLoading } from "../../store/slice/client.slice";
import ApproveClientModal from "./approve-client-modal.component";
import Loader from "../shared/loader";

function PendingClientListing() {
  const pendingClients = useSelector(selectPendingClientList);
  const isLoading = useSelector(selectIsClientPendingLoading);
  const [selected, setSelected] = useState(null);

  const data = useMemo(() => pendingClients || [], [pendingClients]);

  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (_row, index) => index + 1,
      },
      {
        Header: "Organization",
        accessor: "OrgName",
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
        Header: "Registered On",
        accessor: "Create_TS",
        Cell: ({ value }) =>
          value ? new Date(value).toLocaleDateString() : <span className="text-muted">—</span>,
      },
      {
        Header: "Status",
        id: "status",
        accessor: () => (
          <Badge color="warning" pill>Pending</Badge>
        ),
      },
      {
        Header: "Action",
        id: "action",
        accessor: (row) => row,
        Cell: ({ value: row }) => (
          <Button color="primary" size="sm" outline onClick={() => setSelected(row)}>
            Review
          </Button>
        ),
      },
    ],
    []
  );

  if (isLoading) return <Loader />;

  if (!data.length) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="ri-checkbox-circle-line" style={{ fontSize: 40, display: "block", marginBottom: 12 }} />
        No pending client registrations
      </div>
    );
  }

  return (
    <>
      <ReactTable columns={columns} data={data} />
      {selected && (
        <ApproveClientModal
          pendingClient={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

export default PendingClientListing;
