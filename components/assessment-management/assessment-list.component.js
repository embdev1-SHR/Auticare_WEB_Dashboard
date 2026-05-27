import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAssessments } from "../../store/slice/assessment.slice";
import ReactTable from "../shared/react-table";
import AssessmentActions from "./assessment-actions.component";

function AssessmentList() {
const assessmentList=useSelector(selectAssessments);
const data = useMemo(() => assessmentList, [assessmentList]);

  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Assessment Name",
        accessor: "AssessmentName",
        sortType: "string",
      },
      {
        Header: "Assessment Id",
        accessor: "AssessmentID",
      },
      {
        Header: "Accreditation",
        accessor: "Accreditation",
      },
      {
        Header: "Region",
        accessor: "Region",
      },
      {
        Header: "",
        id: "Actions",
        accessor: () => <AssessmentActions />,
      },
    ],
    []
  );
  return <ReactTable columns={columns} data={data} />;
}
 
export default AssessmentList;
