import { ErrorMessage, Field, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Button, Card, CardBody, Label, Badge } from "reactstrap";
import * as Yup from "yup";
import { selectIsLoading, uploadImage } from "../../../../store/slice/common.slice";
import { patientIsLoading, selectHomeSessionEdit, selectHomeSessionList, setHomeSessionEdit, updateHomeSession } from "../../../../store/slice/patient.slice";
import CloseSweetAlert from "../../../shared/close-sweetalert";
import DropZoneForm from "../../../shared/dropzoneform";
import { VideoPlayer } from "./vidoe-player";
import AudioConfig from "./audioConfig.component";
import ImageConfig from "./imageConfig.component";

const typeOptions = [
  { label: "Image", value: "Image" },
  { label: "Video", value: "Video" },
  { label: "Audio", value: "Audio" },
  { label: "Text", value: "Text" },
];

const fileAcceptMap = {
  Image: ["image/jpeg", "image/png", "image/gif"],
  Audio: ["audio/mpeg", "audio/mp3"],
  Video: ["video/mp4", "video/quicktime", "video/x-msvideo"],
};

function MediaPreview({ url, type, poster, onPosterChange }) {
  if (!url && type !== "Text") return (
    <div className="text-muted text-center py-4" style={{ fontSize: 13 }}>
      <i className="mdi mdi-image-off-outline d-block mb-1" style={{ fontSize: 28 }}></i>
      No media file attached
    </div>
  );
  if (type === "Video") return <VideoPlayer file_src={url} overlays={[]} poster={poster} onPosterChange={onPosterChange} />;
  if (type === "Image") return <ImageConfig url={url} />;
  if (type === "Audio") return <AudioConfig url={url} />;
  if (type === "Text") return (
    <div style={{ padding: "16px", background: "#f8f9fa", borderRadius: "8px", minHeight: "80px", fontSize: "14px", color: "#495057" }}>
      {url || <span className="text-muted">No text content</span>}
    </div>
  );
  return null;
}

function ViewResource({ HomeSessionID, PatientId }) {
  const dispatch = useDispatch();
  const IsEdit = useSelector(selectHomeSessionEdit);
  const HomeSessiondata = useSelector(selectHomeSessionList);
  const loading = useSelector(patientIsLoading);
  const imageUploading = useSelector(selectIsLoading);

  const session = HomeSessiondata?.find((e) => String(e.HomeSessionID) === String(HomeSessionID));

  const [mediaType, setMediaType] = useState(session ? { label: session.ResourceType, value: session.ResourceType } : null);
  const [url, setUrl] = useState(session?.ResourceURL ?? null);
  const [thumbnail, setThumbnail] = useState(session?.ThumbnailURL ?? "");
  const [fileAccept, setFileAccept] = useState(session ? fileAcceptMap[session.ResourceType] || null : null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    if (session) {
      setMediaType({ label: session.ResourceType, value: session.ResourceType });
      setUrl(session.ResourceURL);
      setThumbnail(session.ThumbnailURL || "");
      setFileAccept(fileAcceptMap[session.ResourceType] || null);
    }
  }, [session?.HomeSessionID]);

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
      ResourceURL: values.Upload || session?.ResourceURL,
      ThumbnailURL: thumbnail || null,
      Status: 1,
    };
    dispatch(updateHomeSession({ data: payload, HomeSessionID, PatientId }));
  };

  if (!session) return null;

  return (
    <Formik
      initialValues={{
        MediaTitle: session.ResourceTitle || "",
        Description: session.ResourceDescription || "",
        MediaType: session.ResourceType || "",
        Upload: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ errors, touched, handleSubmit, setFieldValue, values }) => (
        <div className="session-detail-layout">
          {isAlertOpen && (
            <CloseSweetAlert
              onConfirm={() => { setIsAlertOpen(false); dispatch(setHomeSessionEdit(false)); }}
              onClose={() => setIsAlertOpen(false)}
            />
          )}

          {/* ── Media Preview ── */}
          <Card className="session-media-card mb-3">
            <CardBody>
              <div className="session-media-header mb-3">
                <div>
                  <h5 className="mb-1">{session.ResourceTitle}</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "13px" }}>{session.ResourceDescription}</p>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <Badge color={
                    session.ResourceType === "Video" ? "primary" :
                    session.ResourceType === "Audio" ? "success" :
                    session.ResourceType === "Image" ? "warning" : "secondary"
                  }>
                    {session.ResourceType}
                  </Badge>
                  <Badge color={session.IsRead ? "success" : "light"} className="text-dark">
                    {session.IsRead ? "Completed" : "Not Started"}
                  </Badge>
                </div>
              </div>

              <MediaPreview
                url={url}
                type={session.ResourceType}
                poster={thumbnail}
                onPosterChange={IsEdit ? (val) => setThumbnail(val) : undefined}
              />
            </CardBody>
          </Card>

          {/* ── Session Details (collapsible edit) ── */}
          {IsEdit && (
            <Card className="mb-3">
              <CardBody>
                <h6 className="mb-3">Edit Session Details</h6>

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

                {session.ResourceType !== "Text" && (
                  <div className="mb-3">
                    <Label className="form-label">Replace File <span className="text-muted" style={{ fontSize: 12, fontWeight: 400 }}>(optional)</span></Label>
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
                      accept={fileAccept}
                      setFieldValue={setFieldValue}
                    />
                  </div>
                )}

                {session.ResourceType === "Video" && (
                  <div className="mb-3">
                    <Label className="form-label">Thumbnail URL <span className="text-muted" style={{ fontSize: 12, fontWeight: 400 }}>(optional)</span></Label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://example.com/thumbnail.jpg"
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                    />
                    {thumbnail && (
                      <img
                        src={thumbnail}
                        alt="thumbnail preview"
                        className="mt-2"
                        style={{ height: 56, borderRadius: 6, objectFit: "cover" }}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    )}
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
                  <Button
                    type="button"
                    color="light"
                    className="btn-md waves-effect action_btn"
                    onClick={() => dispatch(setHomeSessionEdit(false))}
                  >
                    Cancel
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          <style jsx>{`
            .session-detail-layout {
              padding: 0 4px;
            }
            .session-media-card {
              border-radius: 12px;
            }
            .session-media-header {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 12px;
            }
            @media (max-width: 576px) {
              .session-media-header {
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
