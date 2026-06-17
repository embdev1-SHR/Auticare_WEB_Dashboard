import { ErrorMessage, Field, Formik, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import * as Yup from "yup";
import { selectSetModalOpenState, setModalOpen } from "../../../../store/slice/layout.slice";
import CloseSweetAlert from "../../../shared/close-sweetalert";
import DropZoneForm from "../../../shared/dropzoneform";
import { selectIsLoading, uploadImage } from "../../../../store/slice/common.slice";
import { CreateFreeResources, IsLoading, ResourceIsLoading } from "../../../../store/slice/resource.slice";
import { HomeSessionID, createHomeSession, patientIsLoading, selectEditConfirm, selectHomeSessionEdit, selectHomeSessionList, setEdit, setHomeSessionEdit } from "../../../../store/slice/patient.slice";

function AddMedia({ PatientId }) {
  const dispatch = useDispatch();
  const setModalOpenState = useSelector(selectSetModalOpenState);
  const imageUploading = useSelector(selectIsLoading);
  const IsEdit = useSelector(selectHomeSessionEdit);
  const data = useSelector(selectHomeSessionList);
  const loading = useSelector(patientIsLoading);
  const [FileType, setFileType] = useState([]);
  const options = [
    { label: 'Image', value: 'Image' },
    { label: 'Video', value: 'Video' },
    { label: 'Audio', value: 'Audio' },
    { label: 'Text', value: 'Text' }
  ]
  const tog_standard = () => {
    dispatch(setModalOpen(!setModalOpenState));
  };
  const [validationSchema, setValidationSchema] = useState(Yup.object().shape({
    MediaTitle: Yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Please enter Media Title"),
    Description: Yup.string().min(2, "Too Short!").max(500, "Too Long!").required("Please enter Description"),
    MediaType: Yup.string().min(2, "Too Short!").max(20, "Too Long!").required("Please enter Media Type"),
    Upload: Yup.mixed().required("Please Upload File"),
  }))

  const onSubmit = async (values) => {

    const valueToSend = {
      "PatientID": PatientId,
      "ResourceTitle": values.MediaTitle,
      "ResourceDescription": values.Description,
      "ResourceType": values.MediaType,
      "ResourceURL": values.Upload,
      tog_standard
    }
    dispatch(createHomeSession(valueToSend));

  };

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const onHandleCloseConfirm = async () => {
    setIsAlertOpen(false);
    tog_standard();
  };
  const onCloseAlert = () => {
    setIsAlertOpen(false);
  };


  const File = (fileType) => {
    if (fileType == "Text") {
      setValidationSchema(Yup.object().shape({
        MediaTitle: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Please enter Media Title"),
        Description: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Please enter Description"),
        MediaType: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Please enter Media Type"),
      }))
    }
    if (fileType == "Image") {
      setFileType(["image/jpeg", "image/png", "image/gif"])
    }
    if (fileType == "Audio") {
      setFileType(["audio/mpeg", "audio/mp3"])
    }
    if (fileType == "Video") {
      setFileType(["video/mp4", "video/quicktime", "video/x-msvideo"])
    }
  };

  const uploadMedia = async (Files, setFieldValue) => {
    if (Files.length > 0) {
      let formData = new FormData();
      formData.append("imageFile", Files[0]);
      try {
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, " ") : filename;
        if (setFieldValue) {
          setFieldValue("Upload", originalPromiseResult);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };



  return (
    <>
      <Button type='button' onClick={tog_standard} color='primary' className='waves-effect waves-light'>
        Add Resource
      </Button>
      <Formik initialValues={{
        MediaTitle: "",
        Description: "",
        MediaType: "",
        Upload: ""
      }} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
        {({ touched, errors, handleSubmit, resetForm, isSubmitting, setFieldValue, values }) => (
          <Modal
            isOpen={setModalOpenState}
            toggle={() => {
              setIsAlertOpen(true);
            }}
            scrollable={true}
            className='modal right app_modal width-60'
            onClosed={() => {
              resetForm();
            }}>
            {isAlertOpen ? <CloseSweetAlert onConfirm={onHandleCloseConfirm} onClose={onCloseAlert} /> : null}
            <ModalHeader
              toggle={() => {
                setIsAlertOpen(true);
              }}>
              Add Resource
            </ModalHeader>
            <ModalBody>
              <div className='mb-4'>
                <Label className='form-label required' htmlFor='Department'>
                  Media Type
                </Label>
                <Field
                  component={Select}
                  options={options}
                  id='MediaType'
                  name='MediaType'
                  placeholder='Select'
                  isSearchable={true}
                  onChange={(MediaType) => {
                    setFieldValue("MediaType", MediaType.value);
                    File(MediaType.value);
                  }}
                  styles={{
                    control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
                  }}
                />
                {errors.MediaType && touched.MediaType ? <ErrorMessage className='text-danger small' name='MediaType' component='div' /> : null}
              </div>
              <div className='mb-4 form-group'>
                <Label className='form-label required' htmlFor='skill-name'>
                  Media Title
                </Label>
                <Field
                  type='text'
                  name='MediaTitle'
                  id='skill-name'
                  placeholder='Enter Media Title'
                  className='form-control'
                />
                {errors.MediaTitle && touched.MediaTitle ? <ErrorMessage className='text-danger small' name='MediaTitle' component='div' /> : null}
              </div>
              <div className='mb-4 form-group'>
                <Label className='form-label required' htmlFor='skill-name'>
                  Description
                </Label>
                <Field
                  type='text'
                  name='Description'
                  placeholder='Enter Description'
                  className='form-control'
                />
                {errors.Description && touched.Description ? <ErrorMessage className='text-danger small' name='Description' component='div' /> : null}
              </div>
              {values.MediaType == "Text" || values.MediaType.length == 0 ? <></> : <div className='mb-4 form-group'>
                <Label className='form-label required' htmlFor='Upload'>
                  File Upload
                </Label>
                <DropZoneForm multiFiles={false} fileData={uploadMedia} isUploading={imageUploading} accept={FileType} setFieldValue={setFieldValue} />
                {errors.Upload && touched.Upload ? <ErrorMessage className='text-danger small' name='Upload' component='div' /> : null}
              </div>}
            </ModalBody>
            <ModalFooter>
              <Button type='submit' disabled={imageUploading || loading} color='primary' className='btn-md m-1 waves-effect waves-light action_btn' onClick={handleSubmit} >
                Submit
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
}
export default AddMedia;
