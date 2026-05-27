import { ErrorMessage, FastField, Field, Formik } from "formik";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import * as yup from "yup";
import { PatientAddComment, IsLOadingButton, UpdateLOadingButton } from "../../../../store/slice/patient.slice";
import CommentsList from "./commentsList.component";
import { selectEditConfirm, selectListComment, PatientUpdateComment, setEdit } from "../../../../store/slice/patient.slice"
import { useEffect, useState, useCallback } from "react";

const contentSchema = yup.object().shape({
  Comment: yup.string().max(500, "Too Long!").required("Comment is required"),
});

const Comments = () => {

  const initialValues = { Comment: "" };
  const [StateInitialValue, setStateInitialValue] = useState(initialValues);
  const ListOfComments = useSelector(selectListComment);
  const loading = useSelector(IsLOadingButton);
  const UpdateLoading = useSelector(UpdateLOadingButton);
  const CurrentEdit = useSelector(selectEditConfirm);
  const router = useRouter();
  const dispatch = useDispatch();
  const { PatientId } = router.query;
  let IsEdit = CurrentEdit.Edit;
  let disable = IsEdit ? UpdateLoading : loading;
  let CurrentCommentId = CurrentEdit?.CommentID?.CommentId
  let data = ListOfComments?.data?.filter((comment) => comment.CommentID == CurrentCommentId)


  useEffect(() => {

    if (IsEdit == true) {
      setStateInitialValue({ Comment: data[0]?.Comment })
    }
    if (IsEdit == false) {
      setStateInitialValue({ Comment: "" })
    }
  }, [IsEdit,CurrentCommentId]);


  const onSubmit = async (values) => {
    console.log(data[0]?.CommentID);
    const UpdateValueToSend = {
      "Comment": values.Comment,
      "Status": true,
      "CommentID": data[0]?.CommentID,
      "PatientId": PatientId,
    }
    const valuesToSend = {
      "PatientID": PatientId,
      "Comment": values.Comment,
    }
    !IsEdit ? await dispatch(PatientAddComment(valuesToSend)) : await dispatch(PatientUpdateComment(UpdateValueToSend));
    const valueToSend = {
      Edit: false,
      CommentID: ""
    }
    dispatch(setEdit(valueToSend));
    setStateInitialValue(initialValues);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={StateInitialValue}
        validationSchema={contentSchema}
        onSubmit={onSubmit}>
        {({ touched, errors, handleSubmit, resetForm, setFieldValue, isSubmitting }) => (
          <>
            <div className='tab_data_header'>
              <div className='tab_title'>
                <h3>Comments</h3>
              </div>
            </div>
            <div
              className='mb-3 p-2'
              style={{
                borderRadius: "3px",
                border: "2px dashed #e8eaed",
              }}>
              <Field
                className='form-control'
                type='text'
                name='Comment'
                as="textarea"
                row="3"
                value={StateInitialValue.Comment}
                onChange={(e) => {
                  setStateInitialValue({ Comment: e.target.value })
                  setFieldValue("Comment", e.target.value)
                }}
                style={{ border: "none" }}
                placeholder='Write your comment here...'></Field>
              {errors.Comment && touched.Comment ? <ErrorMessage className='text-danger small' name='Comment' component='div' /> : null}
              <div className='text-end border-top m-1 pt-2'>
                <Button type='submit' color='primary' disabled={disable} onClick={() => { handleSubmit(); }} >
                  {IsEdit ? "Update" : "Add Comment"}
                </Button>
              </div>
            </div>
            <CommentsList />
          </>
        )}
      </Formik>
    </>
  );
};

export default Comments;
