import { Row, Col, Label, Button } from "reactstrap";
import Select from "react-select";
import { useEffect, useState } from "react";
import { Field, ErrorMessage, Formik } from "formik";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { selectPatientDetails, selectpatientIsEdit, setPatientEdit, updatePatient } from "../../../store/slice/patient.slice";
import { selectCountries, getAllStates, selectStates, uploadImage } from "../../../store/slice/common.slice";
import { handleCountryStateSearch } from "../../shared/util.common-function";
import * as yup from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { validatePhone } from "../../shared/util.common-function";
import Link from "next/link";
import "flatpickr/dist/flatpickr.css";
import Flatpickr from "react-flatpickr";
import { useRouter } from "next/router";
import FileDropZoneForm from "../../shared/filedropzoneform";

function BasicDetails() {
  const dispatch = useDispatch();
  const router = useRouter();

  let patient = useSelector(selectPatientDetails);

console.log("patient ****",patient);

  const isEdit = useSelector(selectpatientIsEdit);
  patient = patient[0]
  const [countryCode, setCountryCode] = useState("in");
  const [parentPhone, setParentPhone] = useState("");

  const [stateLoading, setStateLoading] = useState(false);
  const [defaultStateValue, setDefaultStateValue] = useState({
    label: patient?.State,
  });
  const [defaultCountryValue, setDefaultCountryValue] = useState({
    label: patient?.Country, value: patient?.Country
  });
  const [dob, setDob] = useState("");
  useEffect(() => {
    if (patient) setDob(patient.DOB);
  }, [patient]);

  useEffect(() => {
    if (patient) setParentPhone(patient.ParentPhone);
  }, [patient]);

  //handling State and Country
  const AllCountries = useSelector(selectCountries);
  const AllCountriesList = AllCountries?.map((country) => {
    return { value: country.CountryID, label: country.CountryName };
  });
  const DefaultCountry = AllCountriesList?.find((option) => option.label === patient?.Country);

  const handleCountryChange = async (key) => {
    setStateLoading(true);
    await dispatch(getAllStates(key));
    AllStatesList && setStateLoading(false);
  };
  useEffect(() => {
    if (patient?.Country) {
      handleCountryChange(DefaultCountry?.value);
    }
  }, [patient?.Country]);

  const AllStates = useSelector(selectStates);
  const AllStatesList = AllStates?.map((state) => {
    return { value: state.StateID, label: state.StateName };
  });
  const handleStateChange = (state) => {
    setDefaultStateValue(state);
  };
  const CountryChange = (country) => {
    setDefaultCountryValue(country);
  };
  // Upload documents
  const [documentsLoading, setDocumentsLoading] = useState(false);

  const uploadDocumentFile = async (files, setFieldValue) => {
    if (files.length > 0) {
      setDocumentsLoading(true);

      let formData = new FormData();
      formData.append("imageFile", files[0]);

      try {
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, "-") : filename;
        await setFieldValue("DocumentsURL", nonSpaceName);
        setDocumentsLoading(false);
      } catch (rejectedValueOrSerializedError) {
        console.log(rejectedValueOrSerializedError);
        setDocumentsLoading(false);
      }
    }
  };

  const selectStyles = {
    control: (styles, { isDisabled }) => ({
      ...styles,
      borderColor: " #e8eaed;",
      color: isDisabled && "#292c39",
      backgroundColor: isDisabled ? "#f9fbff" : "white",
    }),
    singleValue: (styles) => ({ ...styles, color: "#292c39" }),
  };

  const onCancel = async () => {
    await dispatch(setPatientEdit(false));
    await router.back();
  };
  function createFormatDate(date) {

    return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
  }
  const onSubmit = async (values) => {


console.log("values ****",values);

    const valueToSend = {
      "ParentEmailID": values.ParentEmailID,
      "ParentPhone": values.ParentPhone,
      "AddressLine1": values.AddressLine1,
      "AddressLine2": values.AddressLine2,
      "City": values.City,
      "District": values.District,
      "Pincode": values.Pincode,
      "State": values.State,
      "Country": values.Country,
      "RoleId": values.RoleId,
      "Status": values.Status,
      "Create_TS": values.Create_TS,
      "Update_TS": values.Update_TS,
      "Create_By": values.Create_By,
      "Update_By": values.Update_By,
      "PatientID": values.PatientID,
      "UserID": values.UserID,
      "DepartmentID": values.DepartmentID,
      "TherapistID": values.TherapistID,
      "PatientName": values.PatientName,
      "DOB": createFormatDate(values.DOB),
      "Gender": values.Gender,
      "ParentName": values.ParentName,
      "Relationship": values.Relationship,
      "PreviousTreatmentHistoryDescription": values.PreviousTreatmentHistoryDescription,
      "PreviousTreatmentHistoryURL": values.PreviousTreatmentHistoryURL,
      "DocumentsURL": values.DocumentsURL,
      "ReportsURL": values.ReportsURL,
      "Remarks": values.Remarks,
      "IsPasswordReset": values.IsPasswordReset,
      "IsAppCreated": values.IsAppCreated
    }

    await dispatch(
      updatePatient({
        ...valueToSend,
        Status: true,
      })
    );
    // await dispatch(SelectPatient(PatientID));
  };

  const PatientValidationSchema = yup.object().shape({
    PatientName: yup.string().required("Patient name is required"),
    DOB: yup.string().required("Date of birth is required"),
    Gender: yup.string().required("Gender is required"),
    AddressLine1: yup.string().required("Address1 is required"),
    AddressLine2: yup.string().required("Address2 is required"),
    City: yup.string().required("City is required"),
    District: yup.string().required("District is required"),
    Pincode: yup.string().required("Pincode is required"),
    State: yup.string().required("State is required"),
    Country: yup.string().required("Country is required"),
    ParentName: yup.string().required("Guardian Name is required"),
    ParentEmailID: yup.string().email("Invalid email").required("Email is required"),
    ParentPhone: yup.string().required("Phone number is required"),
    Relationship: yup.string().required("Guardian relation is required"),
    DocumentsURL: yup.string().required("Documents is required"),
    Remarks: yup.string().required("Remarks is required"),

    // Center: yup.string().required("Center is required"),
    // Departments: yup.string().required("Departments is required"),
    // Facilitator: yup.string().required("Facilitator is required"),
  });

  return (
    <Formik initialValues={patient} validationSchema={PatientValidationSchema} onSubmit={onSubmit}>
      {({ handleSubmit, isSubmitting, errors, touched, setFieldTouched, setFieldValue, handleBlur }) => (
        <div>
          <fieldset disabled={isEdit ? false : true}>
            <Row>
              <Col md='6'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='patient-name'>
                    Patient Name
                  </Label>
                  <Field type='text' name='PatientName' id='patient-name' placeholder='Enter patient name' className='form-control' />
                  {errors.PatientName && touched.PatientName ? <ErrorMessage className='text-danger small' name='PatientName' component='div' /> : null}
                </div>
              </Col>

              {/* <Col lg='6'>
            <div className='mb-4'>
              <Label className='form-label ' htmlFor='patient-id'>
                Patient ID
              </Label>
              <Field type='number' name='PatientID' className='form-control' id='patient-id' disabled />
            </div>
          </Col> */}
              <Col md='3'>
                <div className='mb-4'>
                  <Label className='form-label required ' htmlFor='dob'>
                    Date of Birth
                  </Label>

                  <Field
                    component={Flatpickr}
                    className='form-control'
                    name='DOB'
                    placeholder='Date of Birth'
                    value={dob}
                    onChange={(res) => {
                      setDob(res[0]?.toISOString().slice(0, 10));
                      setFieldValue("DOB", res[0] ? res[0].toISOString().slice(0, 10) : "");
                      setFieldTouched("DOB", true);
                    }}
                    options={{
                      altInput: true,
                      altFormat: "j M, Y",
                      dateFormat: "Y-m-d",
                    }}
                  />
                  {/* <Field type='date' name='DOB' className='form-control' placeholder='Enter date of birth' id='dob' /> */}

                  {errors.DOB && touched.DOB ? <ErrorMessage className='text-danger small' name='DOB' component='div' /> : null}
                </div>
              </Col>

              <Col md={3}>
                <div className='mb-4'>
                  <Label className='form-label required '>Gender</Label>
                  {isEdit ? (
                    <div className='d-flex flex-wrap mt-3'>
                      <div className='custom-control custom-radio mb-2 mr-5'>
                        <Field type='radio' id='Male' name='Gender' className='custom-control-Input form-check-input' value='Male' />
                        <Label className='custom-control-Label' htmlFor='Male'>
                          Male
                        </Label>
                      </div>
                      <div className='custom-control custom-radio mb-2 ml-2 mr-3'>
                        <Field type='radio' id='Female' name='Gender' value='Female' className='custom-control-Input form-check-input' />
                        <Label className='custom-control-Label' htmlFor='Female'>
                          Female
                        </Label>
                      </div>
                    </div>
                  ) : (
                    <Field type='text' name='Gender' className='form-control' placeholder='Gender' id='Gender' />
                  )}

                  {errors.Gender && touched.Gender ? <ErrorMessage className='text-danger small' name='Gender' component='div' /> : null}
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='name-input1'>
                    Guardian Name
                  </Label>
                  <Field type='text' name='ParentName' id='name-input1' className='form-control' placeholder='Enter parent name ' />
                  {errors.ParentName && touched.ParentName ? <ErrorMessage className='text-danger small' name='ParentName' component='div' /> : null}
                </div>
              </Col>
              <Col md={3}>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='Relationship'>
                    Guardian Relation
                  </Label>
                  <Field type='text' name='Relationship' id='Relationship' className='form-control' placeholder='Enter relationship ' />
                  {errors.Relationship && touched.Relationship ? <ErrorMessage className='text-danger small' name='Relationship' component='div' /> : null}
                </div>
              </Col>
              <Col md={3}>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='email'>
                    Guardian Email
                  </Label>
                  <Field type='text' name='ParentEmailID' id='email' className='form-control' placeholder='Enter Email' />
                  {errors.ParentEmailID && touched.ParentEmailID ? <ErrorMessage className='text-danger small' name='ParentEmailID' component='div' /> : null}
                </div>
              </Col>
              <Col md={3}>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='parentphone'>
                    Guardian Phone number
                  </Label>

                  <Field
                    component={PhoneInput}
                    country={countryCode}
                    onChange={(value, country) => {
                      setCountryCode(country.countryCode);
                      setParentPhone(value);
                      setFieldValue("parentPhone", value);
                    }}
                    value={parentPhone}
                    name='ParentPhone'
                    placeholder='Enter phone Number'
                    inputClass='mr-auto border-0'
                    buttonClass='mr-auto border-0 bg-transparent'
                    containerClass='form-control d-flex align-items-center'
                    enableSearch={true}
                    validate={() => validatePhone(parentPhone, countryCode)}
                    onBlur={handleBlur}
                    inputProps={{
                      required: true,
                      id: "ParentPhone",
                    }}
                  />

                  {errors.ParentPhone && touched.ParentPhone ? <ErrorMessage className='text-danger small' name='ParentPhone' component='div' /> : null}
                </div>
              </Col>
            </Row>

            <Row>
              <h6 className='mb-3'>Address</h6>
              <Col lg='4'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='addressLine1-input1'>
                    Address line 1
                  </Label>
                  <Field type='text' name='AddressLine1' id='addressLine1-input1' placeholder='Enter address line 1' className='form-control' />
                  {errors.AddressLine1 && touched.AddressLine1 ? <ErrorMessage className='text-danger small' name='AddressLine1' component='div' /> : null}
                </div>
              </Col>

              <Col lg='4'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='addressLine2-input1'>
                    Address line 2
                  </Label>
                  <Field type='text' name='AddressLine2' id='addressLine2-input1' placeholder='Enter address line 2' className='form-control' />
                  {errors.AddressLine2 && touched.AddressLine2 ? <ErrorMessage className='text-danger small' name='AddressLine2' component='div' /> : null}
                </div>
              </Col>

              <Col lg='4'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='city-input1'>
                    City
                  </Label>
                  <Field type='text' name='City' id='city-input1' placeholder='Enter city ' className='form-control' />
                  {errors.City && touched.City ? <ErrorMessage className='text-danger small' name='City' component='div' /> : null}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg='3'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='district'>
                    District
                  </Label>
                  <Field type='text' name='District' id='district' placeholder='Enter district ' className='form-control' />
                  {errors.District && touched.District ? <ErrorMessage className='text-danger small' name='District' component='div' /> : null}
                </div>
              </Col>

              <Col lg='3'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='country-input1'>
                    Country
                  </Label>
                  <Field
                    component={Select}
                    options={AllCountriesList}
                    defaultValue={DefaultCountry}
                    id='country-input1'
                    name='Country'
                    placeholder='Select'
                    // className="form-control"
                    value={defaultCountryValue}
                    isSearchable={true}
                    filterOption={handleCountryStateSearch}
                    onChange={(country) => {
                      handleCountryChange(country.value);
                      setDefaultStateValue("");
                      setFieldValue("State", "");
                      setFieldValue("Country", country.label);
                      CountryChange(country)
                    }}
                    styles={selectStyles}
                    isDisabled={isEdit === true ? false : true}
                  />

                  {errors.Country && touched.Country ? <ErrorMessage className='text-danger small' name='Country' component='div' /> : null}
                </div>
              </Col>
              <Col lg='3'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='state-input1'>
                    State
                  </Label>
                  <Field
                    component={Select}
                    options={AllStatesList}
                    value={defaultStateValue}
                    id='state-input1'
                    name='State'
                    placeholder='Select'
                    isSearchable={true}
                    filterOption={handleCountryStateSearch}
                    isLoading={stateLoading}
                    onChange={(state) => {
                      setFieldValue("State", state.label),
                        handleStateChange(state)
                    }}
                    styles={selectStyles}
                    isDisabled={isEdit === true ? false : true}
                  />
                  {errors.State && touched.State ? <ErrorMessage className='text-danger small' name='State' component='div' /> : null}
                </div>
              </Col>

              <Col lg='3'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='pincode-input1'>
                    Pincode
                  </Label>
                  <Field type='text' name='Pincode' id='pincode-input1' placeholder='Enter Pincode ' className='form-control' />
                  {errors.Pincode && touched.Pincode ? <ErrorMessage className='text-danger small' name='Pincode' component='div' /> : null}
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={isEdit ? "12" : "2"}>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='DocumentsURL'>
                    Problem Details
                  </Label>
                  {isEdit ? (
                    <FileDropZoneForm multiFiles={false} name='DocumentsURL' isUploading={documentsLoading} fileData={uploadDocumentFile} displayName={patient?.DocumentsURL} setFieldValue={setFieldValue}/>
                  ) : (
                    <div>
                      <Link href={`${patient?.DocumentsURL}`} passHref>
                        <a target='_blank' className='waves-effect waves-light m-2 ml-3 mt-3 btn-primary btn-sm'>
                          View Documents
                        </a>
                      </Link>
                    </div>
                  )}
                  {/* <Field type='text' name='DocumentsURL' id='DocumentsURL' className='form-control' placeholder='Enter DocumentsURL ' /> */}
                  {errors.DocumentsURL && touched.DocumentsURL ? <ErrorMessage className='text-danger small' name='DocumentsURL' component='div' /> : null}
                </div>
              </Col>
              <Col md={isEdit ? "12" : "10"}>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='Remarks'>
                    Remarks
                  </Label>
                  <Field as='textarea' rows={3} name='Remarks' className='form-control' id='Remarks' placeholder='Enter Remarks' />
                  {errors.Remarks && touched.Remarks ? <ErrorMessage className='text-danger small' name='Remarks' component='div' /> : null}
                </div>
              </Col>
            </Row>
          </fieldset>
          <ul className='pager wizard twitter-bs-wizard-pager-link w-100' style={{ listStyle: "none" }}>
            <li className={"submit"}>
              {isEdit ? (
                <>
                  <Button onClick={onCancel} color='secondary' className='btn-md m-1 waves-effect waves-light action_btn'>
                    Cancel
                  </Button>

                  <Button type='submit' color='primary' className='btn-md m-1 waves-effect waves-light action_btn' onClick={handleSubmit} disabled={isSubmitting}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button type='button' color='secondary' className='btn-md waves-effect waves-light action_btn' onClick={() => router.back()}>
                  Back
                </Button>
              )}
            </li>
          </ul>
        </div>
      )}
    </Formik>
  );
}

export default BasicDetails;
