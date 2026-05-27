import VendorActions from "./vendor-actions.component";

import { useMemo } from "react";
import ReactTable from "../shared/react-table";

function VendorList() {
  const data = useMemo(() => [], []);

  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Vendor Name",
        accessor: "VendorName",
        sortType: "string",
      },
      {
        Header: "Vendor Id",
        accessor: "VendorId",
      },
      {
        Header: "Vendor Category",
        accessor: "VendorCategory",
      },
      {
        Header: "Contact Number",
        accessor: "ContactNumber",
      },
      {
        Header: "Email ID",
        accessor: "EmailID",
      },

      {
        Header: "",
        id: "Actions",
        accessor: () => {
          return <VendorActions />;
        },
      },
    ],
    []
  );
  return <ReactTable columns={columns} data={data} />;
}

export default VendorList;
