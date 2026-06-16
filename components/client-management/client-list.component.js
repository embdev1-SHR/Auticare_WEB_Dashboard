import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Button } from "reactstrap";
import { selectClientList, selectFilterData, setEdit } from "../../store/slice/client.slice";
import { getAllSubscriptionPlans, selectSubscriptionPlans } from "../../store/slice/subscription.slice";
import ReactTable from "../shared/react-table";
import ClientActions from "./client-actions.component";
import UnonboardedClientModal from "./unonboarded-client-modal.component";

function ManageBtn({ client }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button color="primary" size="sm" outline onClick={() => setOpen(true)}>View & Manage</Button>
      {open && <UnonboardedClientModal client={client} isOpen={open} onClose={() => setOpen(false)} />}
    </>
  );
}

function ClientList() {
  const dispatch = useDispatch();
  const ClientList = useSelector(selectClientList);
  const filterObj = useSelector(selectFilterData);
  const subscriptionPlans = useSelector(selectSubscriptionPlans);

  useEffect(() => {
    if (!subscriptionPlans.length) {
      dispatch(getAllSubscriptionPlans());
    }
  }, []);

  const filteredData = ClientList.filter((obj) => {
    return Object.keys(filterObj).every((key) => {
      return obj[key] === filterObj[key];
    });
  });

  const data = useMemo(() => filteredData, [filteredData]);

  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (_row, i) => i + 1,
      },
      {
        Header: "Client Name",
        accessor: "ClientName",
        Cell: ({ row }) =>
          row.values.ClientID ? (
            <Link href={`clients/${row.values.ClientID}`}>
              <a onClick={() => dispatch(setEdit(false))}>
                {row.values.ClientName || row.original.UserName}
              </a>
            </Link>
          ) : (
            <span>{row.values.ClientName || row.original.UserName}</span>
          ),
        sortType: "string",
      },
      {
        Header: "Client ID",
        accessor: "ClientID",
        Cell: ({ value }) => value || <span className="text-muted">—</span>,
      },
      {
        Header: "Email ID",
        accessor: "EmailId",
        sortType: "string",
      },
      {
        Header: "Onboarding",
        accessor: "OnboardingStatus",
        Cell: ({ value }) =>
          value === "Complete" ? (
            <Badge color="success" pill>Complete</Badge>
          ) : (
            <Badge color="warning" pill>Pending</Badge>
          ),
      },
      {
        Header: "Payment",
        accessor: "PaymentStatus",
        Cell: ({ value }) => {
          if (!value || value === "Not Assigned") return <Badge color="secondary" pill>Not Assigned</Badge>;
          if (value === "Pending Setup") return <Badge color="warning" pill>Pending Setup</Badge>;
          if (value === "Payment Success") return <Badge color="success" pill>Active</Badge>;
          return <Badge color="info" pill>{value}</Badge>;
        },
      },
      {
        Header: "Centers",
        accessor: "CentersCount",
      },
      {
        Header: "Therapists",
        accessor: "TherapistsCount",
      },
      {
        Header: "",
        accessor: "Actions",
        Cell: ({ row }) =>
          row.values.ClientID ? (
            <ClientActions ClientId={row.values.ClientID} Status={row.original.Status} />
          ) : (
            <ManageBtn client={row.original} />
          ),
        disableSortBy: true,
      },
    ],
    []
  );

  if (!data.length) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="ri-group-line" style={{ fontSize: 40, display: "block", marginBottom: 12 }} />
        No active clients found
      </div>
    );
  }

  return <ReactTable columns={columns} data={data} />;
}

export default ClientList;
