import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import Alert from "../shared/alert";
import { StoreIsLoading, storeOrderDelete, storeOrderUpdate } from "../../store/slice/store.slice";

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const OrderActions = ({ order }) => {
  const dispatch = useDispatch();
  const loading = useSelector(StoreIsLoading);
  const [isOpen, setIsOpen] = useState(false);
  const [alert, setAlert] = useState(false);

  const handleStatusChange = (status) => {
    dispatch(storeOrderUpdate({ StoreOrderID: order.StoreOrderID, OrderStatus: status }));
  };

  const onDeleteConfirm = () => {
    dispatch(storeOrderDelete(order.StoreOrderID));
    setAlert(false);
  };

  return (
    <div className="dropdown float-right">
      <Dropdown direction="right" isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle color="light" className="btn-rounded more_vert_btn" caret>
          <i className="mdi mdi-dots-vertical" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-right-custom">
          <DropdownItem header>Change Status</DropdownItem>
          {ORDER_STATUSES.map((s) => (
            <DropdownItem key={s} onClick={() => handleStatusChange(s)} disabled={s === order.OrderStatus || loading}>
              {s === order.OrderStatus ? <b>{s} ✓</b> : s}
            </DropdownItem>
          ))}
          <DropdownItem divider />
          <DropdownItem onClick={() => setAlert(true)}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {alert && (
        <Alert onHandleConfirm={onDeleteConfirm} onDelete={() => setAlert(false)} />
      )}
    </div>
  );
};

export default OrderActions;
