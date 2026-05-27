import Link from "next/link";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllResource, setResourceEdit } from "../../store/slice/resource.slice";
import ReactTable from "../shared/react-table";
import ResourceActions from "./resource-actions.component";

function ResourceListing() {

  const dispatch = useDispatch();
  const data = useSelector(fetchAllResource);
  let values = data.filter((e) => e.Status == 1);


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
          return (<Link href={`free-resource/${row.values.FreeResourceID}`}>
            <a onClick={(e) => dispatch(setResourceEdit(false))}>{row.values.ResourceTitle}</a>
          </Link>)
        },
        sortType: "string",
      },
      {
        Header: "Media Type",
        accessor: "ResourceType",
      },
      {
        Header: "FreeResource ID",
        accessor: "FreeResourceID",
      },
      {
        Header: "",
        id: "Actions",
        accessor: (e) => { 
        return <ResourceActions FreeResourceID={e.FreeResourceID} value={e}/>},
      },
    ],
    []
  );
  return <ReactTable columns={columns} data={values} />;
}

export default ResourceListing;
