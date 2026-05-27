import React from "react";
import { useSelector } from "react-redux";
import { Button } from "reactstrap";
import { contentIsLoading } from "../../../store/slice/content.slice";
import Alert from "../../shared/alert";

const TutorialLinkDelete = ({ comment, setAlert, handleDeleteInput }) => {
  const Loading = useSelector(contentIsLoading);
  const onHandleConfirm = () => {
    setAlert(false);
  };
  const onDelete = () => {
    setAlert(false);
  };
  return (
    <>
      {alert ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onDelete} /> : null}
      <Button className='rounded-circle' disabled={Loading} size='sm' color='danger' onClick={() => handleDeleteInput(comment.TutorialLinkID)}>
        <i className='mdi mdi-trash-can'></i>
      </Button>
    </>
  );
};

export default TutorialLinkDelete;
