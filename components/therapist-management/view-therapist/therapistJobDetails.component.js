import { ErrorMessage, Field, Formik, useFormikContext } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Button, Col, Label, Row } from "reactstrap";
import { fetchAllCenters } from "../../../store/slice/center.slice";
import { getAllDepartments, selectDepartmentList } from "../../../store/slice/department.slice";
import { selectTherapist, selectTherapistIsEdit, therapistUpdation } from "../../../store/slice/therapist.slice";
import { therapistValidation } from "../therapist-validation";
import FACILITATORS from "../../../constants/facilitators.constant";

function TherapistJobDetails() {
  const { values, setFieldValue } = useFormikContext();
  const dispatch = useDispatch();
  const router = useRouter();
  const [centerValue, setCenterValue] = useState("");
  const [departmentValue, setDepartmentValue] = useState("");

  const IsEdit = useSelector(selectTherapistIsEdit);

  useEffect(() => {
    dispatch(fetchAllCenters());
    dispatch(getAllDepartments());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Therapist = useSelector(selectTherapist);
  const departments = useSelector(selectDepartmentList);
  const departmentList = departments?.map((department) => {
    return { value: department.DepartmentID, label: department.DepartmentName };
  });
  useEffect(() => {
    const DefaultDep = departmentList?.find((option) => option.value === Therapist[0]?.DepartmentID);
    setDepartmentValue(DefaultDep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departments]);

  const centers = useSelector((state) => state.center.centers);
  const centerList = centers?.map((center) => {
    return { value: center.CenterID, label: center.CenterName };
  });

  useEffect(() => {
    const DefaultCenter = centerList?.find((option) => option.value === Therapist[0]?.CenterID);
    setCenterValue(DefaultCenter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centers]);

  // Initial Facilitator select option
  const DefaultTherapistType = FACILITATORS?.find((option) => option.value === Therapist[0]?.TherapistType);
  useEffect(() => {
    if (values.TherapistType !== "") setFieldValue("FacilitatorType", values.TherapistType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.TherapistType]);

  const onSubmit = async (values, actions) => {
    const valuesToSend = { ...values, Status: true };
    await dispatch(therapistUpdation(valuesToSend));
    actions.setSubmitting(false);
  };

  return Therapist.length > 0 ? (
    <Formik initialValues={Therapist[0]} validationSchema={therapistValidation(1)} onSubmit={onSubmit} enableReinitialize={true}>
      {({ errors, touched, handleSubmit, values, setFieldValue }) => (
        <>
          <fieldset disabled={IsEdit ? false : true}>
            <Row>
              {/* <Col lg='6'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='CenterID'>
                    Center
                  </Label>
                  <Field
                    component={Select}
                    options={centerList}
                    id='CenterID'
                    isDisabled={IsEdit ? false : true}
                    name='CenterID'
                    placeholder='Select'
                    isSearchable={true}
                    value={centerValue}
                    onChange={(center) => {
                      setCenterValue(center);
                      setFieldValue("CenterID", center.value);
                    }}
                    styles={{
                      control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
                    }}
                  />

                  {errors.CenterID && touched.CenterID ? <ErrorMessage className='text-danger small' name='CenterID' component='div' /> : null}
                </div>
              </Col> */}
              {/* <Col lg='6'> */}
              <div className='mb-4'>
                <Label className='form-label required' htmlFor='DepartmentID'>
                  Department
                </Label>
                <Field
                  component={Select}
                  options={departmentList}
                  id='DepartmentID'
                  isDisabled={IsEdit ? false : true}
                  name='DepartmentID'
                  placeholder='Select'
                  isSearchable={true}
                  value={departmentValue}
                  onChange={(dept) => {
                    setFieldValue("DepartmentID", dept.value);
                    console.log("dept", dept);
                    setDepartmentValue(dept);
                  }}
                  styles={{
                    control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
                  }}
                />

                {errors.DepartmentID && touched.DepartmentID ? <ErrorMessage className='text-danger small' name='DepartmentID' component='div' /> : null}
              </div>
              {/* </Col> */}
            </Row>
            <Row>
              <Col lg='6'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='designation'>
                    Designation
                  </Label>
                  <Field type='text' className='form-control' id='designation' name='Designation' placeholder='Enter designation' />
                  {errors.Designation && touched.Designation ? <ErrorMessage className='text-danger small' name='Designation' component='div' /> : null}
                </div>
              </Col>
              <Col lg='6'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='language'>
                    Language
                  </Label>
                  <Field type='text' className='form-control' id='language' name='Language' placeholder='Enter language' />
                  {errors.Language && touched.Language ? <ErrorMessage className='text-danger small' name='Language' component='div' /> : null}
                </div>
              </Col>
            </Row>

            <div className='mb-4'>
              <Label className='form-label required' htmlFor='Therapist-type'>
                Facilitator
              </Label>
              <Field
                component={Select}
                options={FACILITATORS}
                id='TherapistType'
                name='TherapistType'
                placeholder='Select'
                isDisabled={IsEdit ? false : true}
                isSearchable={true}
                defaultValue={DefaultTherapistType}
                onChange={(therapist) => {
                  setFieldValue("TherapistType", therapist.value);
                }}
                styles={{
                  control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
                }}
              />
              {errors.TherapistType && touched.TherapistType ? <ErrorMessage className='text-danger small' name='TherapistType' component='div' /> : null}
            </div>
          </fieldset>
          <div className='container-action d-flex justify-content-end'>
            {IsEdit ? (
              <>
                <Button type='button' color='light' className='btn-md waves-effect waves-light action_btn mr-3' onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type='submit' color='primary' className='btn-md waves-effect waves-light action_btn' onClick={handleSubmit}>
                  Update
                </Button>
              </>
            ) : (
              <Button type='button' color='secondary' className='btn-md waves-effect waves-light action_btn' onClick={() => router.back()}>
                Back
              </Button>
            )}
          </div>
        </>
      )}
    </Formik>
  ) : null;
}
export default TherapistJobDetails;
