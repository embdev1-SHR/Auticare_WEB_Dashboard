import { ErrorMessage, Field, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Button, Label } from "reactstrap";
import * as Yup from "yup";
import { selectIsLoading, uploadImage } from "../../store/slice/common.slice";
import { ResourceIsLoading, UpdateFreeResources, selectIsEdit, viewResource } from "../../store/slice/resource.slice";
import DropZoneForm from "../shared/dropzoneform";
import Configurations from "./configurations.component";

function ViewResource(ResourceID) {
    const dispatch = useDispatch();
    const IsEdit = useSelector(selectIsEdit);
    const data = useSelector(viewResource);


    const loading = useSelector(ResourceIsLoading);
    const [MediaType, setMediaType] = useState({ label: data[0]?.ResourceType, value: data[0]?.ResourceType });
    const [id, setId] = useState(data[0]?.FreeResourceID);
    const [url, setUrl] = useState(data[0]?.ResourceURL);

    const [FileType, setFileType] = useState(null);
    const options = [
        { label: 'Image', value: 'Image' },
        { label: 'Video', value: 'Video' },
        { label: 'Audio', value: 'Audio' },
        { label: 'Text', value: 'Text' }
    ]
    const validationSchema = Yup.object().shape({
        MediaTitle: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Please enter Media Title"),
        Description: Yup.string().min(2, "Too Short!").max(250, "Too Long!").required("Please enter Description"),
        MediaType: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Please enter Media Type"),
    });
    useEffect(() => {
        File(data[0]?.ResourceType)
    }, []);

    const imageUploading = useSelector(selectIsLoading);

    const onSubmit = async (values) => {

        const data = {
            "ResourceTitle": values.MediaTitle,
            "ResourceDescription": values.Description,
            "ResourceType": values.MediaType,
            "ResourceURL": values.Upload == "" ? url : values.Upload,
            "Status": 1
        }

        const valueToSend = {
            data,
            FreeResourceID: id
        }
        dispatch(UpdateFreeResources(valueToSend))
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
                MediaTitle: data[0]?.ResourceTitle,
                Description: data[0]?.ResourceDescription,
                MediaType: data[0]?.ResourceType,
                Upload: ""

            }} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
                {({ touched, errors, handleSubmit, resetForm, isSubmitting, setFieldValue, values }) => (
                    <div >
                        <div>
                            <div className='mb-4'>
                                <Configurations url={data[0]?.ResourceURL} type={data[0]?.ResourceType} />
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
                                    name='MediaTitle'
                                    id='skill-name'
                                    disabled={!IsEdit}
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
                                    disabled={!IsEdit}
                                    placeholder='Enter Description'
                                    className='form-control'
                                />
                                {errors.Description && touched.Description ? <ErrorMessage className='text-danger small' name='Description' component='div' /> : null}
                            </div>
                            {IsEdit && data[0]?.ResourceType != "Text" &&
                                <div className='mb-4 form-group'>
                                    <Label className='form-label required' htmlFor='skill-name'>
                                        File Upload
                                    </Label>
                                    <DropZoneForm multiFiles={false} fileData={uploadMedia} isUploading={imageUploading} accept={FileType} setFieldValue={setFieldValue} />
                                    {errors.Upload && touched.Upload ? <ErrorMessage className='text-danger small' name='Upload' component='div' /> : null}
                                </div>}
                            {IsEdit ? <><Button type='submit' color='primary' disabled={imageUploading || loading} className='btn-md m-1 waves-effect waves-light action_btn' onClick={handleSubmit} >
                                Submit
                            </Button></> : <></>}
                        </div>
                    </div>
                )}
            </Formik>
        </>
    );
}
export default ViewResource;
