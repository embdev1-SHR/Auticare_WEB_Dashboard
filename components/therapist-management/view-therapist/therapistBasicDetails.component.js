import { ErrorMessage, Field, Formik, useFormikContext } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Button, Col, Label, Row } from "reactstrap";
import { getAllCountries, getAllStates, selectCountries, selectIsLoading, selectStates, uploadImage } from "../../../store/slice/common.slice";
import { selectTherapist, selectTherapistIsEdit, therapistUpdation } from "../../../store/slice/therapist.slice";
import DropZoneForm from "../../shared/dropzoneform";
import { therapistValidation, validateTherapistPhone } from "../therapist-validation";
import { salutationOption } from "../../content-management/common.content";

function TherapistBasicDetails() {
  const { values, setFieldValue } = useFormikContext();
  const dispatch = useDispatch();
  const router = useRouter();
console.log("SalutationOption",salutationOption);
console.log("{value: 'Mr', label: 'Mr'}");
  const AllCountries = useSelector(selectCountries);
  const AllStates = useSelector(selectStates);
  const Therapist = useSelector(selectTherapist);
  const IsEdit = useSelector(selectTherapistIsEdit);
  const photoLoading = useSelector(selectIsLoading);

  const [StateSalutation, setStateSalutation] = useState({ value : `${Therapist[0].Salutation}`, label: `${Therapist[0].Salutation}` });
 
  useEffect(() => {
    setStateSalutation({ value : `${Therapist[0].Salutation}`, label: `${Therapist[0].Salutation}` });
  }, [Therapist]);



  const CountryList = AllCountries.map((item) => {
    return { value: item.CountryID, label: item.CountryName };
  });
  const StateList = AllStates?.map((state) => {
    return { value: state.StateID, label: state.StateName };
  });

  const [countryCode, setCountryCode] = useState("in");
  const [isPhotoChange, setIsPhotoChange] = useState(false);
  const [stateLoading, setStateLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    dispatch(getAllCountries());
  }, []);

  useEffect(() => {
    const DefaultCountry = CountryList?.find((option) => option.label === Therapist[0]?.Country);
    if (DefaultCountry !== undefined) handleCountryChange(DefaultCountry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AllCountries, Therapist]);

  useEffect(() => {
    if (StateList.length > 0) {
      const DefaultState = StateList?.find((option) => option.label === Therapist[0]?.State);
      setSelectedState(DefaultState);
      setFieldValue("State", DefaultState?.label);
    } else {
      setSelectedState("");
      setFieldValue("State", "");
    }
  }, [AllStates]);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    const { value, label } = country;
    setStateLoading(true);

    dispatch(getAllStates(value)).then(() => {
      setStateLoading(false);
    });
    setFieldValue("Country", label);
  };

  const onSubmit = async (values, actions) => {
    const valuesToSend = { ...values, Status: true };
    await dispatch(therapistUpdation(valuesToSend));
    actions.setSubmitting(false);
  };

  const uploadPhoto = async (Files) => {
    if (Files.length > 0) {
      setIsPhotoChange(true);
      let formData = new FormData();
      formData.append("imageFile", Files[0]);

      try {
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
        // handle result here
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, " ") : filename;

        setFieldValue("Photo", originalPromiseResult);
      } catch (err) {
        // handle error here
      }
    }
  };

  // Country search logic
  const customFilter = (option, searchText) => {
    if (option.label.toLowerCase().startsWith(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  return Therapist.length > 0 ? (
    <Formik initialValues={Therapist[0]} validationSchema={therapistValidation(1)} onSubmit={onSubmit} >
      {({ errors, touched, values, handleSubmit, handleBlur, setFieldValue }) => (
        <>
          <fieldset disabled={IsEdit ? false : true}>
            <Row>
              <Col lg='6'>
                <div className='mb-4'>

                  <Label className='form-label required' htmlFor='Salutation'>
                    Salutation
                  </Label>
                  {console.log("values >>>>",values.Salutation)}

                  <Field
                    component={Select}
                    options={salutationOption}
                    name="Salutation"
                    isDisabled={IsEdit ? false : true}
                    value ={StateSalutation}
                    id="Salutation"
                    placeholder="Enter Salutation"
                    onChange={(client) => {
                      setFieldValue("Salutation", client.value);
                      setStateSalutation({ "value": `${client.value}`, "label": `${client.value}` })
                    }}
                    styles={{
                      control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
                    }}
                  />
                  {errors.Salutation && touched.Salutation ? <ErrorMessage className='text-danger small' name='Salutation' component='div' /> : null}
                </div>
              </Col>
              <Col lg='6'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='full-name'>
                    Full Name
                  </Label>
                  <Field type='text' className='form-control' id='full-name' name='Name' placeholder='Enter full name' />
                  {errors.Name && touched.Name ? <ErrorMessage className='text-danger small' name='Name' component='div' /> : null}
                </div>
              </Col>
            </Row>

            <Row>
              <Col lg='6'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='email-id'>
                    Email ID
                  </Label>
                  <Field type='email' className='form-control' id='email-id' name='EmailId' placeholder='Enter email id' />
                  {errors.EmailId && touched.EmailId ? <ErrorMessage className='text-danger small' name='EmailId' component='div' /> : null}
                </div>
              </Col>
              <Col lg='6'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='Phone'>
                    Phone Number
                  </Label>
                  {/* <Field type='text' className='form-control' id='phone-number' name='Phone' placeholder='Enter phone number' /> */}

                  <Field
                    component={PhoneInput}
                    country={countryCode}
                    onChange={(value, country) => {
                      setCountryCode(country.countryCode);
                      setFieldValue("Phone", value);
                    }}
                    name='Phone'
                    value={values.Phone}
                    id='Phone'
                    placeholder='Enter phone Number'
                    inputClass='mr-auto border-0'
                    buttonClass='mr-auto border-0 bg-transparent'
                    containerClass='form-control d-flex align-items-center'
                    enableSearch={true}
                    validate={(value) => validateTherapistPhone(value, countryCode)}
                    onBlur={handleBlur}
                    inputProps={{
                      required: true,
                      id: "Phone",
                      autoComplete: "off",
                    }}
                  />
                  {errors.Phone && touched.Phone ? <ErrorMessage className='text-danger small' name='Phone' component='div' /> : null}
                </div>
              </Col>
            </Row>

            <div className='mb-4'>
              <Label className='form-label required' htmlFor='Photo'>
                Photo
              </Label>
              {IsEdit ? (
                <DropZoneForm multiFiles={false} fileData={uploadPhoto} isUploading={photoLoading} displayName={values?.Photo} />
              ) : (
                <div>
                  <Link href={Therapist[0]?.Photo} passHref>
                    {/* <Link href={Photo} passHref> */}
                    <a target='_blank' className='waves-effect waves-light m-1 btn-primary btn-sm'>
                      View Photo
                    </a>
                  </Link>
                </div>
              )}

              {errors.Photo && touched.Photo ? <ErrorMessage className='text-danger small' name='Photo' component='div' /> : null}
            </div>

            <h6 className='mb-3'>Address</h6>
            <Row>
              <Col lg='6'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='AddressLine1'>
                    Address Line 1
                  </Label>
                  <Field type='text' className='form-control' name='AddressLine1' id='AddressLine1' placeholder='Enter address line 1' />
                  {errors.AddressLine1 && touched.AddressLine1 ? <ErrorMessage className='text-danger small' name='AddressLine1' component='div' /> : null}
                </div>
              </Col>
              <Col lg='6'>
                <div className='mb-4'>
                  <Label className='form-label' htmlFor='AddressLine2'>
                    Address Line 2
                  </Label>
                  <Field type='text' className='form-control' id='AddressLine2' name='AddressLine2' placeholder='Enter address line 2' />
                  {errors.AddressLine2 && touched.AddressLine2 ? <ErrorMessage className='text-danger small' name='AddressLine2' component='div' /> : null}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg='6'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='Country'>
                    Country
                  </Label>
                  <Field
                    component={Select}
                    options={CountryList}
                    id='Country'
                    name='Country'
                    placeholder='Select'
                    isSearchable={true}
                    isDisabled={IsEdit ? false : true}
                    filterOption={customFilter}
                    value={selectedCountry}
                    onChange={(Country) => {
                      handleCountryChange(Country);
                    }}
                    styles={{
                      control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
                    }}
                  />

                  {errors.Country && touched.Country ? <ErrorMessage className='text-danger small' name='Country' component='div' /> : null}
                </div>
              </Col>
              <Col lg='6'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='State'>
                    State
                  </Label>
                  <Field
                    component={Select}
                    options={StateList}
                    id='State'
                    name='State'
                    isDisabled={IsEdit ? false : true}
                    value={selectedState}
                    placeholder='Select'
                    isSearchable={true}
                    onChange={(State) => {
                      setFieldValue("State", State.label);
                      setSelectedState(State);
                    }}
                    styles={{
                      control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
                    }}
                    isLoading={stateLoading}
                  />
                  {/* <Field type='text' className='form-control' id='State' name='State' placeholder='Enter state' /> */}

                  {errors.State && touched.State ? <ErrorMessage className='text-danger small' name='State' component='div' /> : null}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg='4'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='District'>
                    District
                  </Label>
                  <Field type='text' className='form-control' id='District' name='District' placeholder='Enter district' />
                  {errors.District && touched.District ? <ErrorMessage className='text-danger small' name='District' component='div' /> : null}
                </div>
              </Col>
              <Col lg='4'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='City'>
                    City
                  </Label>
                  <Field type='text' className='form-control' id='City' name='City' placeholder='Enter city' />
                  {errors.City && touched.City ? <ErrorMessage className='text-danger small' name='City' component='div' /> : null}
                </div>
              </Col>
              <Col lg='4'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='Pincode'>
                    Pin/Zip
                  </Label>
                  <Field type='text' className='form-control' id='Pincode' name='Pincode' placeholder='Enter zip/pin' />
                  {errors.Pincode && touched.Pincode ? <ErrorMessage className='text-danger small' name='Pincode' component='div' /> : null}
                </div>
              </Col>
            </Row>

            <Row>
              <Col lg='6'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='qualification'>
                    Qualification
                  </Label>
                  <Field type='text' className='form-control' id='qualification' name='Qualification' placeholder='Enter qualification' />
                  {errors.Qualification && touched.Qualification ? <ErrorMessage className='text-danger small' name='Qualification' component='div' /> : null}
                </div>
              </Col>
              <Col lg='6'>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='experience'>
                    Experience (Years)
                  </Label>
                  <Field type='number' className='form-control' id='experience' name='Experience' placeholder='Enter experience' />
                  {errors.Experience && touched.Experience ? <ErrorMessage className='text-danger small' name='Experience' component='div' /> : null}
                </div>
              </Col>
            </Row>
          </fieldset>
          <div className='container-action d-flex justify-content-end'>
            {/* <Button type='button' color='primary' className='btn-md waves-effect waves-light action_btn' onClick={() => dispatch(setEdit(true))}>
                Edit Details
              </Button> */}
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
export default TherapistBasicDetails;
