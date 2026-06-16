import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { deleteAtStore, IsEditStore, setAtStoreEdit, setAtStoreID } from "../../store/slice/store.slice";
import Alert from "../shared/alert";
import { selectRole } from "../../store/slice/auth.slice";

function AtStoreActions({ product }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);
  const role = useSelector(selectRole);

  const canManage = role === "SuperAdmin";

  const handleClickView = async () => {
    dispatch(setAtStoreEdit(false));
    await router.push(`/at-store/${product.ProductID}`);
  };
  const handleClickEdit = () => {
    dispatch(setAtStoreID(product.ProductID));
    dispatch(setAtStoreEdit(true));
    dispatch(IsEditStore(true));
  };
  const onHandleConfirm = () => {
    dispatch(deleteAtStore(product.ProductID));
    setAlert(false);
  };

  return (
    <div className="dropdown float-right" style={{ marginLeft: "10px" }}>
      <Dropdown direction="right" isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle color="light" className="btn-rounded more_vert_btn" caret>
          <i className="mdi mdi-dots-vertical"></i>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-right-custom">
          <DropdownItem onClick={handleClickView}>Product Details</DropdownItem>
          {canManage && (
            <>
              <DropdownItem onClick={handleClickEdit}>Edit</DropdownItem>
              <DropdownItem onClick={() => setAlert(true)}>Delete</DropdownItem>
            </>
          )}
        </DropdownMenu>
      </Dropdown>
      {alert && <Alert onHandleConfirm={onHandleConfirm} onDelete={() => setAlert(false)} />}
    </div>
  );
}
export default AtStoreActions;
