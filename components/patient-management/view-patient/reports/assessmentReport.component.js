import { useSelector } from "react-redux";
import { useMemo } from "react";
import { Button } from "reactstrap";
import { SelectPatientAssessmentList, patientAssessmentMetricReport, selectPatientDetails, } from "../../../../store/slice/patient.slice";
import ListTableLayout from "../list-table-layout.component";
import { useDispatch } from "react-redux";

function AssessmentReport() {
  const patientAssessmentList = useSelector(SelectPatientAssessmentList);
  const Patient = useSelector(selectPatientDetails)[0];
  const dispatch = useDispatch();
  const data = useMemo(() => patientAssessmentList, [patientAssessmentList]);
  const ScaleStatus = data?.filter((e) => e.Status == 1);
  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (row, index) => index + 1,
      },
      //   {
      //     Header: "Assessment ID",
      //     accessor: "PatientMetricID",
      //     sortType: "string",
      //   },
      {
        Header: "Assessment Name",
        accessor: "ScaleName",
        sortType: "string",
      },
      {
        Header: "Assessment Type",
        accessor: "ScaleMetricType",
      },
      {
        Header: "Date",
        accessor: (Current) => (Current.ScheduleStartDate !== null ? new Date(Current.ScheduleStartDate).toDateString() : "-"),
      },
      // {
      //   Header: "Result",
      //   accessor: (curValue) => {
      //     return (
      //       <span
      //         className={`badge badge-pill badge-soft-${
      //           curValue.Result === "No Autism" ? "success" : curValue.Result === "Mild Autism" ? "warning" : curValue.Result === "Moderate Autism" ? "info" : "danger"
      //         }`}>
      //         {curValue.Result}
      //       </span>
      //     );
      //   },
      // },
      // {
      //   Header: "Completion Status",
      //   accessor: "CompletionStatus",
      // },
      {
        Header: "Actions",
        id: "Actions",
        accessor: (curElement) => {
          const valueToSend = {
            PatientID: curElement.PatientID,
            ScaleID: curElement.ScaleID,
            PatientMetricID: curElement.PatientMetricID,
            ScaleName: curElement.ScaleName,
            ScaleMetricType:curElement.ScaleMetricType,
            PatientName:Patient.PatientName
          }
          return (
            <Button color='info' size='sm' onClick={(e) => dispatch(patientAssessmentMetricReport(valueToSend))} >
              Download
            </Button>
          );
        },
      },
    ],
    []
  );
  return <ListTableLayout columns={columns} data={ScaleStatus} />;
}
export default AssessmentReport;
