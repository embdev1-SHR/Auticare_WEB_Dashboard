import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { setResourceEdit, updatePayment } from "../../store/slice/payment.slice";
import Alert from "../shared/alert";
import { selectUserID } from "../../store/slice/auth.slice";
import { useSelector } from "react-redux";

function PaymentActions({ PaymentID, values }) {

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);
  const UserId = useSelector(selectUserID);

  const handleClickView = async () => {
    dispatch(setResourceEdit(false));
    await router.push(`/payment-reports/${PaymentID}`);
  };
  const handleClickEdit = async () => {
    dispatch(setResourceEdit(true));
    await router.push(`/payment-reports/${PaymentID}?edit=true`);
  };
  const onDelete = (id) => {
    setAlert(true);
  };
  const onHandleConfirm = async () => {
    const data = {
      "ClientID": values.ClientID,
      "Amount": values.Amount,
      "Description": values.Description,
      "PaymentType": values.PaymentType,
      "Status": 0
  }
  const valueToSend={
      data,
      PaymentID,
      "msg":"Payment Deleted Successfully"
  }
  dispatch(updatePayment(valueToSend));
    setAlert(false);
  };
  const onHandleDelete = async () => {
    setAlert(false);
  };

  return (
    <div className='dropdown float-right'>
      <Dropdown direction='right' isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle color='light' className='btn-rounded more_vert_btn' caret>
          <i className='mdi mdi-dots-vertical'></i>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-right-custom'>
          <DropdownItem onClick={handleClickView}>View Details</DropdownItem>
          {UserId === values?.Create_By && <><DropdownItem onClick={handleClickEdit}>Edit</DropdownItem>
          <DropdownItem onClick={onDelete}>Delete</DropdownItem></>}
        </DropdownMenu> 
      </Dropdown>
      {alert ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onHandleDelete} /> : null}
    </div>
  );
}
export default PaymentActions;
