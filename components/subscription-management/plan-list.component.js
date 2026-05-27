import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectSubscriptionPlans } from "../../store/slice/subscription.slice";
import ReactTable from "../shared/react-table";
import PlanActions from "./plan-actions.component";
function PlanList() {
  const planList = useSelector(selectSubscriptionPlans);
  const data = useMemo(() => planList, [planList]);

  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Plan Name",
        accessor: "PlanName",
        sortType: "string",
      },
      {
        Header: "Plan Id",
        accessor: "SubscriptionPlanID",
      },
      {
        Header: "Number Of Plan Active Days",
        accessor: "NumberOfPlanActiveDays",
      },
      {
        Header: "Frequency",
        accessor: "Frequency",
      },
      {
        Header: "Price",
        accessor: "Price",
      },
      {
        Header: "Onetime Fee",
        accessor: "OnetimeFee",
      },
      {
        Header: "",
        id: "Actions",
        accessor: "Actions",
        Cell: ({ row }) => {
          return  <PlanActions SubscriptionPlanID={row.values.SubscriptionPlanID} data={row.original }/>;
        },
      },
    ],
    []
  );
  return <ReactTable columns={columns} data={data} />;

}
export default PlanList;
