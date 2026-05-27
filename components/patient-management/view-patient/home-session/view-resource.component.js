import { ErrorMessage, Field, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Button, Label } from "reactstrap";
import * as Yup from "yup";
import { selectIsLoading, uploadImage } from "../../../../store/slice/common.slice";
import { patientIsLoading, selectHomeSessionEdit, selectHomeSessionList, setHomeSessionEdit, updateHomeSession } from "../../../../store/slice/patient.slice";
import { viewResource } from "../../../../store/slice/resource.slice";
import CloseSweetAlert from "../../../shared/close-sweetalert";
import DropZoneForm from "../../../shared/dropzoneform";
import Configurations from "./configurations.component";

function ViewResource({ HomeSessionID, PatientId }) {

    const dispatch = useDispatch();
    const IsEdit = useSelector(selectHomeSessionEdit);
    const data = useSelector(viewResource);
    const HomeSessiondata = useSelector(selectHomeSessionList);
    let values = HomeSessiondata?.filter((e) => e.HomeSessionID == HomeSessionID);
    const loading = useSelector(patientIsLoading);
    const [MediaType, setMediaType] = useState();
    const [url, setUrl] = useState();
    const [type, setType] = useState();




    useEffect(() => {
        setMediaType({ label: values[0]?.ResourceType, value: values[0]?.ResourceType });
        setUrl(values[0]?.ResourceURL)
        setType(values[0]?.ResourceType)
    }, [HomeSessiondata]);


    const [FileType, setFileType] = useState(null);
    const options = [
        { label: 'Image', value: 'Image' },
        { label: 'Video', value: 'Video' },
        { label: 'Audio', value: 'Audio' },
        { label: 'Text', value: 'Text' }
    ]
    const validationSchema = Yup.object().shape({
        MediaTitle: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Please enter Media Title"),
        Description: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Please enter Description"),
        MediaType: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Please enter Media Type"),
    });

    const tog_standard = () => {
        dispatch(setHomeSessionEdit(false));
    };

    useEffect(() => {
        File(data[0]?.ResourceType)
    }, []);

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const onHandleCloseConfirm = async () => {
        setIsAlertOpen(false);
        tog_standard();
    };
    const onCloseAlert = () => {
        setIsAlertOpen(false);
    };
    const imageUploading = useSelector(selectIsLoading);

    const onSubmit = async (value) => {
        const data = {
            "ResourceTitle": value.MediaTitle,
            "ResourceDescription": value.Description,
            "ResourceType": value.MediaType,
            "ResourceURL": value.Upload == null ? values[0]?.ResourceURL : value.Upload,
            "Status": 1
        }
        const valueToSend = {
            data,
            HomeSessionID,
            PatientId
        }
        dispatch(updateHomeSession(valueToSend))
    };

    const File = (fileType) => {
        if (fileType == "Image") {
            setFileType([".jpeg", ".jpg", ".png", ".gif"])
        }
        if (fileType == "Audio") {
            setFileType([".mp3"])
        }
        if (fileType == "Video") {
            setFileType([".mp4"])
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
            <Formik initialValues={{
                MediaTitle: values[0]?.ResourceTitle,
                Description: values[0]?.ResourceDescription,
                MediaType: values[0]?.ResourceType,
            }} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
                {({ touched, errors, handleSubmit, resetForm, isSubmitting, setFieldValue,  }) => (
                    <>
                        {isAlertOpen ? <CloseSweetAlert onConfirm={onHandleCloseConfirm} onClose={onCloseAlert} /> : null}
                        <>
                            <Configurations url={url} type={type} />
                            <div>
                                <div className='mb-4'>
                                    <div className='mb-4 form-group'>
                                        <Label className='form-label required' htmlFor='Department'>
                                            Media Type
                                        </Label>
                                        <Field
                                            component={Select}
                                            options={options}
                                            id='MediaType'
                                            name='MediaType'
                                            placeholder='Select'
                                            value={MediaType}
                                            isDisabled={true}
                                            isSearchable={true}
                                            onChange={(MediaType) => {
                                                setMediaType({ label: MediaType.value, value: MediaType.value });
                                                // File(MediaType.value);
                                                setFieldValue("MediaType", MediaType.value);
                                            }}
                                            styles={{
                                                control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
                                            }}
                                        />
                                        {errors.MediaType && touched.MediaType ? <ErrorMessage className='text-danger small' name='MediaType' component='div' /> : null}
                                    </div>
                                </div>
                                <div className='mb-4 form-group'>
                                    <Label className='form-label required' htmlFor='skill-name'>
                                        Media Title
                                    </Label>
                                    <Field
                                        type='text'
                                        disabled={!IsEdit}
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
                                        disabled={!IsEdit}
                                        name='Description'
                                        placeholder='Enter Description'
                                        className='form-control'
                                    />
                                    {errors.Description && touched.Description ? <ErrorMessage className='text-danger small' name='Description' component='div' /> : null}
                                </div>
                                <>
                                    {IsEdit ? <>
                                        {values[0].ResourceType === "Text" ? <></> : <div className='mb-4 form-group'>
                                            <Label className='form-label required' htmlFor='skill-name'>
                                                File Upload
                                            </Label>
                                            <DropZoneForm multiFiles={false} fileData={uploadMedia} isUploading={imageUploading} accept={FileType} setFieldValue={setFieldValue} />
                                            {errors.Upload && touched.Upload ? <ErrorMessage className='text-danger small' name='Upload' component='div' /> : null}
                                        </div>}
                                        <Button type='submit' disabled={imageUploading || loading} color='primary' className='btn-md m-1 waves-effect waves-light action_btn' onClick={handleSubmit}  >
                                            Submit
                                        </Button> </> : <></>}
                                </>
                            </div>
                        </>
                    </>
                )}
            </Formik>
        </>
    );
}
export default ViewResource;
