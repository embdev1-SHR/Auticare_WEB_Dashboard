import { useState } from "react";
import { Button, Label } from "reactstrap";

import { ErrorMessage, Field, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectTherapist, selectTherapistIsEdit, therapistUpdation } from "../../../store/slice/therapist.slice";
import FileDropZoneForm from "../../shared/filedropzoneform";
import { therapistValidation } from "../therapist-validation";

function TherapistDocuments() {
  const dispatch = useDispatch();
  const router = useRouter();
  const IsEdit = useSelector(selectTherapistIsEdit);
  const Therapist = useSelector(selectTherapist);
  const [isDocUploading, setDocUploading] = useState(false);

  const onSubmit = async (values, actions) => {
    const valuesToSend = { ...values, Status: true };
    await dispatch(therapistUpdation(valuesToSend));
    actions.setSubmitting(false);
  };

  const onDocHandling = async (Files) => {
    if (Files.length > 0) {
      setDocUploading(true);

      let formData = new FormData();
      formData.append("imageFile", Files[0]);

      try {
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
        // handle result here
        const filename = originalPromiseResult.split("/").pop();

        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, " ") : filename;

        setFieldValue("DocumentsURL", originalPromiseResult);
        setDocUploading(false);
      } catch (err) {
        // handle error here
        console.log(err);
        setDocUploading(false);
      }
    }
  };

  return Therapist.length > 0 ? (
    <Formik initialValues={Therapist[0]} validationSchema={therapistValidation(1)} onSubmit={onSubmit} enableReinitialize={true}>
      {({ errors, touched, handleSubmit }) => (
        <>
          <fieldset disabled={IsEdit ? false : true}>
            <div className='mb-4'>
              <Label className='form-label required' htmlFor='profile'>
                Profile
              </Label>
              <Field as='textarea' className='form-control' id='profile' name='Profile' rows={3} />

              {errors.Profile && touched.Profile ? <ErrorMessage className='text-danger small' name='Profile' component='div' /> : null}
            </div>
            <div className='mb-4'>
              <Label className='form-label required'>Documents</Label>
              {IsEdit ? (
                <FileDropZoneForm multiFiles={false} fileData={onDocHandling} isUploading={isDocUploading} displayName={Therapist[0]?.DocumentsURL} />
              ) : (
                <div>
                  <Link href={`${Therapist[0]?.DocumentsURL}`} passHref>
                    {/* <Link href={DocumentsURL} passHref> */}
                    <a target='_blank' className='waves-effect waves-light m-2 btn-primary btn-sm'>
                      View Documents
                    </a>
                  </Link>
                  {/* <Field name="DocumentsURL" type="text" className="form-control" value={Therapist[0]?.DocumentsURL.substring(13)} /> */}
                </div>
              )}
              {errors.DocumentsURL && touched.DocumentsURL ? <ErrorMessage className='text-danger small' name='DocumentsURL' component='div' /> : null}
            </div>
          </fieldset>
          <div className='container-action d-flex justify-content-end'>
            {IsEdit ? (
              <>
                <Button type='button' color='light' className='btn-md waves-effect waves-light action_btn mr-3' onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type='submit' color='primary' className='btn-md waves-effect waves-light action_btn' onClick={handleSubmit}>
                  Update
                </Button>
              </>
            ) : (
              <Button type='button' color='secondary' className='btn-md waves-effect waves-light action_btn' onClick={() => router.back()}>
                Back
              </Button>
            )}
          </div>
        </>
      )}
    </Formik>
  ) : null;
}
export default TherapistDocuments;
