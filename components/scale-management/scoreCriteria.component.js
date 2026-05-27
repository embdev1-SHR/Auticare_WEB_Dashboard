import { ErrorMessage, Field, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import * as yup from "yup";
import { ScaleDetails, ScoreScaleUpdate, selectScaleDetail, selectScaleEdit, selectScaleIsLoading } from "../../store/slice/scale.slice";
import { useState } from "react";
import { useEffect } from "react";

export const contentSchema = yup.object().shape({
  NoAutism: yup.number().integer().required("No Autism value is required"),
  MildAutism: yup.number().integer().required("Mild Autism value is required"),
  ModerateAutism: yup.number().integer().required("Moderate Autism value is required"),
});

function ScoreCriteria({ ScaleID }) {
  const scaleDetail = useSelector(selectScaleDetail);
  const isEdit = useSelector(selectScaleEdit);



  const [model, setModel] = useState(false);

  const dispatch = useDispatch();
  const loading = useSelector(selectScaleIsLoading);

  const initialQuestionValues = {
    NoAutism: scaleDetail[0] ? scaleDetail[0].NoAutismScore : "",
    MildAutism: scaleDetail[0] ? scaleDetail[0].MildAutismScore : "",
    ModerateAutism: scaleDetail[0] ? scaleDetail[0].ModerateAutismScore : "",
    SevereAutism: "",
  };

  useEffect(() => {
    dispatch(ScaleDetails(ScaleID));
  }, [model, ScaleID]);

  const submitQuestion = (values) => {
    const data = {
      NoAutismScore: values.NoAutism,
      MildAutismScore: values.MildAutism,
      ModerateAutismScore: values.ModerateAutism,
    };
    const valueToSend = {
      ScaleID,
      data,
      setModel,
    };
    dispatch(ScoreScaleUpdate(valueToSend));
  };
  const tog_standard = () => {
    setModel(!model);
  };

  return (
    <>
      {isEdit && <Button type="button" onClick={tog_standard} color="primary" className="btn-md m-2 waves-effect waves-light">
        Score Criteria
      </Button>}
      <Modal isOpen={model} toggle={tog_standard} scrollable={true} className="modal right app_modal">
        <Formik initialValues={initialQuestionValues} onSubmit={submitQuestion} validationSchema={contentSchema}>
          {({ touched, errors, handleSubmit, resetForm, setFieldValue, isSubmitting, values }) => (
            <>
              <ModalHeader
                toggle={() => {
                  setModel(!model);
                }}
              >
                Score Criteria
              </ModalHeader>
              <ModalBody>
                <Table borderless>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Max Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Label className="form-label required" htmlFor="question">
                          No Autism
                        </Label>
                      </td>
                      <td>
                        <Field type="text" className="form-control" id="NoAutism" name="NoAutism" />
                        {errors.NoAutism && touched.NoAutism ? (
                          <ErrorMessage className="text-danger small" name="NoAutism" component="div" />
                        ) : null}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Label className="form-label required" htmlFor="question">
                          Mild Autism
                        </Label>
                      </td>
                      <td>
                        <Field type="text" className="form-control" id="MildAutism" name="MildAutism" />
                        {errors.MildAutism && touched.MildAutism ? (
                          <ErrorMessage className="text-danger small" name="MildAutism" component="div" />
                        ) : null}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Label className="form-label required" htmlFor="question">
                          Moderate Autism
                        </Label>
                      </td>
                      <td>
                        <Field type="text" className="form-control" id="ModerateAutism" name="ModerateAutism" />
                        {errors.ModerateAutism && touched.ModerateAutism ? (
                          <ErrorMessage className="text-danger small" name="ModerateAutism" component="div" />
                        ) : null}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Label className="form-label required" htmlFor="question">
                          Severe Autism
                        </Label>
                      </td>
                      <td>
                        <Field
                          type="text"
                          value={"Greater than " + values.ModerateAutism}
                          disabled={true}
                          className="form-control"
                          id="SevereAutism"
                          name="SevereAutism"
                        />
                        {errors.SevereAutism && touched.SevereAutism ? (
                          <ErrorMessage className="text-danger small" name="SevereAutism" component="div" />
                        ) : null}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  type="submit"
                  color="primary"
                  className="btn-md m-1 mx-auto waves-effect waves-light action_btn"
                >
                  Submit Criteria
                </Button>
              </ModalFooter>
            </>
          )}
        </Formik>
      </Modal>
    </>
  );
}
export default ScoreCriteria;
