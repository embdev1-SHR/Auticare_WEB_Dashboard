import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, CardTitle, Col } from "reactstrap";
import { tutorialLinkDelete, contentIsLoading } from "../../../../store/slice/content.slice";
import Alert from "../../../shared/alert";
import { useState } from "react";
import { MandListDataListSlice, TrailData, patientmlist } from "../../../../store/slice/patient.slice";

const MandListComponent = () => {
  const data = useSelector(MandListDataListSlice);
  const addedData = useSelector(patientmlist)
  const TrailValue = useSelector(TrailData);

  const Loading = useSelector(contentIsLoading);
  const dispatch = useDispatch();
  const router = useRouter();
  const { ContentID } = router.query;
  const [alert, setAlert] = useState(false);
  const [urlId, setUrlId] = useState("");

  const [Id, setId] = useState([]);
  const comments = data?.length ? data?.filter((comment) => comment.Status == 1)
    .map((e) => {
      return { name: `${e.Mand}` };
    }) : undefined

  const convertedArray = addedData.map(item => ({ name: item }));
  comments = comments ? [...convertedArray, ...comments] : convertedArray

  const handleDeleteInput = (array, key) => {

    console.log("", array, key);

    function removeObjectByKey(array, keyToRemove) {
      const removedObject = array.find(obj => obj.Key === keyToRemove);
      return removedObject;
    }

    setId(e => [...e, removeObjectByKey(array, key)])
  };

  const onHandleConfirm = async () => {
    setAlert(false);
    const valueToSend = {
      key: urlId,
      ContentID,
    };
    await dispatch(tutorialLinkDelete(valueToSend));
  };
  const onDelete = () => {
    setAlert(false);
  };



  comments = comments.map((obj, index) => {
    return {
      ...obj,
      "Key": index
    };
  });





  const deletedKeys = new Set(Id.map(obj => obj.Key));

  // Filter out objects from the mainArray that have keys in the deletedKeys set
  comments = comments.filter(obj => !deletedKeys.has(obj.Key));

  return (
    <>
      {alert ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onDelete} /> : null}
      {comments?.map((comment, key) => {
        console.log("comment", comment);
        return (
          <Col md={4} key={key}>
            <Card>
              <CardBody>
                <CardTitle className='h4 d-flex justify-content-between'>
                  {typeof (comment.name) == "string" ? comment.name : comment.name.length > 2 ? comment.name[comment.name.length - 2] : comment.name}
                  <div>
                  {TrailValue[0]?.IsFinished === 1 ? <></> :<Button className='rounded-circle' disabled={Loading} size='sm' color='danger' onClick={() => handleDeleteInput(comments, comment.Key)}>
                      <i className='mdi mdi-trash-can'></i>
                    </Button>}
                  </div>
                </CardTitle>
              </CardBody>
            </Card>
          </Col>
        );
      })}
      {TrailValue[0]?.IsFinished === 1 && comments.length === 0 ? "No Data Found" : ""}
    </>
  );
};

export default MandListComponent;
