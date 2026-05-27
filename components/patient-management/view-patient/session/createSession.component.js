import { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Row, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { ContentMappingList, createPatientSession, patientIsLoading, selectContentMapping } from "../../../../store/slice/patient.slice";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { useRouter } from "next/router";
import moment from "moment";


const CreateSession = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(ContentMappingList())
  }, [dispatch]);
  const LIstData = useSelector(selectContentMapping)

  let values = LIstData?.length ? LIstData?.filter((e) => e.ContentCategory == "Text") : undefined;
  let CCvalues = values?.filter((e) => e.ContentDescription != null);

  let values1 = LIstData?.length ? LIstData?.filter((e) => e.ContentCategory === "Video" || e.ContentCategory === "Image" || e.ContentCategory === "Audio") : undefined;
  let UrlValues = values1?.filter((e) => e.FileUploadURL != null);

  let values2 = LIstData?.length ? LIstData?.filter((e) => e.ContentCategory === "AR" || e.ContentCategory === "VR") : undefined;
  let result = CCvalues?.concat(UrlValues);
  result = result?.concat(values2);

  const list = result?.map((e) => ({ label: e.ContentActivityName, value: e.ContentID }))
  const [contentList, setContentList] = useState(list)
  const [dob, setDob] = useState("");
  const router = useRouter();
  const { PatientId } = router.query;
  const loading = useSelector(patientIsLoading);

  const validationSchema = Yup.object().shape({
    SessionName: Yup.string().max(200, "Too Long!").required("Please enter Session Name"),
    SessionDate: Yup.string().required("Please enter Session Date"),
    SessionType: Yup.string().required("Please enter Media Type"),
    ContentType: Yup.string().required("Please Select The Content Type")
  })
  const [selectedBillingState, setSelectedBillState] = useState([]);

  function createFormatDate(date) {
    return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
  }

  const onSubmit = async (values, { resetForm }) => {
    const data = {
      "ContentID": values.SessionType,
      "SessionName": values.SessionName,
      "SessionDate": createFormatDate(values.SessionDate),
      "ScenarioName": values.Scenario ? values.Scenario : undefined,
    }
    const valueToSend = {
      data,
      PatientId,
      setModalOpen,
      resetForm,
      setSelectedBillState,
      setDob
    }
    dispatch(createPatientSession(valueToSend));
  };

  const Scene_supermarket = [
    { label: "ballpicking", value: "Scene_ballpicking" },
    { label: "findmyspot", value: "Scene_findmyspot" },
    { label: "fruitpick", value: "Scene_fruitpick" },
    { label: "balltarget", value: "Scene_balltarget" },
    { label: "roadcrossing", value: "Scene_roadcrossing" },
    { label: "coloridentification", value: "Scene_coloridentification" },
    { label: "roadcrossingteach", value: "Scene_roadcrossingteach" },
    { label: "restroomindian", value: "Scene_restroomindian" },
    { label: "restroomeuropean", value: "Scene_restroomeuropean" },
    { label: "vibgyor", value: "Scene_vibgyor" },
    { label: "colorchoose", value: "Scene_colorchoose" },
    { label: "objectidentification", value: "Scene_objectidentification" },
    { label: "painting", value: "Scene_painting" },
    { label: "alphabet", value: "Scene_alphabet" },
    { label: "fruitveggrouping", value: "Scene_fruitveggrouping" },
    { label: "geometricshape", value: "Scene_geometricshape" },
    { label: "salon", value: "Scene_salon" },
    { label: "animalecosystem", value: "Scene_animalecosystem" }
  ]



  const ContentTypeoptions = [
    { value: "VR", label: "VR" },
    { value: "Video", label: "Video" },
    { value: "Audio", label: "Audio" },
    { value: "Text", label: "Text" },
    { value: "Image", label: "Image" },
  ];

  const selectStyles = {
    control: (styles) => ({ ...styles, borderColor: " #e8eaed;" }),
  };

  const ContentList = (ContentType) => {
    const data = result?.filter((e) => e.ContentCategory === ContentType)
    const list = data?.map((e) => ({ label: e.ContentActivityName, value: e.ContentID }))
    setContentList(list)
  }

  return (
    <>
      <Button type='button' color='primary' className='btn-md waves-effect waves-light action_btn' onClick={toggleModal}>
        Create Session
      </Button>
      <Formik initialValues={{
        SessionName: "",
        SessionDate: "",
        SessionType: "",
        ContentType: "",
        Scenario: ""
      }} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
        {({ touched, errors, handleSubmit, resetForm, isSubmitting, setFieldValue, values }) => (
          <Modal isOpen={modalOpen} toggle={toggleModal} className='modal right session app_modal' tabIndex='-1' role='dialog' scrollable={true}>
            <ModalHeader toggle={() => {
              setModalOpen(false);
            }}>
              Create Session
            </ModalHeader>
            <ModalBody>
              <Row>
                <Col md={12}>
                  <div className='mb-4'>
                    <Label className='form-label required'>Session Name</Label>
                    <Field type='text' name="SessionName" className='form-control' placeholder='Enter session name' />
                    {errors.SessionName && touched.SessionName ? <ErrorMessage className='text-danger small' name='SessionName' component='div' /> : null}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <div className='mb-4'>
                    <Label className='form-label required'>Session Date</Label>
                    <Field
                      component={Flatpickr}
                      className='form-control'
                      name='DOB'
                      placeholder='Session Date'
                      value={dob}
                      onChange={(res) => {
                        const date = moment(new Date(res[0])).locale("en-in").format("YYYY-MM-DD")
                        setDob(date);
                        setFieldValue("SessionDate", date);
                      }}
                      options={{
                        altInput: true,
                        altFormat: "j M, Y",
                        dateFormat: "Y-m-d",
                      }}
                    />
                    {errors.SessionDate && touched.SessionDate ? <ErrorMessage className='text-danger small' name='SessionDate' component='div' /> : null}
                  </div>
                </Col>
                <Col md={12}>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='Content-Type'>
                      Content Category
                    </Label>
                    <Field
                      component={Select}
                      id='Content-Type'
                      name='ContentType'
                      options={ContentTypeoptions}
                      placeholder='Select'
                      // className="form-control"
                      className='basic-multi-select'
                      classNamePrefix='form-control'
                      onChange={(content) => {
                        setFieldValue("ContentType", content.value);
                        ContentList(content.value)
                      }}
                      styles={selectStyles}
                    />
                    {errors.ContentType && touched.ContentType ? <ErrorMessage className='text-danger small' name='ContentType' component='div' /> : null}
                  </div>
                </Col>
                <Col md={12}>
                  <div className='mb-4'>
                    <Label className='form-label required'>Content</Label>
                    <Field
                      component={Select}
                      name="SessionType"
                      options={contentList}
                      value={selectedBillingState}
                      placeholder='Content'
                      onChange={(e) => {
                        setFieldValue("SessionType", e.value);
                        setSelectedBillState(e);
                      }} />
                    {errors.SessionType && touched.SessionType ? <ErrorMessage className='text-danger small' name='SessionType' component='div' /> : null}
                  </div>
                </Col>
                {values.ContentType === "VR" && <Col md={12}>
                  <div className="mb-4">
                    <label className="form-label">Choose Scenario</label>
                    <Field
                      component={Select}
                      name="Scenario"
                      options={Scene_supermarket}
                      placeholder='Scenario'
                      styles={selectStyles}
                      onChange={(content) => {
                        setFieldValue("Scenario", content.value);
                      }}
                    />
                  </div>
                </Col>}
              </Row>
              <Row>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button type='button' className='btn btn-md waves-effect waves-light action_btn' color='light' onClick={toggleModal}>
                Cancel
              </Button>
              <Button className='btn btn-md waves-effect waves-light action_btn' type='submit' disabled={loading} onClick={handleSubmit} color='primary'>
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
