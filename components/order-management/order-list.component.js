import moment from "moment";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Badge } from "reactstrap";
import { fetchAllOrderList } from "../../store/slice/store.slice";
import ReactTable from "../shared/react-table";
import OrderActions from "./order-actions.component";

const STATUS_COLORS = {
  Pending: "warning",
  Processing: "info",
  Shipped: "primary",
  Delivered: "success",
  Cancelled: "danger",
};

const OrderList = () => {
  const data = useSelector(fetchAllOrderList);

  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Order ID",
        accessor: "StoreOrderID",
        sortType: "number",
      },
      {
        Header: "Product",
        accessor: "ProductName",
      },
      {
        Header: "Qty",
        accessor: "Quantity",
      },
      {
        Header: "Requester",
        accessor: "RequesterName",
      },
      {
        Header: "Phone",
        accessor: "Phone",
      },
      {
        Header: "Shipping Address",
        accessor: "ShippingAddress",
        Cell: ({ value }) => (
          <span style={{ maxWidth: "200px", display: "block", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {value}
          </span>
        ),
      },
      {
        Header: "Notes",
        accessor: "OrderNotes",
        Cell: ({ value }) => value || "-",
      },
      {
        Header: "Status",
        accessor: "OrderStatus",
        Cell: ({ value }) => (
          <Badge color={STATUS_COLORS[value] || "secondary"}>{value}</Badge>
        ),
      },
      {
        Header: "Date",
        accessor: (row) => moment(new Date(row.Create_TS)).format("DD/MM/YYYY"),
      },
      {
        Header: "Actions",
        id: "Actions",
        accessor: (row) => <OrderActions order={row} />,
      },
    ],
    []
  );

  return <ReactTable columns={columns} data={data || []} />;
};

export default OrderList;
