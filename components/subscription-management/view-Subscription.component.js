import { ErrorMessage, Field, Formik } from "formik";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { UpdateSubscriptionPlans, selectIsLoadingUpdate, selectSubscriptionIsEdit } from "../../store/slice/subscription.slice";

function ViewSub({ data }) {
    const dispatch = useDispatch();
    const IsEdit = useSelector(selectSubscriptionIsEdit);
    const loading = useSelector(selectIsLoadingUpdate);

    const router = useRouter();

    const { SubscriptionPlanID } = router.query;


    const validationSchema = Yup.object().shape({
        PlanName: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Please enter Plan Name"),
        Contents: Yup.string().required("Please enter Description"),
        NumberOfPlanActiveDays: Yup.number().required("Please enter Active Days"),
        // Frequency: Yup.number().required("Please enter Media Type"),
        NumberofTherapists: Yup.number().required("Please enter Number of Therapists"),
        NumberofPatients: Yup.number().required("Please enter Number of Patients"),
        NumberofCustomScales: Yup.number().required("Please enter Number of Custom Scales"),
        NumberofCustomSkills: Yup.number().required("Please enter Number of Custom Skills"),
        NumberofCustomAssessment: Yup.number().required("Please enter Number of Custom Assessment"),
        NumberofCustomContents: Yup.number().required("Please enter Number of Custom Contents"),
        Price: Yup.number().required("Please enter Price"),
        OnetimeFee: Yup.number().required("Please enter OnetimeFee"),
        // PlanType: Yup.number().required("Please enter Media Type"),
    });

    const onSubmit = (values) => {

        const body = {
            "PlanName": values.PlanName,
            "Contents": values.Contents,
            "NumberOfPlanActiveDays": values.NumberOfPlanActiveDays,
            "Frequency": values.Frequency,
            "NumberofTherapists": values.NumberofTherapists,
            "NumberofPatients": values.NumberofPatients,
            "NumberofCustomScales": values.NumberofCustomScales,
            "NumberofCustomSkills": values.NumberofCustomSkills,
            "NumberofCustomAssessment": '0',
            "NumberofCustomContents": values.NumberofCustomContents,
            "Price": values.Price,
            "OnetimeFee": values.OnetimeFee,
            "PlanType": values.PlanType,
            "Status": 1
        }
        const ValueToSend = {
            body,
            SubscriptionPlanID
        }
        dispatch(UpdateSubscriptionPlans(ValueToSend));
        router.back();
    };

    const handleCancel = () => {
        router.back();
    };


    return (
        <fieldset disabled={IsEdit ? false : true}>
            <Formik initialValues={data} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
                {({ touched, errors, handleSubmit, resetForm, isSubmitting, setFieldValue }) => (
                    <>
                        <div>
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
                        </div>
                        {IsEdit ? <div><Button onClick={handleCancel} type='button' color='light' className='btn-md m-1 waves-effect waves-light action_btn'>
                            Cancel
                        </Button>
                            <Button onClick={handleSubmit} disabled={loading} type='button' color='primary' className='btn-md m-1 waves-effect waves-light action_btn'>
                                Submit
                            </Button></div> : <></>}
                    </>
                )}
            </Formik>
        </fieldset>
    );
}
export default ViewSub;
