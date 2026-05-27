import { ErrorMessage, Field, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from "reactstrap";
import * as yup from "yup";
import { selectSetModalOpenState, setModalOpen } from "../../store/slice/layout.slice";
import { createQuestion, selectScaleEdit, selectScaleIsLoading } from "../../store/slice/scale.slice";
import Select from "react-select";

export const contentSchema = yup.object().shape({
  Question: yup.string().max(200, "Too Long!").required("Question is required"),
  ResponseOption1: yup.string().required("Response Option is required"),
  ResponseScore1: yup.number().max(99, "Too Long!").integer().required("Response Option is required"),
  ResponseOption2: yup.string().required("Response Option is required"),
  ResponseScore2: yup.number().max(99, "Too Long!").integer().required("Response Option is required"),
  ResponseScore3: yup.number().max(99, "Too Long!").integer(),
  ResponseScore4: yup.number().max(99, "Too Long!").integer(),
  ResponseScore5: yup.number().max(99, "Too Long!").integer(),
});

const selectStyles = {
  control: (styles, { isDisabled }) => ({
    ...styles,
    borderColor: " #e8eaed;",
    color: isDisabled && "#292c39",
    backgroundColor: isDisabled ? "#f9fbff" : "white",
  }),
  singleValue: (styles) => ({ ...styles, color: "#292c39" }),
};

function AddQuestion(data) {
  const dispatch = useDispatch();
  const setModalOpenState = useSelector(selectSetModalOpenState);
  const loading = useSelector(selectScaleIsLoading);

  const initialQuestionValues = {
    Question: "",
    ResponseOption1: "",
    ResponseScore1: "",
    ResponseOption2: "",
    ResponseOption3: "",
    ResponseOption4: "",
    ResponseOption5: "",
    ResponseScore2: "",
    ResponseScore3: "",
    ResponseScore4: "",
    ResponseScore5: "",
  };

  const submitQuestion = (values) => {

    const valuesToSend = {
      Question: values.Question,
      ResponseOption1: values.ResponseOption1,
      ResponseOption2: values.ResponseOption2,
      ResponseOption3: values.ResponseScore3 ? values.ResponseOption3 : "",
      ResponseOption4: values.ResponseScore4 ? values.ResponseOption4 : "",
      ResponseOption5: values.ResponseScore5 ? values.ResponseOption5 : "",
      ResponseScore1: values.ResponseScore1,
      ResponseScore2: values.ResponseScore2,
      ResponseScore3: values.ResponseOption3 === "" || values.ResponseOption3 === null ? "" : values.ResponseScore3,
      ResponseScore4:  values.ResponseOption4 === "" || values.ResponseOption4 === null ? "" : values.ResponseScore4,
      ResponseScore5:  values.ResponseOption5 === "" || values.ResponseOption5 === null ? "" : values.ResponseScore5,
      CategoryID: Number(data.data.CategoryID),
      ScaleID: Number(data.data.ScaleID),
      ContentID: 8,
      QuestionNumber: data.data.questionNumber,
    };
    dispatch(createQuestion(valuesToSend));
  };
  const tog_standard = () => {
    dispatch(setModalOpen(!setModalOpenState));
  };

  const options = [
    { label: "Select", value: null },
    { label: "Rarely", value: "Rarely" },
    { label: "Sometimes", value: "Sometimes" },
    { label: "Frequently", value: "Frequently" },
    { label: "Mostly", value: "Mostly" },
    { label: "Always", value: "Always" },
  ];

  return (
    <>
      <Button type="button" onClick={tog_standard} color="primary" className="btn-md m-2 waves-effect waves-light">
        Add Question
      </Button>
      <Modal isOpen={setModalOpenState} toggle={tog_standard} scrollable={true} className="modal right app_modal">
        <Formik initialValues={initialQuestionValues} onSubmit={submitQuestion} validationSchema={contentSchema}>
          {({ touched, errors, handleSubmit, resetForm, setFieldValue, isSubmitting, values }) => (
            <>
              <ModalHeader
                toggle={() => {
                  dispatch(setModalOpen(!setModalOpenState));
                }}
              >
                Create scale
              </ModalHeader>
              <ModalBody>
                <div className="mb-4">
                  <Label className="form-label required" htmlFor="question">
                    Question
                  </Label>
                  <Field
                    type="text"
                    className="form-control"
                    id="question"
                    name="Question"
                    placeholder="Enter the question"
                  />
                  {errors.Question && touched.Question ? (
                    <ErrorMessage className="text-danger small" name="Question" component="div" />
                  ) : null}
                </div>
                <Row>
                  <Table borderless>
                    <thead>
                      <tr>
                        <th>Values</th>
                        <th>Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <Field
                            component={Select}
                            options={options.filter((option) => {
                              const value = option.value;
                              return (
                                value !== values.ResponseOption1 &&
                                value !== values.ResponseOption2 &&
                                value !== values.ResponseOption3 &&
                                value !== values.ResponseOption4 &&
                                value !== values.ResponseOption5 &&
                                value !== null
                              );
                            })}
                            name="ResponseScore1"
                            placeholder="Select"
                            isSearchable={true}
                            onChange={(client) => {
                              setFieldValue("ResponseOption1", client.value);
                            }}
                            styles={selectStyles}
                          />
                          {errors.ResponseOption1 && touched.ResponseOption1 ? (
                            <ErrorMessage className="text-danger small" name="ResponseOption1" component="div" />
                          ) : null}
                        </td>
                        <td>
                          <Field type="text" className="form-control" id="weight1" name="ResponseScore1" />
                          {errors.ResponseScore1 && touched.ResponseScore1 ? (
                            <ErrorMessage className="text-danger small" name="ResponseScore1" component="div" />
                          ) : null}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Field
                            component={Select}
                            options={options.filter((option) => {
                              const value = option.value;
                              return (
                                value !== values.ResponseOption1 &&
                                value !== values.ResponseOption2 &&
                                value !== values.ResponseOption3 &&
                                value !== values.ResponseOption4 &&
                                value !== values.ResponseOption5 &&
                                value !== null
                              );
                            })}
                            name="ResponseOption2"
                            placeholder="Select"
                            isSearchable={true}
                            onChange={(client) => {
                              setFieldValue("ResponseOption2", client.value);
                            }}
                            styles={selectStyles}
                          />
                          {errors.ResponseOption2 && touched.ResponseOption2 ? (
                            <ErrorMessage className="text-danger small" name="ResponseOption2" component="div" />
                          ) : null}
                        </td>
                        <td>
                          <Field type="text" className="form-control" id="weight2" name="ResponseScore2" />
                          {errors.ResponseScore2 && touched.ResponseScore2 ? (
                            <ErrorMessage className="text-danger small" name="ResponseScore2" component="div" />
                          ) : null}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Field
                            component={Select}
                            options={options.filter((option) => {
                              const value = option.value;
                              return (
                                option.label === "Select" ||
                                (value !== values.ResponseOption1 &&
                                  value !== values.ResponseOption2 &&
                                  value !== values.ResponseOption3 &&
                                  value !== values.ResponseOption4 &&
                                  value !== values.ResponseOption5)
                              );
                            })}
                            name="ResponseScore3"
                            placeholder="Select"
                            isSearchable={true}
                            onChange={(client) => {
                              setFieldValue("ResponseOption3", client.value);
                            }}
                            styles={selectStyles}
                          />
                        </td>
                        <td>
                          <Field type="text" className="form-control" disabled={values.ResponseOption3 === ""} id="weight3" name="ResponseScore3" />
                          {errors.ResponseScore3 && touched.ResponseScore3 ? (
                            <ErrorMessage className="text-danger small" name="ResponseScore3" component="div" />
                          ) : null}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Field
                            component={Select}
                            options={options.filter((option) => {
                              const value = option.value;
                              return (
                                option.label === "Select" ||
                                (value !== values.ResponseOption1 &&
                                  value !== values.ResponseOption2 &&
                                  value !== values.ResponseOption3 &&
                                  value !== values.ResponseOption4 &&
                                  value !== values.ResponseOption5)
                              );
                            })}
                            name="ResponseScore4"
                            placeholder="Select"
                            isSearchable={true}
                            onChange={(client) => {
                              setFieldValue("ResponseOption4", client.value);
                            }}
                            styles={selectStyles}
                          />
                        </td>
                        <td>
                          <Field type="text" className="form-control" disabled={values.ResponseOption4 === ""} id="weight4" name="ResponseScore4" />
                          {errors.ResponseScore4 && touched.ResponseScore4 ? (
                            <ErrorMessage className="text-danger small" name="ResponseScore4" component="div" />
                          ) : null}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Field
                            component={Select}
                            options={options.filter((option) => {
                              const value = option.value;
                              return (
                                option.label === "Select" ||
                                (value !== values.ResponseOption1 &&
                                  value !== values.ResponseOption2 &&
                                  value !== values.ResponseOption3 &&
                                  value !== values.ResponseOption4 &&
                                  value !== values.ResponseOption5)
                              );
                            })}
                            name="ResponseScore5"
                            placeholder="Select"
                            isSearchable={true}
                            onChange={(client) => {
                              setFieldValue("ResponseOption5", client.value);
                            }}
                            styles={selectStyles}
                          />
                        </td>
                        <td>
                          <Field type="text" className="form-control" disabled={values.ResponseOption5 === "" } id="weight5" name="ResponseScore5" />
                          {errors.ResponseScore5 && touched.ResponseScore5 ? (
                            <ErrorMessage className="text-danger small" name="ResponseScore5" component="div" />
                          ) : null}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  type="submit"
                  color="primary"
                  className="btn-md m-1 mx-auto waves-effect waves-light action_btn"
                >
                  Submit Question
                </Button>
              </ModalFooter>
            </>
          )}
        </Formik>
      </Modal>
    </>
  );
}
export default AddQuestion;
