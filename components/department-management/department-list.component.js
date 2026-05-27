import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectDepartmentList } from "../../store/slice/department.slice";
import ReactTable from "../shared/react-table";
import DepartmentActions from "./department-actions.component";

function DepartmentsList() {
  const departmentList = useSelector(selectDepartmentList);
  const data = useMemo(() => departmentList, [departmentList]);

  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (_row, i) => {
          return i + 1;
        },
      },
      {
        Header: "Department Name",
        accessor: "DepartmentName",
        sortType: "string",
      },
      {
        Header: "Department Id",
        accessor: "DepartmentID",
      },
      {
        Header: "Head of Department",
        accessor: "DepartmentHeadName",
        sortType: "string",
      },

      {
        Header: "",
        id: "Actions",
        accessor: (row) => <DepartmentActions Department={row} />,
      },
    ],
    []
  );

  return <ReactTable columns={columns} data={data} />;
}
export default DepartmentsList;
