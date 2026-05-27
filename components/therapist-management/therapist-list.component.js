import Link from "next/link";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTherapistFilterdata, selectTherapistList, setEdit } from "../../store/slice/therapist.slice";
import ReactTable from "../shared/react-table";
import TherapistActions from "./therapist-actions.component";

function TherapistList() {
  const dispatch = useDispatch();
  const TherapistList = useSelector(selectTherapistList);

  const filterObj = useSelector(selectTherapistFilterdata);
  const filteredData = TherapistList.filter((obj) => {
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
        Header: "Therapist Name",
        accessor: "Name",
        Cell: ({ row }) => (
          <Link href={`therapist/${row.values.TherapistID}`}>
            <a onClick={(e) => dispatch(setEdit(false))}>{row.original.Salutation + " " + row.values.Name}</a>
          </Link>
        ),
        sortType: "string",
      },
      {
        Header: "Therapist Id",
        accessor: "TherapistID",
      },
      {
        Header: "Email ID",
        accessor: "EmailId",
        sortType: "string",
      },
      {
        Header: "Phone Number",
        accessor: "Phone",
      },
      {
        Header: "Center",
        accessor: "CenterName",
        sortType: "string",
      },
      {
        Header: "Department",
        accessor: "DepartmentName",
        sortType: "string",
      },
      {
        Header: "Facilitator",
        accessor: "TherapistType",
        sortType: "string",
      },
      {
        Header: "Designation",
        accessor: "Designation",
        sortType: "string",
      },
      {
        Header: "Languages",
        accessor: "Language",
        sortType: "string",
      },
      {
        Header: "",
        id: "Actions",
        accessor: (row) => <TherapistActions Therapist={row} />,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return <ReactTable columns={columns} data={data} />;
}
export default TherapistList;
