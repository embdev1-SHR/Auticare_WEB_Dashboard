import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col } from "reactstrap";
import { GetTutorialLink, selectUrlList, tutorialLinkDelete, contentIsLoading } from "../../../../store/slice/content.slice";
import Alert from "../../../shared/alert";
import { useState } from "react";

const UrlList = () => {
  const data = useSelector(selectUrlList);

  const Loading = useSelector(contentIsLoading);
  const dispatch = useDispatch();
  const router = useRouter();
  const { ContentID } = router.query;
  const [alert, setAlert] = useState(false);
  const [urlId, setUrlId] = useState("");

  const comments = data
    ?.filter((comment) => comment.Status == 1)
    .map((e) => {
      return { TherapistName: `${e.TutorialLink}`, TutorialLinkID: `${e.TutorialLinkID}` };
    });

  const handleDeleteInput = (key) => {
    setAlert(true);
    setUrlId(key);
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

  return (
    <>
      {data.length > 0 ? <>
        {alert ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onDelete} /> : null}
        {comments
          ?.sort((a, b) => b.TutorialLinkID - a.TutorialLinkID)
          .map((comment, key) => {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
            var match = comment.TherapistName.match(regExp);
            return (
              <Col md={4} key={key}>
                <Card>
                  <CardBody>
                    <CardTitle className='h4 d-flex justify-content-between'>
                      <Link href={`${comment.TherapistName}`} passHref>
                        <a target='_blank'>{comment.TherapistName}</a>
                      </Link>
                      <div>
                        <Button className='rounded-circle' disabled={Loading} size='sm' color='danger' onClick={() => handleDeleteInput(comment.TutorialLinkID)}>
                          <i className='mdi mdi-trash-can'></i>
                        </Button>
                      </div>
                    </CardTitle>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
      </> : "No Data Found"}
    </>
  );
};
export default UrlList;
