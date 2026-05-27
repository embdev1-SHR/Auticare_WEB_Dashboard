import "flatpickr/dist/flatpickr.css";
import { ErrorMessage, Field, Formik } from "formik";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Button, Col, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import * as Yup from "yup";
import { getGoalsByTherapy, selectTherapyGoalList } from "../../../../store/slice/goal.slice";
import { createPlan, GoalsData, patientIsLoading } from "../../../../store/slice/patient.slice";
import { getAllTherapies, selectTherapiesList } from "../../../../store/slice/therapies.slice";
import GoalsLibrary from "./goalsLibrary.component";


const contentSchema = Yup.object().shape({
  planName: Yup.string().max(200, "Too Long!").required("plan Name is required"),
  FromDate: Yup.date().required("From Date is required"),
  ToDate: Yup.date().required("To Date is required")
    .when(
      "FromDate",
      (FromDate, schema) => FromDate && schema.min(FromDate, 'To Date must be after From Date')),
});



const CreatePlan = () => {
  const dispatch = useDispatch();
  const TherapyList = useSelector(selectTherapiesList);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTherapy, setSelectedTherapy] = useState(null);
  const [therapyOptions, setTherapyOptions] = useState([]);
  const TherapyGoals = useSelector(selectTherapyGoalList);
  const [fromDate, setFromDate] = useState("");
  const [ToDate, setToDate] = useState("");
  const router = useRouter();
  const { PatientId } = router.query;
  const [GoalID, setGoalID] = useState([""]);


  const data = useSelector(GoalsData);
  const loading = useSelector(patientIsLoading);
  // data.filter((comment) => comment.Status == 1)

  useEffect(() => {
    let Goals = data.map((e) => e.GoalID)
    setGoalID(Goals)
    dispatch(getAllTherapies());
  }, [dispatch, data]);

  useEffect(() => {
    const option = [];
    TherapyList.map((therapy) => {
      option.push({ label: therapy.TherapyName, value: therapy.TherapyID });
    });
    setTherapyOptions(option);
  }, [TherapyList]);

  const handleMulti = (selectedMulti, setFieldValue) => {
    // setSelectedTherapy(selectedMulti);
    setSelectedTherapy(selectedMulti.map((ele) => ele));
    setFieldValue(
      "TherapyID",
      selectedMulti.map((ele) => ele.value)
      // selectedMulti.value
    );
  };
  useEffect(() => {
    selectedTherapy && selectedTherapy.map((therapy) => dispatch(getGoalsByTherapy({ TherapyID: therapy.value })));
  }, [selectedTherapy, dispatch]);

  const tog_standard = () => {
    setModalOpen(!modalOpen);
  };

  const TherapyInitialValues = {
    TherapyID: "",
    planName: "",
    FromDate: "",
    ToDate: ""
  };

  function createFormatDate(date) {
    return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
  }


  const onSubmit = (values, { resetForm }) => {
    const data = {
      "PlanName": values.planName,
      "StartDate": createFormatDate(values.FromDate),
      "EndDate": createFormatDate(values.ToDate),
      "PlanGoals": GoalID
    }

    const valueTOSend = {
      PatientId,
      data
    }
    dispatch(createPlan(valueTOSend));
    resetForm();
    setSelectedTherapy(null);
    setToDate("");
    setFromDate("");
  };
  return (
    <>
      <Button type='button' onClick={tog_standard} color='primary' className='waves-effect waves-light mb-4'>
        Create Plan
      </Button>
      <Formik initialValues={TherapyInitialValues} validationSchema={contentSchema}
        onSubmit={onSubmit}>
        {({ touched, errors, handleSubmit, resetForm, isSubmitting, setFieldValue }) => (
          <Modal isOpen={modalOpen} toggle={tog_standard} scrollable={true} className='modal right app_modal'>
            <ModalHeader toggle={() => setModalOpen(!modalOpen)}>Create Plan</ModalHeader>
            <ModalBody>
              <Row>
                <Col lg='6'>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='plan-name'>
                      Plan Name
                    </Label>
                    <Field type='text' name='planName'
                      className='form-control' id='plan-name' placeholder='Enter plan name' />
                    {errors.planName && touched.planName ? <ErrorMessage className='text-danger small' name='planName' component='div' /> : null}
                  </div>
                </Col>
                <Col lg='6'>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='accreditation'>
                      Plan Duration
                    </Label>
                    <Row>
                      <Col lg='6'>
                        <Field
                          component={Flatpickr}
                          className='form-control'
                          placeholder='from'
                          name="FromDate"
                          value={fromDate}
                          onChange={(res) => {
                            setFromDate(res[0].toISOString());
                            setFieldValue("FromDate", res[0].toISOString().slice(0, 10));
                          }}
                          options={{
                            altInput: true,
                            altFormat: "j M, Y",
                            dateFormat: "d.m.Y",
                          }}
                        />
                        {errors.FromDate && touched.FromDate ? <ErrorMessage className='text-danger small' name='FromDate' component='div' /> : null}

                      </Col>
                      <Col lg='6'>
                        <Field
                          component={Flatpickr}
                          className='form-control'
                          name="ToDate"
                          placeholder='to'
                          value={ToDate}
                          onChange={(res) => {
                            setToDate(res[0].toISOString());
                            setFieldValue("ToDate", res[0].toISOString().slice(0, 10));
                          }}
                          options={{
                            altInput: true,
                            altFormat: "j M, Y",
                            dateFormat: "d.m.Y",
                          }}
                        />
                        {errors.ToDate && touched.ToDate ? <ErrorMessage className='text-danger small' name='ToDate' component='div' /> : null}

                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <div className='mb-4'>
                <Label className='form-label required' htmlFor='plan-name'>
                  Type of Therapy
                </Label>
                <Field
                  component={Select}
                  name='TherapyID'
                  value={selectedTherapy}
                  isMulti={true}
                  onChange={(selectedMulti) => handleMulti(selectedMulti, setFieldValue)}
                  options={therapyOptions}
                  classNamePrefix='select2-selection'
                />
                {errors.TherapyID && touched.TherapyID ? <ErrorMessage className='text-danger small' name='TherapyID' component='div' /> : null}

              </div>
              <Row>
                <div className='mb-4'>
                  <GoalsLibrary TherapyGoals={TherapyGoals} />
                </div>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button
                type='submit'
                color='primary'
                className='m-1 waves-effect waves-light action_btn'
                onClick={handleSubmit}
                disabled={!GoalID.length || loading}
              >
                Create Plan
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default CreatePlan;
