import { ErrorMessage, Field, Formik } from "formik";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import * as Yup from "yup";
import { PHONE_COUNTRIES } from "../../constants/regExp/phone.regex";
import { departmentUpdation, selectDepartment, selectEditState, selectViewModalState, setView } from "../../store/slice/department.slice";

function ViewDepartment() {
  const dispatch = useDispatch();
  const [countryCode, setCountryCode] = useState("in");

  const Department = useSelector(selectDepartment);
  const modalState = useSelector(selectViewModalState);
  const IsEdit = useSelector(selectEditState);

  const validationSchema = Yup.object().shape({
    DepartmentName: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Please enter Department name"),
    DepartmentHeadName: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Please enter head of Department"),
    DepartmentHeadDesignation: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .matches(/^([^0-9]*)$/, "Invalid Designation")
      .required("Please enter department head Designation"),
    DepartmentHeadQualification: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Please enter department Head Qualification"),
    DepartmentHeadEmailId: Yup.string()
      .email("Invalid email")
      .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Invalid email")
      .required("Please enter email of department head"),
    DepartmentHeadPhone: Yup.string().required("Please enter phone number of Department Head"),
  });

  const onSubmit = async (values, actions) => {
    const valuesToSend = { ...values, Status: true };
    await dispatch(departmentUpdation(valuesToSend));
    actions.setSubmitting(false);
  };

  const togg_modal = () => {
    dispatch(setView(!modalState));
  };

  function validatePhone(value) {
    const correspondingCountry = PHONE_COUNTRIES.find((country) => country.iso2 === countryCode.toUpperCase());
    let valide = false;

    if (correspondingCountry && value) {
      valide = new RegExp(correspondingCountry.validation).test(value?.replace(/ /g, ""));
    } else if (value) {
      valide = /(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s.]?[(]?[0-9]{1,3}[)]?([-\s.]?[0-9]{3})([-\s.]?[0-9]{3,4})/.test(value?.replace(/ /g, ""));
    }
    let error = valide ? undefined : "Invalid phone number";
    return error;
  }

  return (
    Department.length > 0 && (
      <Formik initialValues={Department[0]} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
        {({ errors, touched, values, handleBlur, handleSubmit, setFieldValue, resetForm, isSubmitting }) => (
          <Modal isOpen={modalState} toggle={togg_modal} scrollable={true} className='modal right app_modal'>
            <ModalHeader toggle={togg_modal}> Department Details</ModalHeader>
            <ModalBody>
              <fieldset disabled={IsEdit ? false : true}>
                <Row>
                  <Col lg='6'>
                    <div className='mb-4'>
                      <Label className='form-label required' htmlFor='department-name'>
                        Department Name
                      </Label>
                      <Field type='text' className='form-control' id='department-name' name='DepartmentName' placeholder='Enter department name' />
                      {errors.DepartmentName && touched.DepartmentName ? <ErrorMessage className='text-danger small' name='DepartmentName' component='div' /> : null}
                    </div>
                  </Col>
                  <Col lg='6'>
                    <div className='mb-4'>
                      <Label className='form-label required' htmlFor='department-id'>
                        Department Id
                      </Label>
                      <Field type='text' className='form-control' id='department-id' name='DepartmentID' disabled />
                    </div>
                  </Col>
                </Row>

                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='hod-name'>
                    Department Head Name
                  </Label>
                  <Field type='text' className='form-control' id='hod-name' name='DepartmentHeadName' placeholder='Enter full name' />
                  {errors.DepartmentHeadName && touched.DepartmentHeadName ? <ErrorMessage className='text-danger small' name='DepartmentHeadName' component='div' /> : null}
                </div>
                <Row>
                  <Col lg='6'>
                    <div className='mb-4'>
                      <Label className='form-label required' htmlFor='designation'>
                        Designation
                      </Label>
                      <Field type='text' className='form-control' id='designation' name='DepartmentHeadDesignation' placeholder='Enter designation' />
                      {errors.DepartmentHeadDesignation && touched.DepartmentHeadDesignation ? <ErrorMessage className='text-danger small' name='DepartmentHeadDesignation' component='div' /> : null}
                    </div>
                  </Col>
                  <Col lg='6'>
                    <div className='mb-4'>
                      <Label className='form-label required' htmlFor='qualification'>
                        Qualification
                      </Label>
                      <Field type='text' className='form-control' id='qualification' name='DepartmentHeadQualification' placeholder='Enter qualification' />
                      {errors.DepartmentHeadQualification && touched.DepartmentHeadQualification ? (
                        <ErrorMessage className='text-danger small' name='DepartmentHeadQualification' component='div' />
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg='6'>
                    <div className='mb-4'>
                      <Label className='form-label required' htmlFor='DepartmentHeadEmailId'>
                        Department Head Email
                      </Label>
                      <Field type='email' className='form-control' id='DepartmentHeadEmailId' name='DepartmentHeadEmailId' placeholder='Enter email' />
                      {errors.DepartmentHeadEmailId && touched.DepartmentHeadEmailId ? <ErrorMessage className='text-danger small' name='DepartmentHeadEmailId' component='div' /> : null}
                    </div>
                  </Col>
                  <Col lg='6'>
                    <div className='mb-4'>
                      <Label className='form-label required' htmlFor='DepartmentHeadPhone'>
                        Department Head Phone
                      </Label>
                      {/* <Field type='text' className='form-control' id='DepartmentHeadPhone' name='DepartmentHeadPhone' placeholder='enter phone' /> */}
                      <Field
                        component={PhoneInput}
                        country={countryCode}
                        onChange={(value, country) => {
                          setCountryCode(country.countryCode);
                          setFieldValue("DepartmentHeadPhone", value);
                        }}
                        name='DepartmentHeadPhone'
                        value={values.DepartmentHeadPhone}
                        placeholder='Enter phone Number'
                        inputClass='mr-auto border-0'
                        buttonClass='mr-auto border-0 bg-transparent'
                        containerClass='form-control d-flex align-items-center'
                        enableSearch={true}
                        validate={validatePhone}
                        onBlur={handleBlur}
                        inputProps={{
                          required: true,
                          id: "DepartmentHeadPhone",
                        }}
                      />
                      {errors.DepartmentHeadPhone && touched.DepartmentHeadPhone ? <ErrorMessage className='text-danger small' name='DepartmentHeadPhone' component='div' /> : null}
                    </div>
                  </Col>
                </Row>
              </fieldset>
            </ModalBody>
            <ModalFooter>
              {IsEdit ? (
                <>
                  <Button
                    onClick={() => {
                      resetForm(), togg_modal();
                    }}
                    color='light'
                    className='btn-md m-1 waves-effect waves-light action_btn'>
                    Cancel
                  </Button>
                  <Button type='submit' color='primary' className='btn-md m-1 waves-effect waves-light action_btn' disabled={isSubmitting} onClick={handleSubmit}>
                    Update
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    resetForm(), togg_modal();
                  }}
                  color='secondary'
                  className='btn-md m-1 waves-effect waves-light action_btn'>
                  Close
                </Button>
              )}
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    )
  );
}
export default ViewDepartment;
