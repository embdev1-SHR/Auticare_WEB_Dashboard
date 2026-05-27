import { ErrorMessage, Field, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import * as Yup from "yup";
import { fetchAllCenters } from "../../store/slice/center.slice";
import { departmentCreation } from "../../store/slice/department.slice";
import { selectSetModalOpenState, setModalOpen } from "../../store/slice/layout.slice";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { PHONE_COUNTRIES } from "../../constants/regExp/phone.regex";
import CloseSweetAlert from "../shared/close-sweetalert";

function AddDepartment() {
  const dispatch = useDispatch();
  const [countryCode, setCountryCode] = useState("in");

  useEffect(() => {
    dispatch(fetchAllCenters());
  }, []);
  const setModalOpenState = useSelector(selectSetModalOpenState);
  const centers = useSelector((state) => state.center.centers);
  const filteredCenters = centers.filter((center) => center.Status !== 0);
  const initValues = {
    DepartmentName: "",
    DepartmentHeadName: "",
    DepartmentHeadDesignation: "",
    DepartmentHeadQualification: "",
    DepartmentHeadEmailId: "",
    DepartmentHeadPhone: "",
  };
  const validationSchema = Yup.object().shape({
    DepartmentName: Yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Please enter Department Name"),
    DepartmentHeadName: Yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Please enter Head of Department"),
    DepartmentHeadDesignation: Yup.string()
      .min(2, "Too Short!")
      .max(100, "Too Long!")
      .matches(/^([^0-9]*)$/, "Invalid Designation")
      .required("Please enter department head Designation"),
    DepartmentHeadQualification: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Please enter department head qualification"),
    DepartmentHeadEmailId: Yup.string()
      .max(200, "Too Long!")
      .email("Invalid email")
      .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Invalid email")
      .required("Please enter email of department head"),
    DepartmentHeadPhone: Yup.string().max(25, "Too Long!").required("Please enter phone number of department head"),
  });

  const onSubmit = async (values, actions) => {
    await dispatch(departmentCreation(values));
  };

  const tog_standard = () => {
    dispatch(setModalOpen(!setModalOpenState));
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
        Add Department
      </Button>
      <Formik initialValues={initValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
        {({ errors, touched, values, handleSubmit, setFieldValue, handleBlur, resetForm, isSubmitting }) => (
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
              Add Department
            </ModalHeader>
            <ModalBody>
              <Row>
                {/* <Col lg='6'> */}
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='department-name'>
                    Department Name
                  </Label>
                  <Field type='text' className='form-control' id='department-name' name='DepartmentName' placeholder='Enter department name' />
                  {errors.DepartmentName && touched.DepartmentName ? <ErrorMessage className='text-danger small' name='DepartmentName' component='div' /> : null}
                </div>
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
                      Department Head Designation
                    </Label>
                    <Field type='text' className='form-control' id='designation' name='DepartmentHeadDesignation' placeholder='Enter designation' />
                    {errors.DepartmentHeadDesignation && touched.DepartmentHeadDesignation ? <ErrorMessage className='text-danger small' name='DepartmentHeadDesignation' component='div' /> : null}
                  </div>
                </Col>
                <Col lg='6'>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='qualification'>
                      Department Head Qualification
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
                    <Field
                      component={PhoneInput}
                      country={countryCode}
                      onChange={(value, country) => {
                        setCountryCode(country.countryCode);
                        setFieldValue("DepartmentHeadPhone", value);
                      }}
                      name='DepartmentHeadPhone'
                      value={values.DepartmentHeadPhone}
                      id='DepartmentHeadPhone'
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
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={() => {
                  resetForm(), tog_standard();
                }}
                color='light'
                type='reset'
                className='btn-md m-1 waves-effect waves-light action_btn'>
                Cancel
              </Button>
              <Button type='submit' color='primary' className='btn-md m-1 waves-effect waves-light action_btn' disabled={isSubmitting} onClick={handleSubmit}>
                Submit
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
}
export default AddDepartment;
