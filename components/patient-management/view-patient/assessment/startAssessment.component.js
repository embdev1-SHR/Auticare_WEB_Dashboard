import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { createPatientMetrics, patientIsLoading } from "../../../../store/slice/patient.slice";
import { Button, Modal, ModalFooter, ModalHeader, ModalBody } from "reactstrap";
import { fetchAllScales, selectScaleIsLoading, selectScaleList } from "../../../../store/slice/scale.slice";
import moment from "moment";

const StartAssessment = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { PatientId } = router.query;
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const AssessmentList = useSelector(selectScaleList);
  const ScalesLoading = useSelector(selectScaleIsLoading);
  const [assessmentOptions, setAssessmentOptions] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState("");
  const button = useSelector(patientIsLoading);

  useEffect(() => {
    const option = [];
    AssessmentList?.filter((el) => el.ScaleMetric === "Assessment").map((scale) => {
      option.push({ label: scale.ScaleName, value: scale.ScaleID,type:scale.ScaleMetricType, Status:scale.Status});
    });
    const ScaleStatus = option?.filter(
      (e) => e.Status == 1
    );
    setAssessmentOptions(ScaleStatus);
  }, [AssessmentList]);

  useEffect(() => {
    dispatch(fetchAllScales());
  }, [dispatch]);

  const initialValues = {
    ScaleID: "",
  };
  const validationSchema = Yup.object().shape({
    ScaleID: Yup.string().required("Please select a assessment"),
  });
  const onHandleSubmit = (values) => {
    dispatch(
      createPatientMetrics({
        PatientId,
        body: {
          ScaleID: values.ScaleID,
          ScaleMetricType:values.ScaleMetricType,
          ScheduleStartDate: moment(new Date()).locale("en-in").format("MM/DD/YYYY"),
        },
      })
    )
  };

  return (
    <>
      <div className='tab_actions'>
        <Button className='btn btn-md waves-effect waves-light action_btn' color='primary' data-toggle='modal' data-target='.start_assessment_modal' onClick={toggleModal}>
          Start Assessment
        </Button>
      </div>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onHandleSubmit} enableReinitialize={true}>
        {({ touched, errors, handleSubmit, resetForm, isSubmitting, setFieldValue }) => (
          <Modal className='start_assessment_modal app_modal' tabIndex='-1' role='dialog' aria-hidden='true' isOpen={modalOpen} toggle={toggleModal} centered={true}>
            <ModalHeader toggle={toggleModal}>Start Assessment</ModalHeader>
            <ModalBody className='pt-1'>
              <div className='mb-4'>
                <label className='form-label required'>Choose Type</label>
                <Field
                  component={Select}
                  name='ScaleID'
                  id='Assessments'
                  isLoading={ScalesLoading}
                  value={selectedAssessment}
                  onChange={(SelectedVal) => {
                    setSelectedAssessment(SelectedVal);
                    setFieldValue("ScaleID", SelectedVal.value);
                    setFieldValue("ScaleMetricType", SelectedVal.type);
                  }}
                  options={assessmentOptions}
                />
                {errors.ScaleID && touched.ScaleID ? <ErrorMessage className='text-danger small' name='ScaleID' component='div' /> : null}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type='button' color='light' className='btn btn-md waves-effect waves-light action_btn' onClick={toggleModal}>
                Cancel
              </Button>
              <Button className=' waves-effect waves-light action_btn' color='primary' disabled={button} onClick={handleSubmit}>
                Continue
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default StartAssessment;
