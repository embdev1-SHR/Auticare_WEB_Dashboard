import UserActions from "./user-actions.component";

import { useMemo } from "react";
import ReactTable from "../shared/react-table";

function UserList() {
  const data = useMemo(() => [], []);

  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Name",
        accessor: "FullName",
        sortType: "string",
      },
      {
        Header: "Designation",
        accessor: "Designation",
      },
      {
        Header: "Email Id",
        accessor: "EmailId",
      },
      {
        Header: "Phone Number",
        accessor: "PhoneNumber",
      },
      {
        Header: "Address",
        accessor: "Address",
      },
      {
        Header: "Roles",
        accessor: "Roles",
      },

      {
        Header: "",
        id: "Actions",
        accessor: () => {
          return <UserActions />;
        },
      },
    ],
    []
  );
  return <ReactTable columns={columns} data={data} />;
}

export default UserList;
