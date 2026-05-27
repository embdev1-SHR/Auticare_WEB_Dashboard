import { useMemo } from "react";
import ReactTable from "../shared/react-table";
import { useSelector } from "react-redux";
import { PaymentSearch, fetchAllPaymentList } from "../../store/slice/payment.slice";
import PaymentActions from "./payment-actions.component";
import moment from "moment";

function PaymentList() {

  const data = useSelector(PaymentSearch);
  let values = data.filter((e) => e.Status == 1);


function createFormatDate(date) {
  return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
}

  const formattedAmount = (amount) => { return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }); }

  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Payment Type",
        accessor: "PaymentType",
        sortType: "string",
      },
      {
        Header: "Client",
        accessor: "ClientName",
      },
      {
        Header: "Date",
        accessor: "Create_TS",
        Cell: ({ row }) => {
          return (createFormatDate(row.original.Create_TS))
        },
      },
      {
        Header: "Amount",
        accessor: "Amount",
        Cell: ({ row }) => {
          return (formattedAmount(row.original.Amount))
        },
      },

      {
        Header: "",
        id: "Actions",
        accessor: (e) => { 
          return <PaymentActions PaymentID={e.PaymentID} values={e}/>},
        }      
    ],
    []
  );
  return <ReactTable columns={columns} data={values} />;
}

export default PaymentList;
