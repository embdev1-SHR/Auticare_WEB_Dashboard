import { ErrorMessage, useFormikContext } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Label } from "reactstrap";
import { uploadImage } from "../../../store/slice/common.slice";
import FileDropZoneForm from "../../shared/filedropzoneform";

function Documents() {
  const dispatch = useDispatch();
  // Grab errors and touched from context
  const { errors, touched, setFieldValue } = useFormikContext();
  // const FileUploading = useSelector(selectIsLoading);
  const [incoFileLoading, setIncoFileLoading] = useState(false);
  const [regFileLoading, setRegFileLoading] = useState(false);

  const uploadIncorporation = async (incorporationFiles) => {
    if (incorporationFiles.length > 0) {
      setIncoFileLoading(true);
      let formData = new FormData();
      formData.append("imageFile", incorporationFiles[0]);

      try {
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
        // handle result here
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, "-") : filename;

        setFieldValue("IncorporationCertificateURL", originalPromiseResult);
        setIncoFileLoading(false);
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        setIncoFileLoading(false);
      }
    }
  };

  const uploadRegistration = async (regFiles) => {
    if (regFiles.length > 0) {
      setRegFileLoading(true);
      let formData = new FormData();
      formData.append("imageFile", regFiles[0]);

      try {
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();

        // handle result here
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, "-") : filename;

        setFieldValue("RegistrationCertificateURL", originalPromiseResult);
        setRegFileLoading(false);
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        setRegFileLoading(false);
      }
    }
  };
  return (
    <div>
      <div className='mb-4'>
        <Label className='form-label required' htmlFor='IncorporationCertificateURL'>
          Incorporation certificate
        </Label>

        <FileDropZoneForm multiFiles={false} fileData={uploadIncorporation} isUploading={incoFileLoading} />

        {errors.IncorporationCertificateURL && touched.IncorporationCertificateURL ? <ErrorMessage className='text-danger small' name='IncorporationCertificateURL' component='div' /> : null}
      </div>
      <div className='mb-4'>
        <Label className='form-label required' htmlFor='RegistrationCertificateURL'>
          Registration certificate
        </Label>

        <FileDropZoneForm multiFiles={false} fileData={uploadRegistration} isUploading={regFileLoading} />

        {errors.RegistrationCertificateURL && touched.RegistrationCertificateURL ? <ErrorMessage className='text-danger small' name='RegistrationCertificateURL' component='div' /> : null}
      </div>
    </div>
  );
}
export default Documents;
