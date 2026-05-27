import { ErrorMessage, Field, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Col, Label, Row } from "reactstrap";
import { ClientTypeList } from "../../../services/client.services";
import { getAllStates, selectCountries, selectIsLoading, selectStates, uploadImage } from "../../../store/slice/common.slice";
import DropZoneForm from "../../shared/dropzoneform";
import { validatePhone } from "../client-validation.component";

function BasicDetails() {
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
  const imageUploading = useSelector(selectIsLoading);
  const [countryCode, setCountryCode] = useState("in");
  const [stateLoading, setStateLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  useEffect(() => {
    if (values.EmailId !== "") {
      setFieldValue("UserName", values.EmailId);
    }
  }, [values.EmailId]);

  useEffect(() => {
    if (StateList.length === 0) {
      setSelectedState("");
    }

  }, [AllStates]);

  const uploadClientLogo = async (logoFiles) => {
    if (logoFiles.length > 0) {
      let formData = new FormData();
      formData.append("imageFile", logoFiles[0]);

      try {
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
        // handle result here
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, " ") : filename;
        setFieldValue("ClientLogo", originalPromiseResult);
      } catch (err) {
        // handle error here
        console.log(err);
      }
    }
  };

  const handleCountryChange = ({ value, label }) => {
    setStateLoading(true);

    dispatch(getAllStates(value)).then(() => {
      setStateLoading(false);
    });
    setFieldValue("Country", label);
    setFieldValue("State", "");
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
      <div className='mb-4'>
        <Label className='form-label required' htmlFor='ClientName'>
          Client Name
        </Label>
        <Field type='text' className='form-control' name='ClientName' id='ClientName' placeholder='Enter client name' />
        {errors.ClientName && touched.ClientName ? <ErrorMessage className='text-danger small' name='ClientName' component='div' /> : null}
      </div>

      <div className='mb-4'>
        <Label className='form-label required' htmlFor='ClientLogo'>
          Client Logo
        </Label>

        <DropZoneForm multiFiles={false} fileData={uploadClientLogo} isUploading={imageUploading} />

        {errors.ClientLogo && touched.ClientLogo ? <ErrorMessage className='text-danger small' name='ClientLogo' component='div' /> : null}
      </div>

      <Row>
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='EmailId'>
              Email ID
            </Label>
            <Field type='email' className='form-control' id='EmailId' name='EmailId' placeholder='Enter email id' />
            {errors.EmailId && touched.EmailId ? <ErrorMessage className='text-danger small' name='EmailId' component='div' /> : null}
          </div>
        </Col>

        <Col md='6'>
          <div className='mb-4'>
            <Label className='form-label required'>Phone Number</Label>

            <Field
              component={PhoneInput}
              country={countryCode}
              onChange={handleChangePhone}
              name='Phone'
              id='Phone'
              placeholder='Enter phone Number'
              inputClass='mr-auto border-0'
              className='form-control'
              buttonClass='mr-auto border-0 bg-transparent'
              containerClass='form-control d-flex align-items-center'
              enableSearch={true}
              validate={(value) => validatePhone(value, countryCode)}
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
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='City'>
              City
            </Label>
            <Field type='text' className='form-control' id='City' name='City' placeholder='Enter city' />
            {errors.City && touched.City ? <ErrorMessage className='text-danger small' name='City' component='div' /> : null}
          </div>
        </Col>
        <Col lg='6'>
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
            <Label className='form-label' htmlFor='WebsiteURL'>
              Website URL
            </Label>
            <Field type='text' className='form-control' id='WebsiteURL' name='WebsiteURL' placeholder='Enter url' />
            {errors.WebsiteURL && touched.WebsiteURL ? <ErrorMessage className='text-danger small' name='WebsiteURL' component='div' /> : null}
          </div>
        </Col>
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='ClientType'>
              Client type
            </Label>
            <Field
              component={Select}
              options={ClientTypeList}
              id='ClientType'
              name='ClientType'
              placeholder='Select'
              isSearchable={true}
              onChange={(ClientType) => {
                setFieldValue("ClientType", ClientType.value);
              }}
              styles={{
                control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
              }}
            />
            {errors.ClientType && touched.ClientType ? <ErrorMessage className='text-danger small' name='ClientType' component='div' /> : null}
          </div>
        </Col>
      </Row>
      <div className='mb-4'>
        <Label className='form-label required mb-3'>Organization Type</Label>
        <div className='d-flex flex-wrap'>
          <div className='custom-control custom-radio mb-2 mr-3'>
            <Field type='radio' id='Government' name='OrganizationType' className='custom-control-Input form-check-input' value='Government' />
            <Label className='custom-control-Label' htmlFor='Government'>
              Government
            </Label>
          </div>
          <div className='custom-control custom-radio mb-2 mr-3'>
            <Field type='radio' id='Private' name='OrganizationType' className='custom-control-Input form-check-input' value='Private' />
            <Label className='custom-control-Label' htmlFor='Private'>
              Private
            </Label>
          </div>
          <div className='custom-control custom-radio mb-2 mr-3'>
            <Field type='radio' id='NGO' name='OrganizationType' className='custom-control-Input form-check-input' value='NGO' />
            <Label className='custom-control-Label' htmlFor='NGO'>
              NGO
            </Label>
          </div>
        </div>
        {errors.OrganizationType && touched.OrganizationType ? <ErrorMessage className='text-danger small' name='OrganizationType' component='div' /> : null}
      </div>
    </>
  );
}
export default BasicDetails;
