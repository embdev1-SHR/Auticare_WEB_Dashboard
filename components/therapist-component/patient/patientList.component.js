
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import ReactTable from "../../shared/react-table";
import { Patients } from "./features/patientData.component";
import PatientActions from "./patientListItemActions.component";

function ClientList() {
  const data = useMemo(() => Patients, []);

  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (_row, i) => {
          return i + 1;
        },
      },
      {
        Header: "Patient Name",
        accessor: "PatientName",
        Cell: ({ row }) => (
          <Link href={`patients/${Number(row.id) + 1}`}>
            <a className="user_media d-flex align-items-center">
              <div className="user_icon d-flex align-items-center justify-content-center mr-2">
                <Image src={`/images/users/${row.original.Photo}`} alt="patient" width={"100%"} height={"100%"} />
              </div>
              <div className="user_media_body align-items-center">
                <span>{row.values.PatientName}</span>
              </div>
            </a>
          </Link>
        ),
        sortType: "string",
      },
      {
        Header: "Age",
        accessor: "Age",
      },
      {
        Header: "Gender",
        accessor: "Gender",
        sortType: "string",
      },
      {
        Header: "Center",
        accessor: "Center",
        sortType: "string",
      },
      {
        Header: "Department",
        accessor: "Department",
        sortType: "string",
      },
      {
        Header: "Plan Progress",
        accessor: "PlanProgress",
        Cell: ({ row }) => {
          const { PlanProgress } = row.values;
          return (
            <span
              className={`badge badge-pill badge-soft-${PlanProgress < 25 ? "danger" : PlanProgress < 40 ? "warning" : PlanProgress < 70 ? "info" : "success"}`}
            >
              {PlanProgress}%
            </span>
          );
        },
      },
      {
        Header: "",
        accessor: "Actions",
        Cell: () => {
          return <PatientActions />;
        },
        disableSortBy: true,
      },
    ],
    []
  );
  return <ReactTable columns={columns} data={data} />;
}
export default ClientList;
