import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Badge } from "reactstrap";
import { selectScaleList } from "../../store/slice/scale.slice";
import ReactTable from "../shared/react-table";
import LinkComponent from "./link.component";
import ScaleActions from "./scale-actions.component";
import { PaymentSearch } from "../../store/slice/payment.slice";

function ScaleList() {
  const scaleList = useSelector(selectScaleList);
  const SearchData = useSelector(PaymentSearch);
  const originalData = SearchData.length != 0 ? SearchData : scaleList;
  const data = useMemo(() => originalData, [originalData]);
  const ScaleStatus = data.filter(
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
        accessor: (currentVal) => <LinkComponent currentVal={currentVal} />,
      },
      {
        Header: "Scale Metric",
        id: "ScaleMetric",
        accessor: (currentVal) => {
          return (
            <Badge className={`font-size-12 badge-soft-${currentVal.ScaleMetric === "Screening" ? "info" : "success"} me-1`} color={currentVal.ScaleMetric === "Screening" ? "info" : "success"} pill>
              {currentVal.ScaleMetric}
            </Badge>
          );
        },
      },
      {
        Header: "Scale Metric Type",
        accessor: "ScaleMetricType",
      },
      {
        Header: "Accreditation",
        accessor: "Accreditation",
      },
      {
        Header: "Scale Category",
        id: "ScaleCategory",
        accessor: (currentVal) => {
          return (
            <Badge className={`font-size-12 badge-soft-${currentVal.ScaleCategory === "Standardized" ? "primary" : "warning"} me-1`} color={currentVal.ScaleCategory === "Standardized" ? "primary" : "warning"} pill>
              {currentVal.ScaleCategory}
            </Badge>
          );
        },
      },
      {
        Header: "",
        id: "Actions",
        accessor: (row) => <ScaleActions scale={row} />,
      },
    ],
    []
  );
  return <ReactTable columns={columns} data={ScaleStatus} />;
}
export default ScaleList;
