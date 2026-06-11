import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Col, Label, Row } from "reactstrap";
import {
  handleCountryStateSearch,
  validatePhone,
} from "../../shared/util.common-function";

import { ErrorMessage, Field, useFormikContext } from "formik";

import { useDispatch, useSelector } from "react-redux";
import { selectClientList } from "../../../store/slice/client.slice";
import {
  getAllStates,
  selectCountries,
  selectStates,
} from "../../../store/slice/common.slice";

import Select from "react-select";
import { selectRoleBasedModules } from "../../../store/slice/auth.slice";

function CenterDetails({ activeTab }) {
  const dispatch = useDispatch();

  const clientID = useSelector(selectClientList);
  const roleBasedModules = useSelector(selectRoleBasedModules);

  const LIstClientId = clientID.filter(
    (Client) => Client.Status == 1
  );


  const ClientIDList = LIstClientId.map((client) => {
    return { value: client.ClientID, label: client.ClientName };
  });


  const { errors, touched, setFieldValue, values, handleBlur } =
    useFormikContext();
  const [countryCode, setCountryCode] = useState("in");

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
      <div className="mb-4">
        <Label className="form-label required" htmlFor="center-name">
          Center Name
        </Label>
        <Field
          type="text"
          name="CenterName"
          id="center-name"
          placeholder="Enter center name"
          className="form-control"
        />
        {errors.CenterName && touched.CenterName ? (
          <ErrorMessage
            className="text-danger small"
            name="CenterName"
            component="div"
          />
        ) : null}
      </div>
      <Row>
        <Col lg="4">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="email-id">
              Email ID
            </Label>
            <Field
              type="email"
              name="EmailId"
              id="email-id"
              placeholder="Enter Email ID"
              className="form-control"
            />
            {errors.EmailId && touched.EmailId ? (
              <ErrorMessage
                className="text-danger small"
                name="EmailId"
                component="div"
              />
            ) : null}
          </div>
        </Col>
        {roleBasedModules.some(
          (module) => module.ModuleName === "ClientManagement"
        ) ? (
          <Col lg="4">
            <div className="mb-4">
              <Label className="form-label required" htmlFor="Client-ID">
                Client
              </Label>
              <Field
                component={Select}
                options={ClientIDList}
                id="Client-ID"
                name="ClientID"
                placeholder="Select"
                isSearchable={true}
                filterOption={handleCountryStateSearch}
                onChange={(client) => {
                  handleCountryChange(client.value);
                  setFieldValue("ClientID", client.value);
                }}
                styles={selectStyles}
              />

              {errors.ClientID && touched.ClientID ? (
                <ErrorMessage
                  className="text-danger small"
                  name="ClientID"
                  component="div"
                />
              ) : null}
            </div>
          </Col>
        ) : null}
        <Col lg="4">
          <div className="mb-4">
            <Label className="form-label required mb-3">Center Type</Label>
            <div className="d-flex flex-wrap">
              <div className="custom-control custom-radio mb-2 mr-3">
                <Field
                  type="radio"
                  id="Association"
                  name="CenterType"
                  className="custom-control-Input form-check-input"
                  value="Association"
                />
                <Label className="custom-control-Label" htmlFor="Association">
                  Association
                </Label>
              </div>
              <div className="custom-control custom-radio mb-2 mr-3">
                <Field
                  type="radio"
                  id="Partner"
                  name="CenterType"
                  value="Partner"
                  className="custom-control-Input form-check-input"
                />
                <Label className="custom-control-Label" htmlFor="Partner">
                  Partner
                </Label>
              </div>
            </div>

            {errors.CenterType && touched.CenterType ? (
              <ErrorMessage
                className="text-danger small"
                name="CenterType"
                component="div"
              />
            ) : null}
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label
              className="form-label required"
              htmlFor="addressLine1-input1"
            >
              Address 1
            </Label>
            <Field
              type="text"
              name="AddressLine1"
              id="addressLine1-input1"
              placeholder="Enter address line 1"
              className="form-control"
            />
            {errors.AddressLine1 && touched.AddressLine1 ? (
              <ErrorMessage
                className="text-danger small"
                name="AddressLine1"
                component="div"
              />
            ) : null}
          </div>
        </Col>

        <Col lg="6">
          <div className="mb-4">
            <Label
              className="form-label required"
              htmlFor="addressLine2-input1"
            >
              Address 2
            </Label>
            <Field
              type="text"
              name="AddressLine2"
              id="addressLine2-input1"
              placeholder="Enter address line 2"
              className="form-control"
            />
            {errors.AddressLine2 && touched.AddressLine2 ? (
              <ErrorMessage
                className="text-danger small"
                name="AddressLine2"
                component="div"
              />
            ) : null}
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="city-input1">
              City
            </Label>
            <Field
              type="text"
              name="City"
              id="city-input1"
              placeholder="Enter city"
              className="form-control"
            />
            {errors.City && touched.City ? (
              <ErrorMessage
                className="text-danger small"
                name="City"
                component="div"
              />
            ) : null}
          </div>
        </Col>

        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="district-input">
              District
            </Label>
            <Field
              type="text"
              name="District"
              id="district-input"
              placeholder="Enter district"
              className="form-control"
            />
            {errors.District && touched.District ? (
              <ErrorMessage
                className="text-danger small"
                name="District"
                component="div"
              />
            ) : null}
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="country-input1">
              Country
            </Label>
            <Field
              component={Select}
              options={AllCountriesList}
              id="country-input1"
              name="Country"
              placeholder="Select"
              filterOption={handleCountryStateSearch}
              isSearchable={true}
              onChange={(country) => {
                handleCountryChange(country);
                setSelectedState("");
                setFieldValue("State", "");
              }}
              styles={selectStyles}
            />

            {errors.Country && touched.Country ? (
              <ErrorMessage
                className="text-danger small"
                name="Country"
                component="div"
              />
            ) : null}
          </div>
        </Col>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="state-input1">
              State
            </Label>
            <Field
              component={Select}
              options={AllStatesList}
              id="state-input1"
              name="State"
              placeholder="Select"
              filterOption={handleCountryStateSearch}
              isSearchable={true}
              // className="form-control"
              value={selectedState}
              isLoading={stateLoading}
              onChange={(state) => {
                setFieldValue("State", state.label);
                setSelectedState(state);
              }}
              styles={selectStyles}
            />
            {errors.State && touched.State ? (
              <ErrorMessage
                className="text-danger small"
                name="State"
                component="div"
              />
            ) : null}
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="Password">Password</Label>
            <Field type="password" name="Password" id="Password" placeholder="Enter password (min 6 chars)" className="form-control" />
            {errors.Password && touched.Password ? (
              <ErrorMessage className="text-danger small" name="Password" component="div" />
            ) : null}
          </div>
        </Col>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="ConfirmPassword">Confirm Password</Label>
            <Field type="password" name="ConfirmPassword" id="ConfirmPassword" placeholder="Re-enter password" className="form-control" />
            {errors.ConfirmPassword && touched.ConfirmPassword ? (
              <ErrorMessage className="text-danger small" name="ConfirmPassword" component="div" />
            ) : null}
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="pincode-input1">
              Pincode
            </Label>
            <Field
              type="text"
              name="Pincode"
              id="pincode-input1"
              placeholder="Enter Pincode "
              className="form-control"
            />
            {errors.Pincode && touched.Pincode ? (
              <ErrorMessage
                className="text-danger small"
                name="Pincode"
                component="div"
              />
            ) : null}
          </div>
        </Col>

        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="Phone">
              PhoneNumber
            </Label>
            <Field
              component={PhoneInput}
              country={countryCode}
              onChange={(value) => {
                setFieldValue("Phone", value);
              }}
              name="Phone"
              placeholder="Enter Phone Number"
              inputClass="mr-auto border-0"
              buttonClass="mr-auto border-0 bg-transparent"
              containerClass="form-control d-flex align-items-center"
              onBlur={handleBlur}
              validate={(value) =>
                activeTab === 1 && validatePhone(value, countryCode)
              }
              inputProps={{
                required: true,
                id: "Phone",
              }}
              alwaysDefaultMask={false}
            />

            {errors.Phone && touched.Phone ? (
              <ErrorMessage
                className="text-danger small"
                name="Phone"
                component="div"
              />
            ) : null}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default CenterDetails;
