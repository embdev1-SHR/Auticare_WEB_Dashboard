import { ErrorMessage, useFormikContext } from "formik";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "reactstrap";
import { selectClient, selectIsEdit } from "../../../store/slice/client.slice";
import { uploadImage } from "../../../store/slice/common.slice";
import FileDropZoneForm from "../../shared/filedropzoneform";
import Loader from "../../shared/loader";

function Documents() {
  const { setFieldValue, values, errors, touched } = useFormikContext();
  const dispatch = useDispatch();
  const client = useSelector(selectClient);
  const IsEdit = useSelector(selectIsEdit);
  const [isincofileChange, setIsincofileChange] = useState(false);
  const [isRegfileChange, setIsRegfileChange] = useState(false);

  var incorpFile, registFile;
  if (values !== undefined) {
    incorpFile = values.IncorporationCertificateURL.indexOf("-") >= 0 ? values.IncorporationCertificateURL.replace(/-/g, " ") : values.IncorporationCertificateURL;
    registFile = values.RegistrationCertificateURL.indexOf("-") >= 0 ? values.RegistrationCertificateURL.replace(/-/g, " ") : values.RegistrationCertificateURL;
  }

  const uploadIncorporation = async (incorporationFiles) => {
    if (incorporationFiles.length > 0) {
      setIsincofileChange(true);
      let formData = new FormData();
      formData.append("imageFile", incorporationFiles[0]);

      try {
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();

        // handle result here
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, "-") : filename;

        setFieldValue("IncorporationCertificateURL", originalPromiseResult);
        setIsincofileChange(false);
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        setIsincofileChange(false);
      }
    }
  };

  const uploadRegistration = async (regFiles) => {
    if (regFiles.length > 0) {
      setIsRegfileChange(true);
      let formData = new FormData();
      formData.append("imageFile", regFiles[0]);

      try {
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();

        // handle result here
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, "-") : filename;

        setFieldValue("RegistrationCertificateURL", originalPromiseResult);
        setIsRegfileChange(false);
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        setIsRegfileChange(false);
      }
    }
  };

  return client.length > 0 ? (
    <fieldset disabled={IsEdit ? false : true}>
      <div className='mb-4'>
        <Label className='form-label required'>Incorporation certificate</Label>
        {IsEdit ? (
          <>
            <FileDropZoneForm multiFiles={false} name='IncorporationCertificateURL' isUploading={isincofileChange} fileData={uploadIncorporation} displayName={values?.IncorporationCertificateURL} />
          </>
        ) : (
          <div>
            <Link href={`${values.IncorporationCertificateURL}`} passHref>
              <a target='_blank' className='waves-effect waves-light m-2 btn-primary btn-sm'>
                View Incorporation certificate
              </a>
            </Link>
          </div>
        )}
        {errors.IncorporationCertificateURL && touched.IncorporationCertificateURL ? <ErrorMessage className='text-danger small' name='IncorporationCertificateURL' component='div' /> : null}
      </div>
      <div className='mb-4'>
        <Label className='form-label required'>Registration certificate</Label>
        {IsEdit ? (
          <>
            <FileDropZoneForm multiFiles={false} name='RegistrationCertificateURL' isUploading={isRegfileChange} fileData={uploadRegistration} displayName={values?.RegistrationCertificateURL} />
          </>
        ) : (
          <div>
            <Link href={`${values.RegistrationCertificateURL}`} passHref>
              <a target='_blank' className='waves-effect waves-light m-2 btn-primary btn-sm'>
                View Registration certificate
              </a>
            </Link>
          </div>
        )}

        {errors.RegistrationCertificateURL && touched.RegistrationCertificateURL ? <ErrorMessage className='text-danger small' name='RegistrationCertificateURL' component='div' /> : null}
      </div>
    </fieldset>
  ) : (
    <Loader />
  );
}
export default Documents;
