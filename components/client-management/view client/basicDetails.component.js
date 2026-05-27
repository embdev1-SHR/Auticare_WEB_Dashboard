import { ErrorMessage, Field, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Label, Row } from "reactstrap";
import { selectClient, selectIsEdit } from "../../../store/slice/client.slice";
import { getAllCountries, getAllStates, selectCountries, selectStates, uploadImage } from "../../../store/slice/common.slice";
import DropZoneForm from "../../shared/dropzoneform";
import Loader from "../../shared/loader";
import { validatePhone } from "../client-validation.component";
import Link from "next/link";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { ClientTypeList } from "../../../services/client.services";

function BasicDetails() {
  // Grab values and setFieldValue from context
  const { setFieldValue, values, handleBlur, errors, touched } = useFormikContext();
  const dispatch = useDispatch();

  const client = useSelector(selectClient);
  const IsEdit = useSelector(selectIsEdit);
  const AllCountries = useSelector(selectCountries);
  const AllStates = useSelector(selectStates);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedState, setSelectedState] = useState({ value: null, label: "" });
  const [selectedCountry, setSelectedCountry] = useState("");
  const [stateLoading, setStateLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("in");
  const [isImageChange, setIsImageChange] = useState(false);

  const Logo = client[0]?.ClientLogo.indexOf(" ") >= 0 ? client[0]?.ClientLogo.replace(/ /g, "%20") : client[0]?.ClientLogo;

  // Country select options array
  const CountryList = AllCountries.map((item) => {
    return { value: item.CountryID, label: item.CountryName };
  });

  // State select options array
  const StateList = AllStates.map((state) => {
    return { value: state.StateID, label: state.StateName };
  });
  // Initial Client Type select option
  const DefaultClientType = ClientTypeList?.find((option) => option.value === client[0]?.ClientType);

  useEffect(() => {
    dispatch(getAllCountries());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (values.EmailId !== "") {
      setFieldValue("UserName", values.EmailId);
    }
  }, [setFieldValue, values.EmailId]);

  useEffect(() => {
    const DefaultCountry = CountryList?.find((option) => option.label === client[0]?.Country);
    if (DefaultCountry !== undefined) handleCountryChange(DefaultCountry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AllCountries, client]);

  useEffect(() => {
    if (client.length > 0) setPhoneNumber(client[0].Phone);
  }, [client]);

  useEffect(() => {
    if (StateList.length > 0) {
      const DefaultState = StateList?.find((option) => option.label === client[0]?.State);
      setSelectedState(DefaultState);
      setFieldValue("State", DefaultState?.label);
    } else {
      setSelectedState("");
      setFieldValue("State", "");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const uploadClientLogo = async (logoFiles) => {
    if (logoFiles.length > 0) {
      setIsImageChange(true);
      let formData = new FormData();
      formData.append("imageFile", logoFiles[0]);

      const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
      // handle result here
      const filename = originalPromiseResult.split("/").pop();
      const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, " ") : filename;

      setFieldValue("ClientLogo", originalPromiseResult);
      setIsImageChange(false);
    }
  };

  //Add your search logic here.
  const customFilter = (option, searchText) => {
    if (option.label.toLowerCase().startsWith(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  return client.length > 0 ? (
    <fieldset disabled={IsEdit ? false : true}>
      <div className='mb-4'>
        <Label className='form-label required' htmlFor='ClientName'>
          Client Name
        </Label>
        <Field type='text' className='form-control' name='ClientName' id='ClientName' placeholder='Enter client name' />
        {touched.ClientName && errors.ClientName ? <ErrorMessage className='text-danger small' name='ClientName' component='div' /> : null}
      </div>

      <div className='mb-4'>
        <Label className='form-label required' htmlFor='ClientLogo'>
          Client Logo
        </Label>
        {IsEdit ? (
          <DropZoneForm multiFiles={false} fileData={uploadClientLogo} isUploading={isImageChange} displayName={values?.ClientLogo} />
        ) : (
          <div>
            <Link href={Logo} passHref>
              <a target='_blank' className='waves-effect waves-light m-1 btn-primary btn-sm'>
                View Client Logo
              </a>
            </Link>


          </div>
        )}
        {touched.ClientLogo && errors.ClientLogo ? <ErrorMessage className='text-danger small' name='ClientLogo' component='div' /> : null}
      </div>

      <Row>
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='ClientID'>
              Client ID
            </Label>
            <Field type='text' className='form-control' id='ClientID' name='ClientID' disabled />
          </div>
        </Col>
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='EmailId'>
              Email ID
            </Label>
            <Field type='email' disabled={true} className='form-control' id='EmailId' name='EmailId' placeholder='Enter email id' />
            {touched.EmailId && errors.EmailId ? <ErrorMessage className='text-danger small' name='EmailId' component='div' /> : null}
          </div>
        </Col>
      </Row>

      <Row>
        <Col md='6'>
          <div className='mb-4'>
            <Label className='form-label required'>Phone Number</Label>
            <Field
              component={PhoneInput}
              country={countryCode}
              onChange={(value, country) => {
                setCountryCode(country.countryCode);
                setPhoneNumber(value);
                setFieldValue("Phone", value);
              }}
              onVal
              value={phoneNumber}
              name='Phone'
              id='Phone'
              placeholder='Enter phone Number'
              inputClass='mr-auto border-0'
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
            {touched.Phone && errors.Phone ? <ErrorMessage className='text-danger small' name='Phone' component='div' /> : null}
          </div>
        </Col>
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label' htmlFor='WebsiteURL'>
              Website URL
            </Label>
            <Field type='text' className='form-control' id='WebsiteURL' name='WebsiteURL' placeholder='Enter url' />
            {touched.WebsiteURL && errors.WebsiteURL ? <ErrorMessage className='text-danger small' name='WebsiteURL' component='div' /> : null}
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
            {touched.AddressLine1 && errors.AddressLine1 ? <ErrorMessage className='text-danger small' name='AddressLine1' component='div' /> : null}
          </div>
        </Col>
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label' htmlFor='AddressLine2'>
              Address Line 2
            </Label>
            <Field type='text' className='form-control' id='AddressLine2' name='AddressLine2' placeholder='Enter address line 2' />
            {touched.AddressLine2 && errors.AddressLine2 ? <ErrorMessage className='text-danger small' name='AddressLine2' component='div' /> : null}
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
              value={selectedCountry}
              isSearchable={true}
              filterOption={customFilter}
              isDisabled={IsEdit === null ? true : false}
              onChange={(Country) => {
                handleCountryChange(Country);
              }}
              styles={{
                control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
              }}
            />
            {touched.Country && errors.Country ? <ErrorMessage className='text-danger small' name='Country' component='div' /> : null}
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
              placeholder='Select'
              value={selectedState}
              isSearchable={true}
              onChange={(State) => {
                setFieldValue("State", State.label);
                setSelectedState(State);
              }}
              styles={{
                control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
              }}
              isLoading={stateLoading}
              isDisabled={IsEdit === null ? true : false}
            />
            {touched.State && errors.State ? <ErrorMessage className='text-danger small' name='State' component='div' /> : null}
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
            {touched.City && errors.City ? <ErrorMessage className='text-danger small' name='City' component='div' /> : null}
          </div>
        </Col>
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='Pincode'>
              Pin/Zip
            </Label>
            <Field type='text' className='form-control' id='Pincode' name='Pincode' placeholder='Enter zip/pin' />
            {touched.Pincode && errors.Pincode ? <ErrorMessage className='text-danger small' name='Pincode' component='div' /> : null}
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='ClientType'>
              Client type
            </Label>
            <Field
              component={Select}
              options={ClientTypeList}
              defaultValue={DefaultClientType}
              id='ClientType'
              name='ClientType'
              placeholder='Select'
              isSearchable={true}
              isDisabled={IsEdit === null ? true : false}
              onChange={(ClientType) => {
                setFieldValue("ClientType", ClientType.value);
              }}
              styles={{
                control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
              }}
            />

            {touched.ClientType && errors.ClientType ? <ErrorMessage className='text-danger small' name='ClientType' component='div' /> : null}
          </div>
        </Col>
        <Col lg='6'>
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
            {touched.OrganizationType && errors.OrganizationType ? <ErrorMessage className='text-danger small' name='OrganizationType' component='div' /> : null}
          </div>
        </Col>
      </Row>
    </fieldset>
  ) : (
    <Loader />
  );
}
export default BasicDetails;
