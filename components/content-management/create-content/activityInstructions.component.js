import { ErrorMessage, Field, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { ContentDetails, contentIsLoading, selectContentIsEdit, updateContent } from "../../../store/slice/content.slice";
import TextConfig from "./textConfig.component";

const ActivityInstructions = () => {
  const dispatch = useDispatch();
  const Loading = useSelector(contentIsLoading);
  const content = useSelector(ContentDetails);
  const isEdit = useSelector(selectContentIsEdit);
  console.log("isEdit1",isEdit);
  const [contentInitials, setContentInitials] = useState([]);
  const router = useRouter();
  const { ContentID } = router.query;

  const validationSchema = Yup.object().shape({
    ActivityInstructionTitle: Yup.string().max(1000, "Too Long!").required(
      "Please enter Activity instruction title"
    ),
    ContentActivityDescription: Yup.string().max(3000, "Too Long!").required(
      "Please enter content Activity description"
    ),
  });
  useEffect(() => {
    setContentInitials({
      ActivityInstructionTitle: content ? content.ActivityInstructionTitle : "",
      ContentActivityDescription: content ? content.ActivityInstructionDescription : "",
    });
  }, [ContentID, content]);

  function onSubmit(values) {

    const data = {
      "ContentID": content.ContentID,
      "ContentActivityName": content.ContentActivityName,
      "ContentActivityDescription": content.ContentActivityDescription,
      "ActivityInstructionTitle": values.ActivityInstructionTitle,
      "ActivityInstructionDescription": values.ContentActivityDescription,
      "ContentDescription": content.ContentDescription,
      "ContentCategory": content.ContentCategory,
      "FileUploadURL": content.FileUploadURL,
      "Status": true
    }
    dispatch(updateContent(data));
  }

  return (
    <>
      <Formik
        initialValues={contentInitials}
        onSubmit={onSubmit}
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
            <div className="mb-4">
              <Field
                component={TextConfig}
                label="Title"
                edit={!isEdit}
                name="ActivityInstructionTitle"
                value={values.ActivityInstructionTitle}
                setValue={(value) =>
                  setFieldValue("ActivityInstructionTitle", value)
                }
                placeholder="Enter activity instruction title ..."
              />
              {errors.ActivityInstructionTitle &&
                touched.ActivityInstructionTitle ? (
                <ErrorMessage
                  className="text-danger small"
                  name="ActivityInstructionTitle"
                  component="div"
                />
              ) : null}
              <label className='form-label' style={{ display: "flex", justifyContent: "flex-end", marginTop: "-20px" }}>Characters ({values.ActivityInstructionTitle?.length ? values.ActivityInstructionTitle?.length : 0}/1000)</label>
            </div>
            <div className="mb-4 h-75" >
              <Field
                component={TextConfig}
                edit={!isEdit}
                label="Description"
                name="ContentActivityDescription"
                value={values.ContentActivityDescription}
                setValue={(value) =>
                  setFieldValue("ContentActivityDescription", value)
                }
                placeholder="Enter activity instruction description ..."
              />
              {errors.ContentActivityDescription &&
                touched.ContentActivityDescription ? (
                <ErrorMessage
                  className="text-danger small"
                  name="ContentActivityDescription"
                  component="div"
                />
              ) : null}
              <label className='form-label' style={{ display: "flex", justifyContent: "flex-end", marginTop: "-20px" }}>Characters ({values.ContentActivityDescription?.length ? values.ContentActivityDescription?.length : 0}/3000)</label>
            </div>
            <div className="container-action d-flex justify-content-end pb-1">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={Loading}
                className="btn btn-primary btn-md waves-effect waves-light action_btn ml-2"
              >
                Save
              </button>
            </div>
          </>
        )}
      </Formik>
    </>
  );
};

export default ActivityInstructions;
