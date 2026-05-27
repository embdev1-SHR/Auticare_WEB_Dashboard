import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { Button, Modal, ModalFooter, ModalHeader, ModalBody } from "reactstrap";
import { fetchAllScales, selectScaleIsLoading, selectScaleList } from "../../../../store/slice/scale.slice";
import { createPatientMetrics, patientIsLoading } from "../../../../store/slice/patient.slice";
import moment from "moment";
const StartScreening = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { PatientId } = router.query;
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const button = useSelector(patientIsLoading);
  const ScalesList = useSelector(selectScaleList);
  const ScalesLoading = useSelector(selectScaleIsLoading);
  const [scaleOptions, setScaleOptions] = useState([]);
  const [selectedScale, setSelectedScale] = useState("");

  useEffect(() => {  
    const option = [];
    ScalesList?.filter((el) => el.ScaleMetric === "Screening").map((scale) => {
      option.push({ label: scale.ScaleName, value: scale.ScaleID, type:scale.ScaleMetricType, Status:scale.Status });
    });
    const ScaleStatus = option?.filter(
      (e) => e.Status == 1
    );

    setScaleOptions(ScaleStatus);
  }, [ScalesList]);

  useEffect(() => {
    dispatch(fetchAllScales());
  }, [dispatch]);

  const initialValues = {
    ScaleID: "",
  };
  const validationSchema = Yup.object().shape({
    ScaleID: Yup.string().required("Please select a Scale"),
  });
  const onHandleSubmit = (values) => {
    dispatch(
      createPatientMetrics({
        PatientId,
        body: {
          ScaleID: values.ScaleID,
          ScaleMetricType: values.ScaleMetricType,
          ScheduleStartDate: moment(new Date())
            .locale("en-in")
            .format("MM/DD/YYYY"),
        },
      })
    );
  };

  return (
    <>
      <Button type='button' className='btn-md waves-effect waves-light action_btn' color='primary' data-toggle='modal' data-target='start_screening_modal' onClick={toggleModal}>
        Start Screening
      </Button>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onHandleSubmit} enableReinitialize={true}>
        {({ touched, errors, handleSubmit, resetForm, isSubmitting, setFieldValue }) => (
          <Modal className='start_screening_modal app_modal' tabIndex='-1' role='dialog' aria-hidden='true' isOpen={modalOpen} toggle={toggleModal} centered={true}>
            <ModalHeader toggle={toggleModal}>Start Screening</ModalHeader>
            <ModalBody>
              <div className='mb-4'>
                <label className='form-label required'>Choose Scale</label>
                <Field
                  component={Select}
                  name='ScaleID'
                  id='Scales'
                  isLoading={ScalesLoading}
                  value={selectedScale}
                  onChange={(SelectedVal) => {
                    setSelectedScale(SelectedVal);
                    setFieldValue("ScaleID", SelectedVal.value);
                    setFieldValue("ScaleMetricType", SelectedVal.type);
                  }}
                  options={scaleOptions}
                />
                {errors.ScaleID && touched.ScaleID ? <ErrorMessage className='text-danger small' name='ScaleID' component='div' /> : null}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type='button' color='light' className='btn-md waves-effect waves-light action_btn' onClick={toggleModal}>
                Cancel
              </Button>

              <Button color='primary' disabled={button} className='waves-effect waves-light action_btn' onClick={handleSubmit}>
                <a>Continue</a>
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default StartScreening;
