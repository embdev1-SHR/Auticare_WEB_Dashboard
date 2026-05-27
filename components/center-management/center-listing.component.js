import Link from "next/link";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCenterList,
  setCenterEdit,
} from "../../store/slice/center.slice";
import ReactTable from "../shared/react-table";
import CenterActions from "./center-actions-component";

function CenterListing() {
  const dispatch = useDispatch();
  const centerListState = useSelector(selectCenterList);

  const data = useMemo(() => centerListState, [centerListState]);

  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (_row, index) => index + 1,
      },
      {
        Header: "Center Id",
        accessor: "CenterID",
      },
      {
        Header: "Center Name",
        accessor: "CenterName",
        Cell: ({ row }) => (
          <Link href={`centers/${row.values.CenterID}`}>
            <a onClick={(_e) => dispatch(setCenterEdit(false))}>
              {row.values.CenterName}
            </a>
          </Link>
        ),
        sortType: "string",
      },
      {
        Header: "Client Name",
        accessor: "ClientName",
        Cell: ({ row }) => (
          <Link href={`clients/${row.original.ClientID}`}>
            <a onClick={(_e) => dispatch(setCenterEdit(false))}>
              {row.values.ClientName}
            </a>
          </Link>
        ),
        sortType: "string",
      },
      {
        Header: "Email Id",
        accessor: "EmailId",
        sortType: "string",
      },
      {
        Header: "Center Head Name",
        accessor: "CenterHeadName",
      },
      {
        Header: "Center Head Phone Number",
        accessor: "CenterHeadPhone",
      },
      {
        Header: "",
        id: "Actions",
        accessor: (center) => <CenterActions CenterID={center.CenterID} />,
      },
    ],
    []
  );
  return <ReactTable columns={columns} data={data} />;
}

export default CenterListing;
