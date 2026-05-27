import "flatpickr/dist/flatpickr.css";
import { ErrorMessage, Field, useFormikContext } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { Col, Label, Row } from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import { getAllStates, selectCountries, selectStates } from "../../../store/slice/common.slice";
import { handleCountryStateSearch } from "../../shared/util.common-function";

function BasicDetails() {
  const dispatch = useDispatch();
  const { errors, touched, values, setFieldValue } = useFormikContext();
  const [dob, setDob] = useState("");
  useEffect(() => {
    if (dob !== "") {
      const calculatedAge = parseInt(moment().diff(dob, "years"), 10);
      setFieldValue("Age", calculatedAge);
    }
  }, [dob, setFieldValue]);

  //country and state
  const AllCountries = useSelector(selectCountries);
  const AllStates = useSelector(selectStates);

  const AllCountriesList = AllCountries?.map((country) => {
    return { value: country.CountryID, label: country.CountryName };
  });
  const AllStatesList = AllStates?.map((state) => {
    return { value: state.StateID, label: state.StateName };
  });

  const [stateLoading, setStateLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");

  const handleCountryChange = ({ value, label }) => {
    setStateLoading(true);

    dispatch(getAllStates(value)).then(() => {
      setStateLoading(false);
    });
    setFieldValue("Country", label);
  };

  const selectStyles = {
    control: (styles) => ({ ...styles, borderColor: " #e8eaed;" }),
  };
  return (
    <div>
      <div className='mb-4'>
        <Label className='form-label required' htmlFor='patient-name'>
          Patient Name
        </Label>
        <Field type='text' name='PatientName' id='patient-name' placeholder='Enter patient name' className='form-control' />
        {errors.PatientName && touched.PatientName ? <ErrorMessage className='text-danger small' name='PatientName' component='div' /> : null}
      </div>
      <Row>
        <Col lg='6'>
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
                setDob(res[0].toISOString().slice(0, 10));
                setFieldValue("DOB", res[0].toISOString().slice(0, 10));
              }}
              options={{
                altInput: true,
                altFormat: "j M, Y",
                dateFormat: "Y-m-d",
              }}
            />
            {errors.DOB && touched.DOB ? <ErrorMessage className='text-danger small' name='DOB' component='div' /> : null}
          </div>
        </Col>
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label ' htmlFor='age'>
              Age
            </Label>
            <Field type='number' name='Age' placeholder='Age' className='form-control' id='age' />
            {errors.Age && touched.Age ? <ErrorMessage className='text-danger small' name='Age' component='div' /> : null}
          </div>
        </Col>

        <Col>
          <div className='mb-4'>
            <Label className='form-label required mb-3'>Gender</Label>
            <div className='d-flex flex-wrap'>
              <div className='custom-control custom-radio mb-2 mr-3'>
                <Field type='radio' id='Male' name='Gender' className='custom-control-Input form-check-input' value='Male' />
                <Label className='custom-control-Label' htmlFor='Male'>
                  Male
                </Label>
              </div>
              <div className='custom-control custom-radio mb-2 mr-3'>
                <Field type='radio' id='Female' name='Gender' value='Female' className='custom-control-Input form-check-input' />
                <Label className='custom-control-Label' htmlFor='Female'>
                  Female
                </Label>
              </div>
            </div>
            {errors.Gender && touched.Gender ? <ErrorMessage className='text-danger small' name='Gender' component='div' /> : null}
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='addressLine1-input1'>
              Address line 1
            </Label>
            <Field type='text' name='AddressLine1' id='addressLine1-input1' placeholder='Enter address line 1' className='form-control' />
            {errors.AddressLine1 && touched.AddressLine1 ? <ErrorMessage className='text-danger small' name='AddressLine1' component='div' /> : null}
          </div>
        </Col>

        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='addressLine2-input1'>
              Address line 2
            </Label>
            <Field type='text' name='AddressLine2' id='addressLine2-input1' placeholder='Enter address line 2' className='form-control' />
            {errors.AddressLine2 && touched.AddressLine2 ? <ErrorMessage className='text-danger small' name='AddressLine2' component='div' /> : null}
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='city-input1'>
              City
            </Label>
            <Field type='text' name='City' id='city-input1' placeholder='Enter city ' className='form-control' />
            {errors.City && touched.City ? <ErrorMessage className='text-danger small' name='City' component='div' /> : null}
          </div>
        </Col>

        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='district'>
              District
            </Label>
            <Field type='text' name='District' id='district' placeholder='Enter district ' className='form-control' />
            {errors.District && touched.District ? <ErrorMessage className='text-danger small' name='District' component='div' /> : null}
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='country-input1'>
              Country
            </Label>
            <Field
              component={Select}
              options={AllCountriesList}
              id='country-input1'
              name='Country'
              placeholder='Select'
              isSearchable={true}
              filterOption={handleCountryStateSearch}
              onChange={(country) => {
                handleCountryChange(country);
                setSelectedState("");
                setFieldValue("State", "");
              }}
              styles={selectStyles}
            />

            {errors.Country && touched.Country ? <ErrorMessage className='text-danger small' name='Country' component='div' /> : null}
          </div>
        </Col>
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='state-input1'>
              State
            </Label>
            <Field
              component={Select}
              options={AllStatesList}
              id='state-input1'
              name='State'
              placeholder='Select'
              filterOption={handleCountryStateSearch}
              isSearchable={true}
              value={selectedState}
              isLoading={stateLoading}
              onChange={(state) => {
                setFieldValue("State", state.label);
                setSelectedState(state);
              }}
              styles={selectStyles}
            />
            {errors.State && touched.State ? <ErrorMessage className='text-danger small' name='State' component='div' /> : null}
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='pincode-input1'>
              Pincode
            </Label>
            <Field type='text' name='Pincode' id='pincode-input1' placeholder='Enter Pincode ' className='form-control' />
            {errors.Pincode && touched.Pincode ? <ErrorMessage className='text-danger small' name='Pincode' component='div' /> : null}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default BasicDetails;
