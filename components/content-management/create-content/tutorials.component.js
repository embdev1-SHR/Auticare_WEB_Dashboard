import { ErrorMessage, Field, Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Label, Row } from "reactstrap";
import * as yup from "yup";
import { contentIsLoading, selectContentIsEdit, tutorialLink, tutorialLinkDelete } from "../../../store/slice/content.slice";
import UrlList from "./urlList.component";

const Tutorials = () => {
  const router = useRouter();
  const [inputs, setInputs] = useState([""]);
  const disabled = useSelector(contentIsLoading);
  const dispatch = useDispatch();
  const isEdit = useSelector(selectContentIsEdit);

  const { ContentID } = router.query;
  const handleAddInput = () => {
    const values = [...inputs, ""]; // add a new empty input to the end of the array
    setInputs(values); // set the new state
  };

  const handleDeleteInput = (index) => {
    const values = [...inputs]; // make a copy of the inputs array
    values.splice(index, 1); // remove the input at the specified index
    setInputs(values); // set the new state
  };

  const onSubmit = async (values, actions) => {
    const TutorialLinks = Object.values(values);
    const valueToSend = {
      ContentID,
      TutorialLinks: { TutorialLinks },
    };
    await dispatch(tutorialLink(valueToSend));
    setInputs([""]);

    actions.setFieldValue(0, "");
    actions.resetForm();
  };

  const contentSchema = Object.fromEntries(
    inputs.map((field, index) => [
      index,
      yup
        .string()
        .max(256, "Too Long!")
        .matches(
          /^([H|h][T|t]{2}[P|p][S|s]?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
          "Invalid Website URL"
        )
        .required("Link URL is required"),
    ])
  );

  return (
    <Formik
      initialValues={
        {
          // Link:[]
        }
      }
      validationSchema={yup.object().shape(contentSchema)}
      onSubmit={onSubmit}>
      {({ touched, errors, handleSubmit, resetForm, setFieldValue, isSubmitting }) => (
        <>
          <div>
            {inputs.map((value, index) => (
              <Row key={index}>
                <Col md='11'>
                  <div className='mb-4'>
                    <Label className='form-label ' htmlFor='Link'>
                      Link URL
                    </Label>
                    <Field type='text'  className='form-control' name={`${index}`} />
                    {errors[`${index}`] && touched[`${index}`] ? <ErrorMessage className='text-danger small' name={`${index}`} component='div' /> : null}
                  </div>
                </Col>
                <Col md='1 pt-4'>
                  {index == 0 ? (
                    <>
                      <Button type='submit' disabled={disabled } color='primary' className='btn-md m-1 waves-effect waves-light action_btn' onClick={handleSubmit}>
                        Submit
                      </Button>
                    </>
                  ) : (
                    <Button className='rounded-circle me-1 mt-2' size='sm' color='danger' onClick={() => handleDeleteInput(index)}>
                      <i className='mdi mdi-trash-can'></i>
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
          </div>
          <Row>
            <UrlList />
          </Row>
        </>
      )}
    </Formik>
  );
};

export default Tutorials;
