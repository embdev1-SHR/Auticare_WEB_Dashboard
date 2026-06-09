import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { DeleteScale, currentScale, isEditScale } from "../../store/slice/scale.slice";
import { selectUserData, selectUserID } from "../../store/slice/auth.slice";
import { useSelector } from "react-redux";
import Alert from "../shared/alert";
import { setModalOpen } from "../../store/slice/layout.slice";

function ScaleActions({ scale }) {
  const [isOpen, setIsOpen] = useState(false);
  const [alert, setAlert] = useState(false);

  const UserId = useSelector(selectUserID);
  const dispatch = useDispatch();
  const router = useRouter();

  function viewScaleDetails(scale) {
    dispatch(isEditScale(false));
    router.push(`/scales/${scale.ScaleID}/${scale.ScaleMetric.toLowerCase()}/${scale.ScaleMetricType.toLowerCase()}`);
  }

  const handleClickEdit = async (scale) => {
    dispatch(currentScale(scale?.ScaleID));
    dispatch(isEditScale(true));
    dispatch(setModalOpen(true));
  };

  const onDelete = () => {
    setAlert(true);
  };

  function handleDelete() {
    const valueToSend = {
      scaleID: scale.ScaleID,
      setAlert
    }
    dispatch(DeleteScale(valueToSend));
    setAlert(false);

  }

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
          <DropdownItem onClick={() => viewScaleDetails(scale)}>View Details</DropdownItem>
          {UserId === scale.Create_By ? <DropdownItem onClick={() => handleClickEdit(scale)}>Edit</DropdownItem> : null}
          {UserId === scale.Create_By ? <DropdownItem onClick={onDelete}>Delete</DropdownItem> : null}
        </DropdownMenu>
      </Dropdown>
      {alert ? <Alert onHandleConfirm={handleDelete} onDelete={onHandleDelete} /> : null}
    </div>
  );
}
export default ScaleActions;
