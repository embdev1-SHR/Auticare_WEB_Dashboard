import { ErrorMessage, Field, Formik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import * as Yup from "yup";
import { selectSetModalOpenState, setModalOpen } from "../../store/slice/layout.slice";
import { SubscriptionPlans, selectIsLoading } from "../../store/slice/subscription.slice";
import CloseSweetAlert from "../shared/close-sweetalert";

const CreateSubscriptionPlan = () => {
  const dispatch = useDispatch();
  const setModalOpenState = useSelector(selectSetModalOpenState);
  const loading = useSelector(selectIsLoading);

  const tog_standard = () => {
    dispatch(setModalOpen(!setModalOpenState));
  };

  const initials = {
    PlanName: "",
    Contents: "",
    NumberOfPlanActiveDays: "",
    Frequency: "",
    NumberofTherapists: "",
    NumberofPatients: "",
    NumberofCustomScales: "",
    NumberofCustomSkills: "",
    NumberofCustomAssessment: "0",
    NumberofCustomContents: "",
    Price: "",
    OnetimeFee: "",
    PlanType: "",
  };

  const validationSchema = Yup.object().shape({
    PlanName: Yup.string().max(100, "Too Long!").required("Please enter plan name"),
    Contents: Yup.string().max(200, "Too Long!").required("Please enter plan description"),
    NumberOfPlanActiveDays: Yup.number().test('len', 'Must be less than or equal to 8 digits', val => val && val.toString().length <= 8).required("Please enter number of plan active days"),
    Frequency: Yup.string().required("Please select frequency"),
    NumberofTherapists: Yup.number().test('len', 'Must be less than or equal to 8 digits', val => val && val.toString().length <= 8).required("Please enter number of therapist"),
    NumberofPatients: Yup.number().test('len', 'Must be less than or equal to 8 digits', val => val && val.toString().length <= 8).required("Please enter number of patients"),
    NumberofCustomScales: Yup.number().test('len', 'Must be less than or equal to 8 digits', val => val && val.toString().length <= 8).required("Please enter number of custom scales"),
    NumberofCustomSkills: Yup.number().test('len', 'Must be less than or equal to 8 digits', val => val && val.toString().length <= 8).required("Please enter number of custom skills"),
    // NumberofCustomAssessment: Yup.number().required("Please enter number of custom assessments"),
    NumberofCustomContents: Yup.number().test('len', 'Must be less than or equal to 8 digits', val => val && val.toString().length <= 8).required("Please enter number of custom contents"),
    Price: Yup.number()
      .test('len', 'Must be less than or equal to 10 digits', val => val && val.toString().length <= 10).required("Please enter price"),
    OnetimeFee: Yup.number()
      .test('len', 'Must be less than or equal to 10 digits', val => val && val.toString().length <= 10).required("Please enter one time fee"),
    PlanType: Yup.string().required("Please select plan type"),
  });

  const onSubmit = (values) => {

    const ValueToSend = {
      "PlanName": values.PlanName,
      "Contents": values.Contents,
      "NumberOfPlanActiveDays": values.NumberOfPlanActiveDays,
      "Frequency": values.Frequency,
      "NumberofTherapists": values.NumberofTherapists,
      "NumberofPatients": values.NumberofPatients,
      "NumberofCustomScales": values.NumberofCustomScales,
      "NumberofCustomSkills": values.NumberofCustomSkills,
      "NumberofCustomAssessment": values.NumberofCustomAssessment,
      "NumberofCustomContents": values.NumberofCustomContents,
      "Price": values.Price,
      "OnetimeFee": values.OnetimeFee,
      "PlanType": values.PlanType
    }


    dispatch(SubscriptionPlans(ValueToSend));
    tog_standard();
  };

  // close modal alert
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const onHandleCloseConfirm = async () => {
    setIsAlertOpen(false);
    tog_standard();
  };
  const onCloseAlert = () => {
    setIsAlertOpen(false);
  };

  return (
    <>
      <Button type='button' onClick={tog_standard} color='primary' className='waves-effect waves-light'>
        Create Plan
      </Button>

      <Formik initialValues={initials} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ touched, errors, handleSubmit, resetForm }) => (
          <Modal
            isOpen={setModalOpenState}
            toggle={() => {
              setIsAlertOpen(true);
            }}
            scrollable={true}
            className='modal right app_modal'
            onClosed={() => {
              resetForm();
            }}>
            {isAlertOpen ? <CloseSweetAlert onConfirm={onHandleCloseConfirm} onClose={onCloseAlert} /> : null}
            <ModalHeader
              toggle={() => {
                setIsAlertOpen(true);
              }}>
              Create Subscription Plan
            </ModalHeader>
            <ModalBody>
              <div className='mb-4'>
                <Label className='form-label required' htmlFor='Plan-name'>
                  Subscription Plan Name
                </Label>
                <Field type='text' name='PlanName' className='form-control' id='Plan-name' placeholder='Enter Plan name' />
                {errors.PlanName && touched.PlanName ? <ErrorMessage className='text-danger small' name='PlanName' component='div' /> : null}
              </div>
              <div className='mb-4'>
                <Label className='form-label required' htmlFor='Plan-description'>
                  Plan Description
                </Label>
                <Field component='textarea' name='Contents' className='form-control' id='Plan-description' placeholder='Enter description' />
                {errors.Contents && touched.Contents ? <ErrorMessage className='text-danger small' name='Contents' component='div' /> : null}
              </div>
              <Row>
                <Col lg='6'>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='plan-active'>
                      Plan Active Days
                    </Label>
                    <Field type='text' name='NumberOfPlanActiveDays' className='form-control' id='plan-active' placeholder='Enter number of plan active days' />
                    {errors.NumberOfPlanActiveDays && touched.NumberOfPlanActiveDays ? <ErrorMessage className='text-danger small' name='NumberOfPlanActiveDays' component='div' /> : null}
                  </div>
                </Col>
                <Col lg='6'>
                  <Label className='form-label required mb-3'>Frequency</Label>
                  <div className='d-flex flex-wrap'>
                    <div className='custom-control custom-radio mb-2 mr-4'>
                      <Field type='radio' id='Weekly' name='Frequency' className='custom-control-Input form-check-input' value='Weekly' />
                      <Label className='custom-control-Label' htmlFor='Weekly'>
                        Weekly
                      </Label>
                    </div>
                    <div className='custom-control custom-radio mb-2 mr-4'>
                      <Field type='radio' id='Monthly' name='Frequency' className='custom-control-Input form-check-input' value='Monthly' />
                      <Label className='custom-control-Label' htmlFor='Monthly'>
                        Monthly
                      </Label>
                    </div>
                    <div className='custom-control custom-radio mb-2 '>
                      <Field type='radio' id='Annually' name='Frequency' className='custom-control-Input form-check-input' value='Annually' />
                      <Label className='custom-control-Label' htmlFor='Annually'>
                        Annually
                      </Label>
                    </div>
                  </div>
                  {errors.Frequency && touched.Frequency ? <ErrorMessage className='text-danger small' name='Frequency' component='div' /> : null}
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='no_therapists'>
                      Therapists
                    </Label>
                    <Field type='text' name='NumberofTherapists' className='form-control' id='no_therapists' placeholder='Enter number of therapists' />
                    {errors.NumberofTherapists && touched.NumberofTherapists ? <ErrorMessage className='text-danger small' name='NumberofTherapists' component='div' /> : null}
                  </div>
                </Col>
                <Col md={4}>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='number_patients'>
                      Patients
                    </Label>
                    <Field type='text' name='NumberofPatients' className='form-control' id='number_patients' placeholder='Enter number of therapists' />
                    {errors.NumberofPatients && touched.NumberofPatients ? <ErrorMessage className='text-danger small' name='NumberofPatients' component='div' /> : null}
                  </div>
                </Col>
                <Col md={4}>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='number_customscales'>
                      Custom Scales
                    </Label>
                    <Field type='text' name='NumberofCustomScales' className='form-control' id='number_customscales' placeholder='Enter number of customscales' />
                    {errors.NumberofCustomScales && touched.NumberofCustomScales ? <ErrorMessage className='text-danger small' name='NumberofCustomScales' component='div' /> : null}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='custom_skills'>
                      Custom Skills
                    </Label>
                    <Field type='text' name='NumberofCustomSkills' className='form-control' id='custom_skills' placeholder='Enter number of custom skills' />
                    {errors.NumberofCustomSkills && touched.NumberofCustomSkills ? <ErrorMessage className='text-danger small' name='NumberofCustomSkills' component='div' /> : null}
                  </div>
                </Col>
                {/* <Col md={4}>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='custom_assessment'>
                      Custom Assessment
                    </Label>
                    <Field type='text' name='NumberofCustomAssessment' className='form-control' id='custom_assessment' placeholder='Enter number of custom assessment' />
                    {errors.NumberofCustomAssessment && touched.NumberofCustomAssessment ? <ErrorMessage className='text-danger small' name='NumberofCustomAssessment' component='div' /> : null}
                  </div>
                </Col> */}
                <Col md={6}>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='custom_contents'>
                      Custom Contents
                    </Label>
                    <Field type='text' name='NumberofCustomContents' className='form-control' id='custom_contents' placeholder='Enter number of custom contents' />
                    {errors.NumberofCustomContents && touched.NumberofCustomContents ? <ErrorMessage className='text-danger small' name='NumberofCustomContents' component='div' /> : null}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col lg='6'>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='price'>
                      Price
                    </Label>
                    <Field type='text' name='Price' className='form-control' id='price' placeholder='Enter price' />
                    {errors.Price && touched.Price ? <ErrorMessage className='text-danger small' name='Price' component='div' /> : null}
                  </div>
                </Col>
                <Col lg='6'>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='onetime_fee'>
                      One Time Fee
                    </Label>
                    <Field type='text' name='OnetimeFee' className='form-control' id='onetime_fee' placeholder='Enter one time fee' />
                    {errors.OnetimeFee && touched.OnetimeFee ? <ErrorMessage className='text-danger small' name='OnetimeFee' component='div' /> : null}
                  </div>
                </Col>
              </Row>

              <div className='mb-4'>
                <Label className='form-label required mb-2'>Plan Type</Label>
                <div className='d-flex flex-wrap'>
                  <div className='custom-control custom-radio mb-2 mr-4'>
                    <Field type='radio' id='Public' name='PlanType' className='custom-control-Input form-check-input' value='Public' />
                    <Label className='custom-control-Label' htmlFor='Public'>
                      Public
                    </Label>
                  </div>
                  <div className='custom-control custom-radio mb-2 mr-4'>
                    <Field type='radio' id='Private' name='PlanType' className='custom-control-Input form-check-input' value='Private' />
                    <Label className='custom-control-Label' htmlFor='Private'>
                      Private
                    </Label>
                  </div>
                  <div className='custom-control custom-radio mb-2 '>
                    <Field type='radio' id='Custom' name='PlanType' className='custom-control-Input form-check-input' value='Custom' />
                    <Label className='custom-control-Label' htmlFor='Custom'>
                      Custom
                    </Label>
                  </div>
                </div>
                {errors.PlanType && touched.PlanType ? <ErrorMessage className='text-danger small' name='PlanType' component='div' /> : null}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={tog_standard} type='button' color='light' className='btn-md m-1 waves-effect waves-light action_btn'>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading} type='button' color='primary' className='btn-md m-1 waves-effect waves-light action_btn'>
                Submit
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default CreateSubscriptionPlan;
