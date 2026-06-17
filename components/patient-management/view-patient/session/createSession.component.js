import { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Row, Col, Collapse, FormGroup, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { ContentMappingList, createPatientSession, patientIsLoading, selectContentMapping } from "../../../../store/slice/patient.slice";
import { createContent, contentIsLoading as selectContentCreating } from "../../../../store/slice/content.slice";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { useRouter } from "next/router";
import moment from "moment";
import Image from "next/image";

const CreateSession = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [addContentOpen, setAddContentOpen] = useState(false);
  const [addingContent, setAddingContent] = useState(false);
  const [newContent, setNewContent] = useState({
    ContentActivityName: "",
    FileUploadURL: "",
    ThumbnailURL: "",
    Duration: "",
    ContentDescription: "",
  });
  const [newContentErrors, setNewContentErrors] = useState({});

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    setAddContentOpen(false);
    setNewContent({ ContentActivityName: "", FileUploadURL: "", ThumbnailURL: "", Duration: "", ContentDescription: "" });
    setNewContentErrors({});
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ContentMappingList());
  }, [dispatch]);

  const LIstData = useSelector(selectContentMapping);
  const isContentCreating = useSelector(selectContentCreating);

  let values = LIstData?.length ? LIstData?.filter((e) => e.ContentCategory == "Text") : undefined;
  let CCvalues = values?.filter((e) => e.ContentDescription != null);
  let values1 = LIstData?.length ? LIstData?.filter((e) => e.ContentCategory === "Video" || e.ContentCategory === "Image" || e.ContentCategory === "Audio") : undefined;
  let UrlValues = values1?.filter((e) => e.FileUploadURL != null);
  let values2 = LIstData?.length ? LIstData?.filter((e) => e.ContentCategory === "AR" || e.ContentCategory === "VR") : undefined;
  let result = CCvalues?.concat(UrlValues);
  result = result?.concat(values2);

  const buildContentList = (ContentType) => {
    const data = result?.filter((e) => e.ContentCategory === ContentType) || [];
    return data.map((e) => ({
      label: e.ContentActivityName,
      value: e.ContentID,
      thumbnail: e.ActivityInstructionTitle || null,
      duration: e.ActivityInstructionDescription || null,
      videoUrl: e.FileUploadURL || null,
    }));
  };

  const [contentList, setContentList] = useState([]);
  const [dob, setDob] = useState("");
  const [selectedContentType, setSelectedContentType] = useState("");
  const [selectedBillingState, setSelectedBillingState] = useState([]);
  const router = useRouter();
  const { PatientId } = router.query;
  const loading = useSelector(patientIsLoading);

  const validationSchema = Yup.object().shape({
    SessionName: Yup.string().max(200, "Too Long!").required("Please enter Session Name"),
    SessionDate: Yup.string().required("Please enter Session Date"),
    SessionType: Yup.string().required("Please Select The Content Type"),
    ContentType: Yup.string().required("Please Select The Content Category"),
  });

  function createFormatDate(date) {
    return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
  }

  const onSubmit = async (values, { resetForm }) => {
    const data = {
      ContentID: values.SessionType,
      SessionName: values.SessionName,
      SessionDate: createFormatDate(values.SessionDate),
      ScenarioName: values.Scenario ? values.Scenario : undefined,
    };
    dispatch(createPatientSession({ data, PatientId, setModalOpen, resetForm, setSelectedBillState: setSelectedBillingState, setDob }));
  };

  const Scene_supermarket = [
    { label: "Ball Picking", value: "Scene_ballpicking" },
    { label: "Find My Spot", value: "Scene_findmyspot" },
    { label: "Fruit Pick", value: "Scene_fruitpick" },
    { label: "Ball Target", value: "Scene_balltarget" },
    { label: "Road Crossing", value: "Scene_roadcrossing" },
    { label: "Color Identification", value: "Scene_coloridentification" },
    { label: "Road Crossing Teach", value: "Scene_roadcrossingteach" },
    { label: "Restroom Indian", value: "Scene_restroomindian" },
    { label: "Restroom European", value: "Scene_restroomeuropean" },
    { label: "Vibgyor", value: "Scene_vibgyor" },
    { label: "Color Choose", value: "Scene_colorchoose" },
    { label: "Object Identification", value: "Scene_objectidentification" },
    { label: "Painting", value: "Scene_painting" },
    { label: "Alphabet", value: "Scene_alphabet" },
    { label: "Fruit/Veg Grouping", value: "Scene_fruitveggrouping" },
    { label: "Geometric Shape", value: "Scene_geometricshape" },
    { label: "Salon", value: "Scene_salon" },
    { label: "Animal Ecosystem", value: "Scene_animalecosystem" },
  ];

  const ContentTypeoptions = [
    { value: "VR", label: "VR" },
    { value: "Video", label: "Video" },
    { value: "Audio", label: "Audio" },
    { value: "Text", label: "Text" },
    { value: "Image", label: "Image" },
  ];

  const selectStyles = {
    control: (styles) => ({ ...styles, borderColor: "#e8eaed" }),
  };

  // Custom option renderer for VR content — shows thumbnail + duration
  const formatVROption = (option) => (
    <div className="d-flex align-items-center gap-2">
      {option.thumbnail ? (
        <img
          src={option.thumbnail}
          alt=""
          style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 4, flexShrink: 0 }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      ) : (
        <div style={{ width: 48, height: 36, background: "#e9ecef", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <i className="mdi mdi-video text-muted"></i>
        </div>
      )}
      <div>
        <div style={{ fontWeight: 500, fontSize: 13 }}>{option.label}</div>
        {option.duration && <div className="text-muted" style={{ fontSize: 11 }}><i className="mdi mdi-clock-outline me-1"></i>{option.duration}</div>}
      </div>
    </div>
  );

  const validateNewContent = () => {
    const errs = {};
    if (!newContent.ContentActivityName.trim()) errs.ContentActivityName = "Content name is required";
    if (!newContent.FileUploadURL.trim()) errs.FileUploadURL = "Video URL is required";
    return errs;
  };

  const handleAddContent = async (setFieldValue) => {
    const errs = validateNewContent();
    if (Object.keys(errs).length) { setNewContentErrors(errs); return; }
    setAddingContent(true);
    try {
      const result = await dispatch(createContent({
        ContentActivityName: newContent.ContentActivityName.trim(),
        ContentActivityDescription: newContent.ContentDescription.trim() || null,
        ContentCategory: "VR",
        ContentType: "Custom",
        FileUploadURL: newContent.FileUploadURL.trim(),
        ThumbnailURL: newContent.ThumbnailURL.trim() || null,
        Duration: newContent.Duration.trim() || null,
        ContentDescription: newContent.ContentDescription.trim() || null,
      }));

      if (result.meta.requestStatus === "fulfilled") {
        // Re-fetch mapping and find the new content
        const res = await dispatch(ContentMappingList());
        const freshData = res.payload || [];
        const vrList = freshData
          .filter((e) => e.ContentCategory === "VR")
          .map((e) => ({
            label: e.ContentActivityName,
            value: e.ContentID,
            thumbnail: e.ActivityInstructionTitle || null,
            duration: e.ActivityInstructionDescription || null,
            videoUrl: e.FileUploadURL || null,
          }));
        setContentList(vrList);

        // auto-select the newest item (highest ContentID)
        if (vrList.length > 0) {
          const newest = vrList.reduce((a, b) => (a.value > b.value ? a : b));
          setSelectedBillingState(newest);
          setFieldValue("SessionType", newest.value);
        }

        setAddContentOpen(false);
        setNewContent({ ContentActivityName: "", FileUploadURL: "", ThumbnailURL: "", Duration: "", ContentDescription: "" });
        setNewContentErrors({});
      }
    } finally {
      setAddingContent(false);
    }
  };

  return (
    <>
      <Button type="button" color="primary" className="btn-md waves-effect waves-light action_btn" onClick={toggleModal}>
        Create Session
      </Button>
      <Formik
        initialValues={{ SessionName: "", SessionDate: "", SessionType: "", ContentType: "", Scenario: "" }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {({ touched, errors, handleSubmit, resetForm, setFieldValue, values }) => (
          <Modal isOpen={modalOpen} toggle={toggleModal} className="modal right session app_modal" tabIndex="-1" role="dialog" scrollable={true}>
            <ModalHeader toggle={() => setModalOpen(false)}>Create Session</ModalHeader>
            <ModalBody>
              <Row>
                <Col md={12}>
                  <div className="mb-4">
                    <Label className="form-label required">Session Name</Label>
                    <Field type="text" name="SessionName" className="form-control" placeholder="Enter session name" />
                    {errors.SessionName && touched.SessionName && <ErrorMessage className="text-danger small" name="SessionName" component="div" />}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <div className="mb-4">
                    <Label className="form-label required">Session Date</Label>
                    <Field
                      component={Flatpickr}
                      className="form-control"
                      name="DOB"
                      placeholder="Session Date"
                      value={dob}
                      onChange={(res) => {
                        const date = moment(new Date(res[0])).locale("en-in").format("YYYY-MM-DD");
                        setDob(date);
                        setFieldValue("SessionDate", date);
                      }}
                      options={{ altInput: true, altFormat: "j M, Y", dateFormat: "Y-m-d" }}
                    />
                    {errors.SessionDate && touched.SessionDate && <ErrorMessage className="text-danger small" name="SessionDate" component="div" />}
                  </div>
                </Col>

                <Col md={12}>
                  <div className="mb-4">
                    <Label className="form-label required">Content Category</Label>
                    <Field
                      component={Select}
                      id="Content-Type"
                      name="ContentType"
                      options={ContentTypeoptions}
                      placeholder="Select"
                      onChange={(content) => {
                        setFieldValue("ContentType", content.value);
                        setSelectedContentType(content.value);
                        setContentList(buildContentList(content.value));
                        setSelectedBillingState([]);
                        setFieldValue("SessionType", "");
                        setAddContentOpen(false);
                      }}
                      styles={selectStyles}
                    />
                    {errors.ContentType && touched.ContentType && <ErrorMessage className="text-danger small" name="ContentType" component="div" />}
                  </div>
                </Col>

                <Col md={12}>
                  <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <Label className="form-label required mb-0">Content</Label>
                      {selectedContentType === "VR" && (
                        <Button
                          size="sm"
                          color={addContentOpen ? "light" : "outline-primary"}
                          onClick={() => setAddContentOpen(!addContentOpen)}
                          style={{ fontSize: 12 }}
                        >
                          {addContentOpen ? "Cancel" : <><i className="mdi mdi-plus me-1"></i>Add VR Content</>}
                        </Button>
                      )}
                    </div>

                    {selectedContentType === "VR" ? (
                      <Select
                        name="SessionType"
                        options={contentList}
                        value={selectedBillingState?.value ? selectedBillingState : null}
                        placeholder={contentList.length === 0 ? "No VR content yet — add one below" : "Select VR content"}
                        formatOptionLabel={formatVROption}
                        onChange={(e) => {
                          setFieldValue("SessionType", e.value);
                          setSelectedBillingState(e);
                        }}
                        styles={selectStyles}
                      />
                    ) : (
                      <Select
                        name="SessionType"
                        options={contentList}
                        value={selectedBillingState?.value ? selectedBillingState : null}
                        placeholder="Select content"
                        onChange={(e) => {
                          setFieldValue("SessionType", e.value);
                          setSelectedBillingState(e);
                        }}
                        styles={selectStyles}
                      />
                    )}
                    {errors.SessionType && touched.SessionType && <ErrorMessage className="text-danger small" name="SessionType" component="div" />}

                    {/* Preview selected VR content */}
                    {selectedContentType === "VR" && selectedBillingState?.value && (
                      <div className="mt-2 p-2 border rounded bg-light d-flex gap-3 align-items-center">
                        {selectedBillingState.thumbnail && (
                          <img
                            src={selectedBillingState.thumbnail}
                            alt="thumbnail"
                            style={{ width: 80, height: 55, objectFit: "cover", borderRadius: 6 }}
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{selectedBillingState.label}</div>
                          {selectedBillingState.duration && (
                            <div className="text-muted" style={{ fontSize: 12 }}>
                              <i className="mdi mdi-clock-outline me-1"></i>{selectedBillingState.duration}
                            </div>
                          )}
                          {selectedBillingState.videoUrl && (
                            <a href={selectedBillingState.videoUrl} target="_blank" rel="noreferrer" className="text-primary" style={{ fontSize: 12 }}>
                              <i className="mdi mdi-play-circle me-1"></i>Preview video
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Col>

                {/* Add VR Content inline form */}
                {selectedContentType === "VR" && (
                  <Col md={12}>
                    <Collapse isOpen={addContentOpen}>
                      <div className="border rounded p-3 mb-3" style={{ background: "#f8f9fa" }}>
                        <h6 className="mb-3">Add New VR Content</h6>
                        <FormGroup>
                          <Label className="form-label required">Content Name</Label>
                          <Input
                            type="text"
                            placeholder="e.g. Ball Picking Exercise 1"
                            value={newContent.ContentActivityName}
                            onChange={(e) => setNewContent((p) => ({ ...p, ContentActivityName: e.target.value }))}
                            invalid={!!newContentErrors.ContentActivityName}
                          />
                          {newContentErrors.ContentActivityName && <div className="text-danger small">{newContentErrors.ContentActivityName}</div>}
                        </FormGroup>
                        <FormGroup>
                          <Label className="form-label required">Video URL</Label>
                          <Input
                            type="url"
                            placeholder="https://example.com/video.mp4"
                            value={newContent.FileUploadURL}
                            onChange={(e) => setNewContent((p) => ({ ...p, FileUploadURL: e.target.value }))}
                            invalid={!!newContentErrors.FileUploadURL}
                          />
                          {newContentErrors.FileUploadURL && <div className="text-danger small">{newContentErrors.FileUploadURL}</div>}
                        </FormGroup>
                        <Row>
                          <Col md={8}>
                            <FormGroup>
                              <Label className="form-label">Thumbnail URL</Label>
                              <Input
                                type="url"
                                placeholder="https://example.com/thumb.jpg"
                                value={newContent.ThumbnailURL}
                                onChange={(e) => setNewContent((p) => ({ ...p, ThumbnailURL: e.target.value }))}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <Label className="form-label">Duration</Label>
                              <Input
                                type="text"
                                placeholder="e.g. 10 min"
                                value={newContent.Duration}
                                onChange={(e) => setNewContent((p) => ({ ...p, Duration: e.target.value }))}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        {newContent.ThumbnailURL && (
                          <div className="mb-3">
                            <img
                              src={newContent.ThumbnailURL}
                              alt="preview"
                              style={{ height: 60, borderRadius: 6, objectFit: "cover" }}
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          </div>
                        )}
                        <FormGroup>
                          <Label className="form-label">Description</Label>
                          <Input
                            type="textarea"
                            rows={2}
                            placeholder="Brief description of this VR content"
                            value={newContent.ContentDescription}
                            onChange={(e) => setNewContent((p) => ({ ...p, ContentDescription: e.target.value }))}
                          />
                        </FormGroup>
                        <Button
                          color="primary"
                          size="sm"
                          disabled={addingContent || isContentCreating}
                          onClick={() => handleAddContent(setFieldValue)}
                        >
                          {addingContent || isContentCreating ? "Saving..." : "Save VR Content"}
                        </Button>
                      </div>
                    </Collapse>
                  </Col>
                )}

                {/* VR Scenario selector */}
                {values.ContentType === "VR" && (
                  <Col md={12}>
                    <div className="mb-4">
                      <Label className="form-label">Choose Scenario</Label>
                      <Field
                        component={Select}
                        name="Scenario"
                        options={Scene_supermarket}
                        placeholder="Select scenario (optional)"
                        styles={selectStyles}
                        onChange={(content) => setFieldValue("Scenario", content.value)}
                      />
                    </div>
                  </Col>
                )}
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button type="button" className="btn btn-md waves-effect waves-light action_btn" color="light" onClick={toggleModal}>
                Cancel
              </Button>
              <Button className="btn btn-md waves-effect waves-light action_btn" type="submit" disabled={loading} onClick={handleSubmit} color="primary">
                Create Session
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default CreateSession;
