import RoleActions from "./role-actions.component";

import { useMemo } from "react";
import ReactTable from "../shared/react-table";

function RoleList() {
  const data = useMemo(() => [], []);

  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Role Name",
        accessor: "RoleName",
        sortType: "string",
      },
      {
        Header: "Permissions",
        accessor: "Permissions",
      },
      {
        Header: "",
        id: "Actions",
        accessor: () => {
          return <RoleActions />;
        },
      },
    ],
    []
  );
  return <ReactTable columns={columns} data={data} />;
}

export default RoleList;
