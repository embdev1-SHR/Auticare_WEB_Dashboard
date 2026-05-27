import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import { UpdateContentMediaData, selectIsPostContentMediaLoading } from "../../../store/slice/content.slice";
import TextConfig from "./textConfig.component";
import * as Yup from "yup";
import { ErrorMessage, Field, Formik } from "formik";

const VideoConfigItem = ({ item, i, handleDeleteDescription, handleInputChange, onSubmitVideoContent }) => {
  const dispatch = useDispatch();
  const { ContentID } = useRouter().query;


  const [isEditDescription, setIsEditDescription] = useState(false);
  const CreateContentMediaIsLoading = useSelector(selectIsPostContentMediaLoading);
  const onEditVideoContent = async (MediaData) => {
    const objToSend = {
      MediaID: MediaData.MediaID,
      ContentID,
      data: {
        StartPosition: MediaData.start,
        EndPosition: MediaData.end,
        Description: MediaData.description,
        Status: true,
      },
    };

    await dispatch(UpdateContentMediaData(objToSend));
    await setIsEditDescription(false);
  };

  const onEditVideoDelete = async (MediaData) => {
    const objToSend = {
      MediaID: MediaData.MediaID,
      ContentID,
      data: {
        Description: MediaData.description,
        Status: 0,
      },
    };

    await dispatch(UpdateContentMediaData(objToSend));
  };

  const validationSchema = Yup.object().shape({
    description: Yup.string().max(1000, "Too Long!"),
  });

  return (
    <Formik
      initialValues={
        { description: "" }
      }
      validationSchema={validationSchema}
      enableReinitialize={true}
    >
      {({
        touched,
        errors,
        handleSubmit,
        resetForm,
        setFieldValue,
        isSubmitting,
        values
      }) => (
        <>
          <Card outline color='primary' className='border mt-2 mr-5'>
            <CardBody>
              <Row>
                <Col md={4}>
                  <CardTitle>Start Time: {Math.round(item.start)}</CardTitle>
                </Col>
                <Col md={4}>
                  <CardTitle>End Time: {Math.round(item.end)}</CardTitle>
                </Col>
                {item.MediaID ? (
                  <Col md={4}>
                    <Button type='button' color='danger' onClick={() => onEditVideoDelete(item)} className='btn-md float-end waves-effect waves-light ml-2'>
                      <i className='mdi mdi-trash-can'></i>
                    </Button>
                    {isEditDescription ? (
                      <Button type='button' color='primary' onClick={() => onEditVideoContent(item)} className='btn-md waves-effect waves-light float-end'>
                        {/* <i className='mdi mdi-pencil'></i> */}
                        Update
                      </Button>
                    ) : (
                      <Button type='button' color='warning' onClick={() => setIsEditDescription(true)} className='btn-md waves-effect waves-light float-end'>
                        <i className='mdi mdi-pencil'></i>
                      </Button>
                    )}
                  </Col>
                ) : (
                  <Col md={4}>
                    <Button type='button' color='danger' onClick={(e) => handleDeleteDescription(e, i)} className='btn-md float-end waves-effect waves-light ml-2'>
                      <i className='mdi mdi-trash-can'></i>
                    </Button>
                    {0 === i && (
                      <Button type='button' color='primary' className='btn-md waves-effect waves-light float-end' disabled={CreateContentMediaIsLoading} onClick={onSubmitVideoContent}>
                        Save Changes
                      </Button>
                    )}
                  </Col>
                )}
              </Row>
              <Row>
                <Col>
                  <div className='mb-1'>
                    {item.MediaID ? (
                      <TextConfig
                        label='Description'
                        name='description'
                        value={item.description}
                        setValue={(e) => handleInputChange(e, i, "description")}
                        placeholder='Enter description ...'
                        readOnly={!isEditDescription}
                      />
                    ) : (
                      <TextConfig label='Description' name='description' value={item.description} setValue={(e) => handleInputChange(e, i, "description")} placeholder='Enter description ...' />
                    )}
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </>
      )}
    </Formik>
  );
};

export default VideoConfigItem;
