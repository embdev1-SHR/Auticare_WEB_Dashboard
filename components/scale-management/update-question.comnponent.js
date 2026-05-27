import { ErrorMessage, Field, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from "reactstrap";
import { ActiveTab, selectScaleEdit, selectScaleIsLoading, selectUpdateData, selectViewModal, setViewUpdateModal, updateQuestion } from "../../store/slice/scale.slice";
import Select from "react-select";
import { useState } from "react";
import { contentSchema } from "./add-question.component";

function UpdateQuestion({ activeTab }) {
  const dispatch = useDispatch();
  const modalState = useSelector(selectViewModal);
  const updateData = useSelector(selectUpdateData);
  const loading = useSelector(selectScaleIsLoading);

  console.log("activeTab", activeTab);

  const [state, setState] = useState({ label: updateData?.ResponseOption1, value: updateData?.ResponseOption1 });
  const [state1, setState1] = useState({ label: updateData.ResponseOption2, value: updateData.ResponseOption2 });
  const [state2, setState2] = useState({ label: updateData.ResponseOption3, value: updateData.ResponseOption3 });
  const [state3, setState3] = useState({ label: updateData.ResponseOption4, value: updateData.ResponseOption4 });
  const [state4, setState4] = useState({ label: updateData.ResponseOption5, value: updateData.ResponseOption5 });

  const initialQuestionValues = {
    Question: updateData.Question,
    ResponseOption1: updateData.ResponseOption1,
    ResponseScore1: updateData.ResponseScore1,
    ResponseOption2: updateData.ResponseOption2,
    ResponseScore2: updateData.ResponseScore2,
    ResponseOption3: updateData.ResponseOption3,
    ResponseScore3: updateData.ResponseScore3 === 0 ? "" : updateData.ResponseScore3,
    ResponseOption4: updateData.ResponseOption4,
    ResponseScore4: updateData.ResponseScore4 === 0 ? "" : updateData.ResponseScore4,
    ResponseOption5: updateData.ResponseOption5,
    ResponseScore5: updateData.ResponseScore5 === 0 ? "" : updateData.ResponseScore5,
  };

  const options = [
    { label: "Select", value: null },
    { label: "Rarely", value: "Rarely" },
    { label: "Sometimes", value: "Sometimes" },
    { label: "Frequently", value: "Frequently" },
    { label: "Mostly", value: "Mostly" },
    { label: "Always", value: "Always" },
  ];

  const editQuestion = (values) => {
    dispatch(ActiveTab(activeTab))
    const data = {
      Question: values.Question === "" ? updateData.Question : values.Question,
      ResponseOption1: values.ResponseOption1 === "" ? updateData.ResponseOption1 : values.ResponseOption1,
      ResponseScore1: values.ResponseScore1 === "" ? updateData.ResponseScore1 : values.ResponseScore1,
      ResponseOption2: values.ResponseOption2 === "" ? updateData.ResponseOption2 : values.ResponseOption2,
      ResponseScore2: values.ResponseScore2 === "" ? updateData.ResponseScore2 : values.ResponseScore2,
      ResponseOption3: values.ResponseOption3 === "" ? updateData.ResponseOption3 : values.ResponseOption3,
      ResponseScore3: values.ResponseScore3 === "" ? updateData.ResponseScore3 : values.ResponseScore3,
      ResponseOption4: values.ResponseOption4 === "" ? updateData.ResponseOption4 : values.ResponseOption4,
      ResponseScore4: values.ResponseScore4 === "" ? updateData.ResponseScore4 : values.ResponseScore4,
      ResponseOption5: values.ResponseOption5 === "" ? updateData.ResponseOption5 : values.ResponseOption5,
      ResponseScore5: values.ResponseScore5 === "" ? updateData.ResponseScore5 : values.ResponseScore5,
    };

    const valuesToSend = {
      ...data,
      CategoryID: Number(updateData.CategoryID),
      ContentID: updateData.ContentID,
      QuestionNumber: updateData.QuestionNumber,
    };
    dispatch(updateQuestion(valuesToSend));
  };
  const tog_standard = () => {
    dispatch(setViewUpdateModal(!modalState));
  };
  const selectStyles = {
    control: (styles, { isDisabled }) => ({
      ...styles,
      borderColor: "#e8eaed;",
      color: isDisabled && "#292c39",
      backgroundColor: isDisabled ? "#f9fbff" : "white",
    }),
    singleValue: (styles) => ({ ...styles, color: "#292c39" }),
  };
  return (
    <>
      <Modal isOpen={modalState} toggle={tog_standard} scrollable={true} className="modal right app_modal">
        <Formik initialValues={initialQuestionValues} validationSchema={contentSchema} onSubmit={editQuestion}>
          {({ touched, errors, handleSubmit, resetForm, setFieldValue, isSubmitting, values }) => (
            <>
              <ModalHeader
                toggle={() => {
                  dispatch(setViewUpdateModal(!modalState));
                }}
              >
                Edit Question
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
                                value !== values.ResponseOption5
                              );
                            })}
                            name="ResponseOption1"
                            placeholder="Select"
                            isSearchable={true}
                            value={state}
                            onChange={(client) => {
                              setFieldValue("ResponseOption1", client.value);
                              setState({ label: client.value, value: client.value });
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
                            value={state1}
                            options={options.filter((option) => {
                              const value = option.value;
                              return (
                                value !== values.ResponseOption1 &&
                                value !== values.ResponseOption2 &&
                                value !== values.ResponseOption3 &&
                                value !== values.ResponseOption4 &&
                                value !== values.ResponseOption5
                              );
                            })}
                            name="ResponseOption2"
                            placeholder="Select"
                            isSearchable={true}
                            onChange={(client) => {
                              setFieldValue("ResponseOption2", client.value);
                              setState1({ label: client.value, value: client.value });
                            }}
                            styles={selectStyles}
                          />{" "}
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
                            value={state2}
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
                            name="ResponseOption3"
                            placeholder="Select"
                            isSearchable={true}
                            onChange={(client) => {
                              setFieldValue("ResponseOption3", client.value);
                              setState2({ label: client.value, value: client.value });
                            }}
                            styles={selectStyles}
                          />{" "}
                        </td>
                        <td>
                          <Field type="text" className="form-control" id="weight3" name="ResponseScore3" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Field
                            component={Select}
                            value={state3}
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
                            name="ResponseOption4"
                            placeholder="Select"
                            isSearchable={true}
                            onChange={(client) => {
                              setFieldValue("ResponseOption4", client.value);
                              setState3({ label: client.value, value: client.value });
                            }}
                            styles={selectStyles}
                          />{" "}
                        </td>
                        <td>
                          <Field type="text" className="form-control" id="weight4" name="ResponseScore4" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Field
                            component={Select}
                            value={state4}
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
                            name="ResponseOption5"
                            placeholder="Select"
                            isSearchable={true}
                            onChange={(client) => {
                              setFieldValue("ResponseOption5", client.value);
                              setState4({ label: client.value, value: client.value });
                            }}
                            styles={selectStyles}
                          />{" "}
                        </td>
                        <td>
                          <Field type="text" className="form-control" id="weight5" name="ResponseScore5" />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={handleSubmit}
                  type="button"
                  color="primary"
                  className="btn-md m-1 mx-auto waves-effect waves-light action_btn"
                  disabled={loading}
                >
                  Edit Question
                </Button>
              </ModalFooter>
            </>
          )}
        </Formik>
      </Modal>
    </>
  );
}
export default UpdateQuestion;
