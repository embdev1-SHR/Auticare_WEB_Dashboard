import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { AtStoreUpdateSlice, IsEditStore, setAtStoreEdit, setAtStoreID } from "../../store/slice/store.slice";
import Alert from "../shared/alert";
import { useSelector } from "react-redux";
import { selectUserID } from "../../store/slice/auth.slice";

function AtStoreActions({ product }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);
  const UserId = useSelector(selectUserID);

  const handleClickView = async () => {
    dispatch(setAtStoreEdit(false));
    await router.push(`/at-store/${product.ProductID}`);
  };
  const handleClickEdit = async () => {
    dispatch(setAtStoreID(product.ProductID));
    dispatch(setAtStoreEdit(true));
    dispatch(IsEditStore(true));
  };
  const onDelete = (id) => {
    setAlert(true);
  };
  const onHandleConfirm = async () => {
    const valueToSend = {
      ...product,
      Status: 0,
      msg: "Deleted successfully"
    }
    dispatch(AtStoreUpdateSlice(valueToSend));
    setAlert(false);
  };
  const onHandleDelete = async () => {
    setAlert(false);
  };

  return (
    <div className='dropdown float-right' style={{marginLeft:"10px"}}>
      <Dropdown direction='right' isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle color='light' className='btn-rounded more_vert_btn' caret>
          <i className='mdi mdi-dots-vertical'></i>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-right-custom'>
          <DropdownItem onClick={handleClickView}>Product Details</DropdownItem>
          {UserId === product?.Create_By && <><DropdownItem onClick={handleClickEdit}>Edit</DropdownItem>
          <DropdownItem onClick={onDelete}>Delete</DropdownItem></>}
        </DropdownMenu>
      </Dropdown>
      {alert ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onHandleDelete} /> : null}
    </div>
  );
}
export default AtStoreActions;
