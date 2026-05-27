import { useEffect, useState } from "react";
import { Row, Col, Label } from "reactstrap";
import { Field, ErrorMessage } from "formik";
import { useFormikContext } from "formik";
import DropZoneForm from "../../shared/dropzoneform";
import { getAllStates, selectCountries, selectIsLoading, selectStates, uploadImage } from "../../../store/slice/common.slice";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { validateTherapistPhone } from "../therapist-validation";
import Select from "react-select";
import { salutationOption } from "../../content-management/common.content";

function TherapistBasicDetails() {
  // Grab errors and touched from context
  const { errors, touched, values, setFieldValue, handleBlur } = useFormikContext();
  const dispatch = useDispatch();
  const AllCountries = useSelector(selectCountries);
  const CountryList = AllCountries.map((item) => {
    return { value: item.CountryID, label: item.CountryName };
  });

  const AllStates = useSelector(selectStates);
  const StateList = AllStates?.map((state) => {
    return { value: state.StateID, label: state.StateName };
  });
  const [stateLoading, setStateLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const photoLoading = useSelector(selectIsLoading);
  const [countryCode, setCountryCode] = useState("in");

  useEffect(() => {
    if (values.EmailId !== "") {
      setFieldValue("UserName", values.EmailId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.EmailId]);

  useEffect(() => {
    if (StateList.length === 0) {
      setSelectedState("");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AllStates]);

  const handleCountryChange = ({ value, label }) => {
    setStateLoading(true);

    dispatch(getAllStates(value)).then(() => {
      setStateLoading(false);
    });
    setFieldValue("Country", label);
    setFieldValue("State", "");
  };

  const uploadPhoto = async (Files) => {
    if (Files.length > 0) {
      let formData = new FormData();
      formData.append("imageFile", Files[0]);

      try {
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
        // handle result here
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, " ") : filename;

        // console.log(filename);
        setFieldValue("Photo", originalPromiseResult);
      } catch (err) {
        // handle error here
        console.log(err);
      }
    }
  };
  const handleChangePhone = (value, country) => {
    setCountryCode(country.countryCode);
    setFieldValue("Phone", value);
  };

  // Country search logic
  const customFilter = (option, searchText) => {
    if (option.label.toLowerCase().startsWith(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <Row>
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='salutation'>
              Salutation
            </Label>
            <Field
              component={Select}
              options={salutationOption}
              id='salutation' 
              name='Salutation'
              placeholder="Enter salutation"
              onChange={(client) => {
                setFieldValue("Salutation", client.value);
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
            <Label className='form-label required' htmlFor='phone-number'>
              Phone Number
            </Label>
            {/* <Field type='text' className='form-control' id='phone-number' name='Phone' placeholder='Enter phone number' /> */}
            <Field
              component={PhoneInput}
              country={countryCode}
              onChange={handleChangePhone}
              name='Phone'
              // value={values.Phone}
              id='Phone'
              placeholder='Enter phone Number'
              inputClass='mr-auto border-0'
              className='form-control'
              buttonClass='mr-auto border-0 bg-transparent'
              containerClass='form-control d-flex align-items-center'
              enableSearch={true}
              validate={(value) => validateTherapistPhone(value, countryCode)}
              onBlur={handleBlur}
              inputProps={{
                required: true,
                id: "Phone",
              }}
            />
            {errors.Phone && touched.Phone ? <ErrorMessage className='text-danger small' name='Phone' component='div' /> : null}
          </div>
        </Col>
      </Row>

      <div className='mb-4'>
        <Label className='form-label required' htmlFor='photo'>
          Photo
        </Label>

        <DropZoneForm multiFiles={false} fileData={uploadPhoto} isUploading={photoLoading} />
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
              filterOption={customFilter}
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
    </>
  );
}
export default TherapistBasicDetails;
