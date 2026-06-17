import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import Swal from "sweetalert2";
import { StoreIsLoading, storeOrderDelete, storeOrderUpdate } from "../../store/slice/store.slice";

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const OrderActions = ({ order }) => {
  const dispatch = useDispatch();
  const loading = useSelector(StoreIsLoading);

  const handleStatusChange = (status) => {
    dispatch(storeOrderUpdate({ StoreOrderID: order.StoreOrderID, OrderStatus: status }));
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Delete Order?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(storeOrderDelete(order.StoreOrderID));
      }
    });
  };

  return (
    <div className="d-flex gap-2 align-items-center">
      <UncontrolledDropdown>
        <DropdownToggle caret color="light" size="sm" disabled={loading}>
          {order.OrderStatus}
        </DropdownToggle>
        <DropdownMenu>
          {ORDER_STATUSES.map((s) => (
            <DropdownItem key={s} onClick={() => handleStatusChange(s)} disabled={s === order.OrderStatus}>
              {s}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>
      <Button color="danger" size="sm" onClick={handleDelete} disabled={loading} title="Delete order">
        <i className="mdi mdi-trash-can-outline" />
      </Button>
    </div>
  );
};

export default OrderActions;
