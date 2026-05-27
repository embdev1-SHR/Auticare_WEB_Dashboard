import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col } from "reactstrap";
import { GetTutorialLink, selectUrlList, tutorialLinkDelete, contentIsLoading } from "../../../../store/slice/content.slice";
import Alert from "../../../shared/alert";
import { useState } from "react";
import { BehaviorListDataListSlice, PatientBehaviorListData, TrailData, patientHlist } from "../../../../store/slice/patient.slice";

const BehaviorListComponent = () => {
  const data = useSelector(PatientBehaviorListData);
  const addedData = useSelector(patientHlist);
  const TrailValue = useSelector(TrailData);


  const Loading = useSelector(contentIsLoading);
  const dispatch = useDispatch();
  const router = useRouter();
  const { ContentID } = router.query;
  const [alert, setAlert] = useState(false);
  const [Id, setId] = useState([]);


  const comments = data?.length ? data?.filter((comment) => comment.Status == 1)
    .map((e) => {
      return { Name: `${e.Behaviour}` };
    }) : undefined;


  const convertedArray = addedData.map(item => ({ Name: item }));

  comments = comments ? [...convertedArray, ...comments] : convertedArray

  const handleDeleteInput = (array, key) => {

    console.log("", array, key);

    function removeObjectByKey(array, keyToRemove) {
      const removedObject = array.find(obj => obj.Key === keyToRemove);
      return removedObject;
    }

    setId(e => [...e, removeObjectByKey(array, key)])
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

  const onHandleConfirm = async (comments, Id) => {
    setAlert(false);

    const indexToRemove = comments?.findIndex(obj => obj.Id === Id);

    if (indexToRemove !== -1) {
      comments.splice(indexToRemove, 1);
    }

  };

  console.log("comments", comments);
  // comments = Id ? Id : comments;


  const deletedKeys = new Set(Id.map(obj => obj.Key));

  // Filter out objects from the mainArray that have keys in the deletedKeys set
  comments = comments.filter(obj => !deletedKeys.has(obj.Key));


console.log("comments",comments);

  return (
    <>
      {alert ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onDelete} /> : null}
      {comments?.map((comment, key) => {

        return (
          <Col md={4} key={key}>
            <Card>
              <CardBody>
                <CardTitle className='h4 d-flex justify-content-between'>
                  <div>

                    {typeof (comment.Name) == "string" ? comment.Name : comment.Name.length > 2 ? comment.Name[comment.Name.length - 2] : comment.Name}

                  </div>
                  <div>
                    {TrailValue[0]?.IsFinished === 1 ? <></> : <Button className='rounded-circle' disabled={Loading} size='sm' color='danger' onClick={() => handleDeleteInput(comments, comment.Key)}>
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
export default BehaviorListComponent;
