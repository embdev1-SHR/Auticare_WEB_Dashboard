import { ErrorMessage, Field, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Button, Card, CardBody, Label, Badge } from "reactstrap";
import * as Yup from "yup";
import { selectIsLoading, uploadImage } from "../../store/slice/common.slice";
import { ResourceIsLoading, UpdateFreeResources, selectIsEdit, viewResource } from "../../store/slice/resource.slice";
import DropZoneForm from "../shared/dropzoneform";
import Configurations from "./configurations.component";

const typeOptions = [
  { label: "Image", value: "Image" },
  { label: "Video", value: "Video" },
  { label: "Audio", value: "Audio" },
  { label: "Text", value: "Text" },
];

const fileAcceptMap = {
  Image: [".jpeg", ".jpg", ".png", ".gif"],
  Audio: [".mp3"],
  Video: [".mp4"],
};

const typeBadgeColor = { Video: "primary", Audio: "success", Image: "warning", Text: "secondary" };

function ViewResource(ResourceID) {
  const dispatch = useDispatch();
  const IsEdit = useSelector(selectIsEdit);
  const data = useSelector(viewResource);
  const loading = useSelector(ResourceIsLoading);
  const imageUploading = useSelector(selectIsLoading);

  const resource = data[0];

  const [mediaType, setMediaType] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (resource) {
      setMediaType({ label: resource.ResourceType, value: resource.ResourceType });
      setUrl(resource.ResourceURL);
    }
  }, [resource]);

  const validationSchema = Yup.object().shape({
    MediaTitle: Yup.string().min(2, "Too Short!").max(100, "Too Long!").required("Required"),
    Description: Yup.string().min(2, "Too Short!").max(250, "Too Long!").required("Required"),
    MediaType: Yup.string().required("Required"),
  });

  const onSubmit = (values) => {
    const payload = {
      ResourceTitle: values.MediaTitle,
      ResourceDescription: values.Description,
      ResourceType: values.MediaType,
      ResourceURL: values.Upload || resource?.ResourceURL,
      Status: 1,
    };
    dispatch(UpdateFreeResources({ data: payload, FreeResourceID: resource?.FreeResourceID }));
  };

  if (!resource) return null;

  return (
    <Formik
      initialValues={{
        MediaTitle: resource.ResourceTitle || "",
        Description: resource.ResourceDescription || "",
        MediaType: resource.ResourceType || "",
        Upload: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ errors, touched, handleSubmit, setFieldValue }) => (
        <div className="resource-detail-layout">

          {/* ── Media Preview Card ── */}
          <Card className="resource-media-card mb-3">
            <CardBody>
              <div className="resource-media-header mb-3">
                <div>
                  <h5 className="mb-1">{resource.ResourceTitle}</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                    {resource.ResourceDescription}
                  </p>
                </div>
                <Badge color={typeBadgeColor[resource.ResourceType] || "secondary"}>
                  {resource.ResourceType}
                </Badge>
              </div>

              <Configurations url={url} type={resource.ResourceType} />
            </CardBody>
          </Card>

          {/* ── Edit Form (only in edit mode) ── */}
          {IsEdit && (
            <Card className="mb-3">
              <CardBody>
                <h6 className="mb-3">Edit Resource Details</h6>

                <div className="mb-3">
                  <Label className="form-label required">Media Type</Label>
                  <Select
                    options={typeOptions}
                    value={mediaType}
                    isDisabled
                    styles={{ control: (s) => ({ ...s, borderColor: "#e8eaed", borderRadius: "0.375rem" }) }}
                  />
                </div>

                <div className="mb-3">
                  <Label className="form-label required">Media Title</Label>
                  <Field name="MediaTitle" type="text" className="form-control" placeholder="Enter title" />
                  {errors.MediaTitle && touched.MediaTitle && (
                    <ErrorMessage name="MediaTitle" component="div" className="text-danger small" />
                  )}
                </div>

                <div className="mb-3">
                  <Label className="form-label required">Description</Label>
                  <Field name="Description" as="textarea" rows={3} className="form-control" placeholder="Enter description" />
                  {errors.Description && touched.Description && (
                    <ErrorMessage name="Description" component="div" className="text-danger small" />
                  )}
                </div>

                {resource.ResourceType !== "Text" && (
                  <div className="mb-3">
                    <Label className="form-label">Replace File</Label>
                    <DropZoneForm
                      multiFiles={false}
                      fileData={async (files, setFV) => {
                        if (!files.length) return;
                        const fd = new FormData();
                        fd.append("imageFile", files[0]);
                        try {
                          const res = await dispatch(uploadImage(fd)).unwrap();
                          setFV("Upload", res);
                          setUrl(res);
                        } catch (e) { console.error(e); }
                      }}
                      isUploading={imageUploading}
                      accept={fileAcceptMap[resource.ResourceType] || null}
                      setFieldValue={setFieldValue}
                    />
                  </div>
                )}

                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    type="submit"
                    color="primary"
                    className="btn-md waves-effect waves-light action_btn"
                    disabled={imageUploading || loading}
                    onClick={handleSubmit}
                  >
                    {loading ? "Saving…" : "Save Changes"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          <style jsx>{`
            .resource-detail-layout {
              padding: 0 4px;
            }
            .resource-media-card {
              border-radius: 12px;
            }
            .resource-media-header {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 12px;
            }
            @media (max-width: 576px) {
              .resource-media-header {
                flex-direction: column;
              }
            }
          `}</style>
        </div>
      )}
    </Formik>
  );
}

export default ViewResource;
