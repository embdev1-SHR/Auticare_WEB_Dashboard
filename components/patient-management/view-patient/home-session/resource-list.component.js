import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "../../../shared/react-table";
import ResourceActions from "./resource-actions.component";
import Link from "next/link";
import { selectHomeSessionList, setHomeSessionEdit } from "../../../../store/slice/patient.slice";

function ResourceListing(PatientId) {

  const dispatch = useDispatch();
  const data = useSelector(selectHomeSessionList);
  let values = data?.filter((e) => e.Status == 1);
  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Media Tittle",
        accessor: "ResourceTitle",
        Cell: ({ row }) => {
          return (<Link href={`/patients/${row.original.PatientID}/home-session/${row.original.HomeSessionID}`}>
            <a onClick={(e) => dispatch(setHomeSessionEdit(false))}>{row.values.ResourceTitle}</a>
          </Link>)
        },
        sortType: "string",
      },
      {
        Header: "Media Type",
        accessor: "ResourceType",
      },
      {
        Header: "Status",
        accessor: "IsRead",
        Cell: ({ row }) => {
          return (row.original.IsRead == 0 ? "NA" : "Completed")
        }
      },
      {
        Header: "Rating",
        accessor: "Rating",
        Cell: ({ row }) => {
          return row.original.Rating ? (`${row.original.Rating}/5`) : "NA"
        }
      },
      {
        Header: "",
        id: "Actions",
        accessor: (e) => {
          return <ResourceActions value={e} />
        },
      },
    ],
    []
  );
  return <ReactTable columns={columns} data={values} />;
}

export default ResourceListing;
