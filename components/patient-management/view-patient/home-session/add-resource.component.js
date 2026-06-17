import { ErrorMessage, Field, Formik } from "formik";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  Button, Label, Modal, ModalBody, ModalFooter, ModalHeader,
  Badge, Spinner, Table, Input,
} from "reactstrap";
import * as Yup from "yup";
import { selectSetModalOpenState, setModalOpen } from "../../../../store/slice/layout.slice";
import CloseSweetAlert from "../../../shared/close-sweetalert";
import DropZoneForm from "../../../shared/dropzoneform";
import { selectIsLoading, uploadImage } from "../../../../store/slice/common.slice";
import { createHomeSession, listHomeSession, patientIsLoading } from "../../../../store/slice/patient.slice";
import { HomeSessionCreationService } from "../../../../services/patient.services";
import { ToastNotification } from "../../../shared/toast";

const mediaTypeOptions = [
  { label: "Image", value: "Image" },
  { label: "Video", value: "Video" },
  { label: "Audio", value: "Audio" },
  { label: "Text", value: "Text" },
];

const mimeMap = {
  Image: ["image/*"],
  Audio: ["audio/*"],
  Video: ["video/*"],
};

const VALID_TYPES = ["Image", "Video", "Audio", "Text"];

function AddMedia({ PatientId }) {
  const dispatch = useDispatch();
  const setModalOpenState = useSelector(selectSetModalOpenState);
  const imageUploading = useSelector(selectIsLoading);
  const loading = useSelector(patientIsLoading);

  const [fileType, setFileType] = useState([]);
  const [sourceMode, setSourceMode] = useState("upload"); // "upload" | "link"
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkRows, setBulkRows] = useState([]);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const csvRef = useRef(null);

  const tog_standard = () => dispatch(setModalOpen(!setModalOpenState));

  const validationSchema = Yup.object().shape({
    MediaTitle: Yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Please enter Media Title"),
    Description: Yup.string().min(2, "Too Short!").max(500, "Too Long!").required("Please enter Description"),
    MediaType: Yup.string().required("Please select Media Type"),
    LinkURL: Yup.string().when("_sourceMode", {
      is: () => sourceMode === "link",
      then: Yup.string().url("Please enter a valid URL").required("Please enter a URL"),
      otherwise: Yup.string(),
    }),
  });

  const onSubmit = (values, { resetForm }) => {
    const resourceURL = sourceMode === "link" ? values.LinkURL : (values.Upload || null);
    dispatch(createHomeSession({
      PatientID: PatientId,
      ResourceTitle: values.MediaTitle,
      ResourceDescription: values.Description,
      ResourceType: values.MediaType,
      ResourceURL: resourceURL,
      ThumbnailURL: values.ThumbnailURL || null,
      tog_standard,
    }));
  };

  const handleTypeChange = (opt, setFieldValue) => {
    setFieldValue("MediaType", opt.value);
    setFieldValue("Upload", "");
    setFieldValue("LinkURL", "");
    setFieldValue("ThumbnailURL", "");
    setFileType(mimeMap[opt.value] || []);
    setSourceMode("upload");
  };

  const uploadMedia = async (files, setFieldValue) => {
    if (!files.length) return;
    const fd = new FormData();
    fd.append("imageFile", files[0]);
    try {
      const url = await dispatch(uploadImage(fd)).unwrap();
      setFieldValue("Upload", url);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Bulk add ──────────────────────────────────────────────
  const downloadTemplate = () => {
    const rows = [
      "MediaTitle,Description,MediaType,ResourceURL",
      "Exercise Video 1,Practice at home daily,Video,https://example.com/video.mp4",
      "Breathing Image,Visual guide for exercises,Image,https://example.com/image.jpg",
      "Story Audio,Listen before bed,Audio,https://example.com/audio.mp3",
      "Reading Note,Read this passage out loud,Text,",
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "home-session-template.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const parseCSV = (text) => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    return lines.slice(1).map((line) => {
      const cols = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const row = {};
      headers.forEach((h, i) => { row[h] = cols[i] ?? ""; });
      return row;
    });
  };

  const handleCSVFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBulkRows(parseCSV(ev.target.result || ""));
    reader.readAsText(file);
  };

  const rowIsValid = (r) =>
    r.MediaTitle?.trim() &&
    r.Description?.trim() &&
    VALID_TYPES.includes(r.MediaType?.trim());

  const handleBulkSubmit = async () => {
    const valid = bulkRows.filter(rowIsValid);
    if (!valid.length) { ToastNotification("error", "No valid rows to submit"); return; }
    setBulkSubmitting(true);
    let ok = 0;
    for (const row of valid) {
      try {
        await HomeSessionCreationService({
          PatientID: PatientId,
          ResourceTitle: row.MediaTitle.trim(),
          ResourceDescription: row.Description.trim(),
          ResourceType: row.MediaType.trim(),
          ResourceURL: row.ResourceURL?.trim() || null,
        });
        ok++;
      } catch {}
    }
    await dispatch(listHomeSession(PatientId));
    setBulkSubmitting(false);
    setBulkOpen(false);
    setBulkRows([]);
    if (csvRef.current) csvRef.current.value = "";
    ToastNotification("success", `${ok} of ${valid.length} resources added`);
  };

  return (
    <>
      <div className="d-flex gap-2">
        <Button type="button" onClick={tog_standard} color="primary" className="waves-effect waves-light">
          Add Resource
        </Button>
        <Button
          type="button"
          color="outline-primary"
          className="waves-effect waves-light"
          onClick={() => setBulkOpen(true)}
        >
          <i className="mdi mdi-table-arrow-up me-1"></i>Bulk Add
        </Button>
      </div>

      {/* ── Single Add Modal ── */}
      <Formik
        initialValues={{ MediaTitle: "", Description: "", MediaType: "", Upload: "", LinkURL: "", ThumbnailURL: "" }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ touched, errors, handleSubmit, resetForm, setFieldValue, values }) => (
          <Modal
            isOpen={setModalOpenState}
            toggle={() => setIsAlertOpen(true)}
            scrollable
            className="modal right app_modal width-60"
            onClosed={() => { resetForm(); setSourceMode("upload"); setFileType([]); }}
          >
            {isAlertOpen && (
              <CloseSweetAlert
                onConfirm={() => { setIsAlertOpen(false); tog_standard(); }}
                onClose={() => setIsAlertOpen(false)}
              />
            )}
            <ModalHeader toggle={() => setIsAlertOpen(true)}>Add Resource</ModalHeader>
            <ModalBody>
              {/* Media Type */}
              <div className="mb-4">
                <Label className="form-label required">Media Type</Label>
                <Field
                  component={Select}
                  options={mediaTypeOptions}
                  name="MediaType"
                  placeholder="Select"
                  onChange={(opt) => handleTypeChange(opt, setFieldValue)}
                  styles={{ control: (s) => ({ ...s, borderColor: "#e8eaed", borderRadius: "0.375rem" }) }}
                />
                {errors.MediaType && touched.MediaType && (
                  <ErrorMessage className="text-danger small" name="MediaType" component="div" />
                )}
              </div>

              {/* Title */}
              <div className="mb-4">
                <Label className="form-label required">Media Title</Label>
                <Field type="text" name="MediaTitle" placeholder="Enter Media Title" className="form-control" />
                {errors.MediaTitle && touched.MediaTitle && (
                  <ErrorMessage className="text-danger small" name="MediaTitle" component="div" />
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <Label className="form-label required">Description</Label>
                <Field type="text" name="Description" placeholder="Enter Description" className="form-control" />
                {errors.Description && touched.Description && (
                  <ErrorMessage className="text-danger small" name="Description" component="div" />
                )}
              </div>

              {/* Source — hidden for Text */}
              {values.MediaType && values.MediaType !== "Text" && (
                <div className="mb-4">
                  <Label className="form-label">
                    Media Source <span className="text-muted" style={{ fontSize: 12, fontWeight: 400 }}>(optional)</span>
                  </Label>

                  {/* Upload / Link toggle */}
                  <div className="d-flex gap-2 mb-3">
                    <Button
                      size="sm"
                      color={sourceMode === "upload" ? "primary" : "light"}
                      onClick={() => { setSourceMode("upload"); setFieldValue("LinkURL", ""); }}
                    >
                      <i className="mdi mdi-upload me-1"></i>Upload File
                    </Button>
                    <Button
                      size="sm"
                      color={sourceMode === "link" ? "primary" : "light"}
                      onClick={() => { setSourceMode("link"); setFieldValue("Upload", ""); }}
                    >
                      <i className="mdi mdi-link me-1"></i>Paste Link
                    </Button>
                  </div>

                  {sourceMode === "upload" ? (
                    <>
                      <DropZoneForm
                        multiFiles={false}
                        fileData={uploadMedia}
                        isUploading={imageUploading}
                        accept={fileType}
                        setFieldValue={setFieldValue}
                      />
                      {values.MediaType === "Video" && (
                        <p className="text-muted small mt-1">
                          <i className="mdi mdi-information-outline me-1"></i>Max file size: 50 MB. Supported: MP4, MOV, AVI
                        </p>
                      )}
                      {values.Upload && (
                        <div className="mt-2 text-success small">
                          <i className="mdi mdi-check-circle me-1"></i>File uploaded
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Field
                        type="url"
                        name="LinkURL"
                        placeholder={
                          values.MediaType === "Video"
                            ? "https://example.com/video.mp4"
                            : values.MediaType === "Audio"
                            ? "https://example.com/audio.mp3"
                            : "https://example.com/image.jpg"
                        }
                        className="form-control"
                      />
                      {errors.LinkURL && touched.LinkURL && (
                        <ErrorMessage className="text-danger small" name="LinkURL" component="div" />
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Thumbnail URL — Video only */}
              {values.MediaType === "Video" && (
                <div className="mb-4">
                  <Label className="form-label">
                    Thumbnail URL <span className="text-muted" style={{ fontSize: 12, fontWeight: 400 }}>(optional — shown as video cover)</span>
                  </Label>
                  <Field
                    type="url"
                    name="ThumbnailURL"
                    placeholder="https://example.com/thumbnail.jpg"
                    className="form-control"
                  />
                  {values.ThumbnailURL && (
                    <img
                      src={values.ThumbnailURL}
                      alt="Thumbnail preview"
                      className="mt-2"
                      style={{ height: 64, borderRadius: 6, objectFit: "cover" }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                disabled={imageUploading || loading}
                color="primary"
                className="btn-md waves-effect waves-light action_btn"
                onClick={handleSubmit}
              >
                {loading ? "Submitting…" : "Submit"}
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>

      {/* ── Bulk Add Modal ── */}
      <Modal isOpen={bulkOpen} toggle={() => { setBulkOpen(false); setBulkRows([]); if (csvRef.current) csvRef.current.value = ""; }} size="lg" scrollable>
        <ModalHeader toggle={() => { setBulkOpen(false); setBulkRows([]); if (csvRef.current) csvRef.current.value = ""; }}>
          Bulk Add Resources
        </ModalHeader>
        <ModalBody>
          {/* Step 1 */}
          <div className="mb-4 p-3 border rounded" style={{ background: "#f8f9fa" }}>
            <h6 className="mb-1">Step 1 — Download Template</h6>
            <p className="text-muted small mb-2">
              Fill in: <strong>MediaTitle</strong>, <strong>Description</strong>, <strong>MediaType</strong> (Image / Video / Audio / Text), <strong>ResourceURL</strong> (optional)
            </p>
            <Button color="outline-secondary" size="sm" onClick={downloadTemplate}>
              <i className="mdi mdi-download me-1"></i>Download CSV Template
            </Button>
          </div>

          {/* Step 2 */}
          <div className="mb-4 p-3 border rounded" style={{ background: "#f8f9fa" }}>
            <h6 className="mb-1">Step 2 — Upload Filled CSV</h6>
            <input ref={csvRef} type="file" accept=".csv,text/csv" onChange={handleCSVFile} className="form-control" />
          </div>

          {/* Step 3 — preview */}
          {bulkRows.length > 0 && (
            <div>
              <h6 className="mb-2">
                Step 3 — Preview&nbsp;
                <Badge color="primary">{bulkRows.length} rows</Badge>&nbsp;
                <Badge color="success">{bulkRows.filter(rowIsValid).length} valid</Badge>&nbsp;
                {bulkRows.filter((r) => !rowIsValid(r)).length > 0 && (
                  <Badge color="danger">{bulkRows.filter((r) => !rowIsValid(r)).length} invalid</Badge>
                )}
              </h6>
              <div style={{ maxHeight: 280, overflowY: "auto" }}>
                <Table bordered size="sm" responsive>
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>URL</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkRows.map((row, i) => {
                      const valid = rowIsValid(row);
                      return (
                        <tr key={i} className={valid ? "" : "table-danger"}>
                          <td>{i + 1}</td>
                          <td>{row.MediaTitle || <span className="text-danger">Missing</span>}</td>
                          <td>{row.Description || <span className="text-danger">Missing</span>}</td>
                          <td>
                            {VALID_TYPES.includes(row.MediaType)
                              ? row.MediaType
                              : <span className="text-danger">{row.MediaType || "Missing"}</span>}
                          </td>
                          <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {row.ResourceURL || <span className="text-muted">—</span>}
                          </td>
                          <td>
                            <Badge color={valid ? "success" : "danger"}>{valid ? "Valid" : "Invalid"}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={() => { setBulkOpen(false); setBulkRows([]); if (csvRef.current) csvRef.current.value = ""; }}>
            Cancel
          </Button>
          {bulkRows.filter(rowIsValid).length > 0 && (
            <Button color="primary" disabled={bulkSubmitting} onClick={handleBulkSubmit}>
              {bulkSubmitting
                ? <><Spinner size="sm" className="me-1" />Submitting…</>
                : `Submit ${bulkRows.filter(rowIsValid).length} Resource${bulkRows.filter(rowIsValid).length > 1 ? "s" : ""}`}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </>
  );
}
export default AddMedia;
