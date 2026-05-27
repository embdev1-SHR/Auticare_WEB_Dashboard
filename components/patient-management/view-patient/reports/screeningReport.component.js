import { useSelector } from "react-redux";
import { useMemo } from "react";
import ListTableLayout from "../list-table-layout.component";
import { ScreeningReportSlice, SelectPatientScreeningList, selectPatientDetails } from "../../../../store/slice/patient.slice";
import { Button } from "reactstrap";
import { useDispatch } from "react-redux";


function ScreeningReport() {
  const dispatch = useDispatch();
  const patientScreeningList = useSelector(SelectPatientScreeningList);
  const Patient = useSelector(selectPatientDetails)[0];
  const data = useMemo(() => patientScreeningList, [patientScreeningList]);

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
      },
      {
        Header: "Date",
        accessor: (Current) => (Current.ScheduleStartDate !== null ? new Date(Current.ScheduleStartDate).toDateString() : "-"),
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
          const valueToSend = {
            PatientID: curElement.PatientID,
            ScaleID: curElement.ScaleID,
            PatientMetricID: curElement.PatientMetricID,
            ScaleName: curElement.ScaleName,
            PatientName: Patient?.PatientName,
            ScaleMetricType: curElement.ScaleMetricType
          }
          return (
            <Button color='info' size='sm' onClick={(e) => dispatch(ScreeningReportSlice(valueToSend))} >
              Download
            </Button>
          );
        },
      },
    ],
    []
  );
  return <ListTableLayout columns={columns} data={data} />;
}
export default ScreeningReport;
