import { useSelector } from "react-redux";
import { useMemo } from "react";
import { tableSearchDataScreeningSlice } from "../../../../store/slice/patient.slice";
import ScreeningListActions from "./screeningListActions.component";
import ReactTable from "../../../shared/react-table";
// import { Badge } from "reactstrap";

function ScreeningList() {
  const patientScreeningList = useSelector(tableSearchDataScreeningSlice);
  const data = useMemo(() => patientScreeningList, [patientScreeningList]);
  const ScaleStatus = data?.filter(
    (e) => e.Status == 1
  );

  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Scale Name",
        accessor: "ScaleName",
        sortType: "string",
      },
      {
        Header: "Screening Type",
        accessor: "ScaleMetricType",
        // accessor: (currentVal) => {
        //   return (
        //     <Badge className={`font-size-12 badge-soft-${currentVal.ScaleMetric === "Screening" ? "info" : "success"} me-1`} color={currentVal.ScaleMetric === "Screening" ? "info" : "success"} pill>
        //       {currentVal.ScaleMetric}
        //     </Badge>
        //   );
        // },
      },
      {
        Header: "Date",
        accessor: (Current) => {
          return (Current.ScheduleStartDate !== null ? new Date(Current.ScheduleStartDate).toDateString() : "-")
        },
      },
      {
        Header: "Score",
        accessor: (curValue) => {
          return (
            curValue.Score ? curValue.Score : "Not Started Yet"
          );
        },
      },
      {
        Header: "Result",
        accessor: (curValue) => {
          return (
            curValue.Result ? <span
              className={`badge badge-pill badge-soft-${curValue.Result === "No Autism" ? "success" : curValue.Result === "Mild Autism" ? "warning" : curValue.Result === "Moderate Autism" ? "info" : "danger"
                }`}>
              {curValue.Result}
            </span> : "Not Started Yet"
          );
        },
      },
      {
        Header: "",
        id: "Actions",
        accessor: (curElement) => {
          return <ScreeningListActions PatientMetric={curElement} />;
        },
      },
    ],
    []
  );
  return <ReactTable columns={columns} data={ScaleStatus} />;
}
export default ScreeningList;
