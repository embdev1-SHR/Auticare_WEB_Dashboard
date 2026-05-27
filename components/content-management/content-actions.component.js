import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { deleteContent, fetchAllContents, selectCurrentContentId, setContentEdit, setCurrentContentId } from "../../store/slice/content.slice";
import { selectAlertConfirm } from "../../store/slice/layout.slice";
import Alert from "../shared/alert";
import { selectUserID } from "../../store/slice/auth.slice";

function ContentActions({ content }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const IsAlert = useSelector(selectAlertConfirm);
  const currentId = useSelector(selectCurrentContentId);
  const [alert, setAlert] = useState(false);
  const UserId = useSelector(selectUserID);

  const onHandleConfirm = async () => {
    setAlert(false);
    await dispatch(deleteContent(currentId));
    await dispatch(fetchAllContents());
  };
  const onHandleDelete = async () => {
    setAlert(false);
  };

  const onDelete = (id) => {
    dispatch(setCurrentContentId(id));
    setAlert(true);
  };

  const handleClickEdit = async () => {
    await dispatch(setContentEdit(true));
    await router.push(`contents/${content.ContentID}`);
  };
  const handleClickView = async () => {
    await dispatch(setContentEdit(false));
    await router.push(`contents/${content.ContentID}`);
  };
  return (
    <div className='dropdown float-right'>
      <Dropdown direction='right' isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle color='light' className='btn-rounded more_vert_btn' caret>
          <i className='mdi mdi-dots-vertical'></i>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-right-custom' style={{ marginBottom: "-110%", marginRight: "10%" }} >
          <DropdownItem onClick={handleClickView}>View Details</DropdownItem>
          {UserId === content.Create_By && <>
            <DropdownItem onClick={handleClickEdit}>Edit</DropdownItem>
            <DropdownItem onClick={() => onDelete(content.ContentID)}>Delete</DropdownItem></>}
        </DropdownMenu>
      </Dropdown>
      {alert ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onHandleDelete} /> : null}
    </div>
  );
}

export default ContentActions;
