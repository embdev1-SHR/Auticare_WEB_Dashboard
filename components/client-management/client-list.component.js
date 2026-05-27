import Link from "next/link";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectClientList, selectFilterData, setEdit } from "../../store/slice/client.slice";
import ReactTable from "../shared/react-table";
import ClientActions from "./client-actions.component";

function ClientList() {
  const dispatch = useDispatch();
  const ClientList = useSelector(selectClientList);
  const filterObj = useSelector(selectFilterData);

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
        accessor: (_row, i) => {
          return i + 1;
        },
      },
      {
        Header: "Client ID",
        accessor: "ClientID",
      },
      {
        Header: "Client Name",
        accessor: "ClientName",
        Cell: ({ row }) => (
          <Link href={`clients/${row.values.ClientID}`}>
            <a onClick={(e) => dispatch(setEdit(false))}>{row.values.ClientName}</a>
          </Link>
        ),
        sortType: "string",
      },
      {
        Header: "Email ID",
        accessor: "EmailId",
        sortType: "string",
      },
      {
        Header: "Center",
        accessor: "CentersCount",
      },
      {
        Header: "Therapists",
        accessor: "TherapistsCount",
      },
      {
        Header: "",
        accessor: "Actions",
        Cell: ({ row }) => {
          return <ClientActions ClientId={row.values.ClientID} Status={row.original.Status} />;
        },
        disableSortBy: true,
      },
    ],
    []
  );
  return <ReactTable columns={columns} data={data} />;
}
export default ClientList;
