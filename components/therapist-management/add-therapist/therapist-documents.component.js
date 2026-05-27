import { useState } from "react";
import { Label, Input } from "reactstrap";

import { Field, useFormikContext } from "formik";
import { ErrorMessage } from "formik";
import FileDropZoneForm from "../../shared/filedropzoneform";
import { useDispatch } from "react-redux";
import { uploadImage } from "../../../store/slice/common.slice";

function TherapistDocuments() {
  const dispatch = useDispatch();
  // Grab errors and touched from context
  const { errors, values, touched, setFieldValue } = useFormikContext();
  const [isDocUploading, setDocUploading] = useState(false);

  const onDocHandling = async (Files) => {
    if (Files.length > 0) {
      setDocUploading(true);
      let formData = new FormData();
      formData.append("imageFile", Files[0]);

      const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
      // handle result here
      const filename = originalPromiseResult.split("/").pop();
      const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, "-") : filename;

      setFieldValue("DocumentsURL", originalPromiseResult);
      setDocUploading(false);
    }
  };
  const onEditHandle = async (data) => {
    // if (Files.length > 0) {
  };
  return (
    <div>
      <div className='mb-4'>
        <Label className='form-label required' htmlFor='profile'>
          Profile
        </Label>

        <Field as='textarea' className='form-control' id='profile' name='Profile' rows={3} />
        {errors.Profile && touched.Profile ? <ErrorMessage className='text-danger small' name='Profile' component='div' /> : null}
      </div>
      <div className='mb-4'>
        <Label className='form-label required'>Documents</Label>
        <FileDropZoneForm multiFiles={false} fileData={onDocHandling} isUploading={isDocUploading} />
        {errors.DocumentsURL && touched.DocumentsURL ? <ErrorMessage className='text-danger small' name='DocumentsURL' component='div' /> : null}
      </div>
    </div>
  );
}
export default TherapistDocuments;
