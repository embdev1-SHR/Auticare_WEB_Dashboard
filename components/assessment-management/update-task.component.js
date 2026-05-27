import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Input, Row, Col } from "reactstrap";
import { updateTask, selectViewModal, selectUpdateData, setViewUpdateModal, selectScaleIsLoading } from "../../store/slice/scale.slice";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";

const UpdateTask = ({ ScaleID }) => {
  const dispatch = useDispatch();
  const modalState = useSelector(selectViewModal);
  const updateData = useSelector(selectUpdateData);
  const loading = useSelector(selectScaleIsLoading);



  const validationSchema = Yup.object().shape({
    TaskName: Yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Please enter Task Name"),
    NumberOfScore: Yup.number().min(2, "Number must be greater than 1").max(4, "Number must be less than 5").required("Please enter Number Of Score"),
    TaskObjective: Yup.string().min(2, "Too Short!").max(1000, "Too Long!").required("Please enter Task Objective"),
    Question: Yup.string().min(2, "Too Short!").max(1000, "Too Long!").required("Please enter Question"),
    Criteria: Yup.string().min(2, "Too Short!").max(1000, "Too Long!").required("Please enter Criteria"),
    Example: Yup.string().min(2, "Too Short!").max(1000, "Too Long!"),
  })



  const tog_standard = () => {
    dispatch(setViewUpdateModal(!modalState));
  };

  const submitQuestion = async (values) => {
    const question = values.Question
    const taskName = values.TaskName
    const no_score = values.NumberOfScore
    const task_obj = values.TaskObjective
    const criteria = values.Criteria
    const example = values.Example

    const payload = {
      "CategoryID": updateData.CategoryID,
      "ContentID": updateData.ContentID,
      "QuestionNumber": updateData.QuestionNumber,
      "Question": question,
      "TaskName": taskName,
      "TaskObjective": task_obj,
      "NumberOfScore": no_score,
      "Example": example,
      "Criteria": criteria,
      "ResponseScore5": 1,
      Status: 1,
      "ScaleID": ScaleID
    }
    dispatch(updateTask(payload));
  }

  return (
    <>
      <Formik initialValues={{
        TaskName: updateData.TaskName,
        NumberOfScore: updateData.NumberOfScore,
        TaskObjective: updateData.TaskObjective,
        Question: updateData.Question,
        Criteria: updateData.Criteria,
        Example: updateData.Example
      }} validationSchema={validationSchema} onSubmit={submitQuestion} enableReinitialize={true}>
        {({ touched, errors, handleSubmit, resetForm, isSubmitting, setFieldValue, values }) => (
          <Modal isOpen={modalState} toggle={tog_standard} scrollable={true} className='modal right app_modal'>
            <ModalHeader toggle={() => dispatch(setViewUpdateModal(!modalState))}>Edit Task</ModalHeader>
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
              <Button type='submit' onClick={handleSubmit} disabled={loading} color='primary' className='btn-md m-1 mx-auto waves-effect waves-light action_btn'>
                Edit Task
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default UpdateTask;
