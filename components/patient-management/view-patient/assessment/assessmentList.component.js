import { useSelector } from "react-redux";
import { useMemo } from "react";
import ListTableLayout from "../list-table-layout.component";
import { SelectPatientAssessmentList } from "../../../../store/slice/patient.slice";
import AssessmentListActions from "./assessmentListActions.component";

function AssessmentMainList() {
  const patientAssessmentList = useSelector(SelectPatientAssessmentList);

  const data = useMemo(() => patientAssessmentList, [patientAssessmentList]);

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
      {
        Header: "Completion Status",
        // accessor: "CompletionStatus",
        accessor: (curElement) => {
          if (curElement.CompletionStatus == null) {
            return "Not Started Yet"
          } else if (curElement.CompletionStatus == "Pending") {
            return "On Going"
          } else
            return curElement.CompletionStatus;
        },
      },
      {
        Header: "",
        id: "Actions",
        accessor: (curElement) => {
          return <AssessmentListActions PatientMetric={curElement} />;
        },
      },
    ],
    []
  );
  return <ListTableLayout columns={columns} data={ScaleStatus} />;
}
export default AssessmentMainList;
