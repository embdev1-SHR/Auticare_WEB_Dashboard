import { ErrorMessage, Field, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import * as Yup from "yup";
import { selectSetModalOpenState, setModalOpen } from "../../store/slice/layout.slice";
import { createAssessmentQuestion, selectScaleIsLoading } from "../../store/slice/scale.slice";

const AddTask = (data) => {
  const dispatch = useDispatch();
  const setModalOpenState = useSelector(selectSetModalOpenState);
  const Loading = useSelector(selectScaleIsLoading);
  const tog_standard = () => {
    dispatch(setModalOpen(!setModalOpenState));
  };
  const validationSchema = Yup.object().shape({
    TaskName: Yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Please enter Task Name"),
    NumberOfScore: Yup.number().min(2, "Number must be greater than 1").max(4, "Number must be less than 5").required("Please enter Number Of Score"),
    TaskObjective: Yup.string().min(2, "Too Short!").max(1000, "Too Long!").required("Please enter Task Objective"),
    Question: Yup.string().min(2, "Too Short!").max(1000, "Too Long!").required("Please enter Question"),
    Criteria: Yup.string().min(2, "Too Short!").max(1000, "Too Long!").required("Please enter Criteria"),
    Example: Yup.string().min(2, "Too Short!").max(1000, "Too Long!"),
  })

  const onSubmit = async (values) => {
    const question = document.getElementById("question").value;
    const taskName = document.getElementById("taskName").value;
    const no_score = document.getElementById("no_score").value;
    const task_obj = document.getElementById("task_obj").value;
    const criteria = document.getElementById("criteria").value;
    const example = document.getElementById("example").value;

    const payload = {
      "CategoryID": data?.data?.CategoryID,
      "ScaleID": data.data.ScaleID,
      "ContentID": 8,
      "QuestionNumber": data.data.questionNumber,
      "Question": question,
      "TaskName": taskName,
      "TaskObjective": task_obj,
      "NumberOfScore": no_score,
      "Example": example,
      "Criteria": criteria

    }
    dispatch(createAssessmentQuestion(payload))
  }
  return (
    <>
      <Button type='button' color='primary' onClick={tog_standard}>
        <i className='mdi mdi-plus me-1' /> Add Task
      </Button>
      <Formik initialValues={{
        TaskName: "",
        NumberOfScore: "",
        TaskObjective: "",
        Question: "",
        Criteria: "",
        Example: ""
      }} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
        {({ touched, errors, handleSubmit, resetForm, isSubmitting, setFieldValue, values }) => (

          <Modal isOpen={setModalOpenState} toggle={tog_standard} scrollable={true} className='modal right app_modal'>
            <ModalHeader toggle={() => dispatch(setModalOpen(!setModalOpenState))}>Add Task</ModalHeader>
            <ModalBody>
              <Row>
                <Col md={6}>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='taskName'>
                      Task Name
                    </Label>
                    <Field type='text' name="TaskName" className='form-control' id='taskName' placeholder='Enter the task name' />
                    {errors.TaskName && touched.TaskName ? <ErrorMessage className='text-danger small' name='TaskName' component='div' /> : null}
                  </div>
                </Col>
                <Col md={6}>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='no_score'>
                      Number of Score
                    </Label>
                    <Field type='text' name="NumberOfScore" className='form-control' id='no_score' placeholder='Enter number of score' />
                    {errors.NumberOfScore && touched.NumberOfScore ? <ErrorMessage className='text-danger small' name='NumberOfScore' component='div' /> : null}
                  </div>
                </Col>
              </Row>
              <div className='mb-4'>
                <Label className='form-label required' htmlFor='task_obj'>
                  Task Objective
                </Label>
                <Field name="TaskObjective" type='text' className='form-control' id='task_obj' placeholder='Enter the task objective' />
                {errors.TaskObjective && touched.TaskObjective ? <ErrorMessage className='text-danger small' name='TaskObjective' component='div' /> : null}
              </div>
              <div className='mb-4'>
                <Label className='form-label required' htmlFor='question'>
                  Question
                </Label>
                <Field name="Question" type='text' className='form-control' id='question' placeholder='Enter the question' />
                {errors.Question && touched.Question ? <ErrorMessage className='text-danger small' name='Question' component='div' /> : null}
              </div>
              <div className='mb-4'>
                <Label className='form-label required' htmlFor='criteria'>
                  Criteria
                </Label>
                <Field name="Criteria" type='text' className='form-control' id='criteria' placeholder='Enter the criteria' />
                {errors.Criteria && touched.Criteria ? <ErrorMessage className='text-danger small' name='Criteria' component='div' /> : null}

              </div>
              <div className='mb-4'>
                <Label className='form-label' htmlFor='example'>
                  Example
                </Label>
                <Field name="Example" type='text' className='form-control' id='example' placeholder='Enter the example' />
                {errors.Example && touched.Example ? <ErrorMessage className='text-danger small' name='Example' component='div' /> : null}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type='submit' onClick={handleSubmit} disabled={Loading} color='primary' className='btn-md m-1 mx-auto waves-effect waves-light action_btn'>
                Submit Task
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default AddTask;
