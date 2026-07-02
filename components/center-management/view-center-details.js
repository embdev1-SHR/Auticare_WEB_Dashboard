import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Button, Col, Label, Row } from "reactstrap";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  CenterDetails,
  CenterDetailsLoading,
  SelectCenter,
  selectCenterIsEdit,
  setCenterEdit,
  updateCenter,
  regenerateCenterApiKey,
} from "../../store/slice/center.slice";
import {
  getAllStates,
  selectCountries,
  selectStates,
} from "../../store/slice/common.slice";
import Loader from "../shared/loader";
import {
  handleCountryStateSearch,
  validatePhone,
} from "../shared/util.common-function";
import CenterValidation from "./add-center/center-validation";
import { getAllClients, selectClientList } from "../../store/slice/client.slice";
import { selectUserData } from "../../store/slice/auth.slice";
import { salutationOption } from "../content-management/common.content";

function ViewCenterDetails() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { centerid } = router.query;

  const center = useSelector(CenterDetails);
  const isEdit = useSelector(selectCenterIsEdit);
  const isLoading = useSelector(CenterDetailsLoading);
  const AllCountries = useSelector(selectCountries);
  const UserData = useSelector(selectUserData);

  const AllStates = useSelector(selectStates);
  const [StateSalutation, setStateSalutation] = useState({ "value": `${center?.CenterHeadSalutation}`, "label": `${center?.CenterHeadSalutation}` });

  useEffect(() => {
    setStateSalutation({ "value": `${center?.CenterHeadSalutation}`, "label": `${center?.CenterHeadSalutation}` });
  }, [center]);



  const [countryCode, setCountryCode] = useState("in");
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const handleCopyApiKey = () => {
    if (center?.CenterApiKey) {
      navigator.clipboard.writeText(center.CenterApiKey);
      setApiKeyCopied(true);
      setTimeout(() => setApiKeyCopied(false), 2000);
    }
  };

  const handleRegenerateApiKey = async () => {
    if (window.confirm("Regenerate this center's API key? The old key will stop working immediately.")) {
      await dispatch(regenerateCenterApiKey(center.CenterID));
    }
  };
  const [initialValueSet, setInitialValueSet] = useState({ value: center?.ClientID, label: center?.ClientName });

  const clientID = useSelector(selectClientList);

  const LIstClientId = clientID.filter(
    (Client) => Client.Status == 1
  );

  const ClientIDList = LIstClientId.map((client) => {
    return { value: client.ClientID, label: client.ClientName };
  });

  useEffect(() => {
    dispatch(getAllClients());
  }, [dispatch]);


  const selectStyles = {
    control: (styles, { isDisabled }) => ({
      ...styles,
      borderColor: " #e8eaed;",
      color: isDisabled && "#292c39",
      backgroundColor: isDisabled ? "#f9fbff" : "white",
    }),
    singleValue: (styles) => ({ ...styles, color: "#292c39" }),
  };

  //handling State and Country
  const [stateLoading, setStateLoading] = useState(false);

  const [stateValue, setStateValue] = useState({});

  useEffect(() => {
    if (center) {
      setStateValue({ label: center.State });
    }
  }, [center]);
  const AllCountriesList = AllCountries?.map((country) => {
    return { value: country.CountryID, label: country.CountryName };
  });
  const AllStatesList = AllStates?.map((state) => {
    return { value: state.StateID, label: state.StateName };
  });

  const handleCountryChange = async (key) => {
    setStateLoading(true);

    await dispatch(getAllStates(key));

    AllStatesList && setStateLoading(false);
  };

  const DefaultCountry = AllCountriesList?.find(
    (option) => option.label === center?.Country
  );
  useEffect(() => {
    if (center?.Country) {
      handleCountryChange(DefaultCountry?.value);
    }
  }, [center?.Country]);

  const onCancel = async () => {
    await dispatch(setCenterEdit(false));
    await router.back();
  };

  const onSubmit = async (values) => {
    await dispatch(
      updateCenter({
        ...values,
        Phone: values.Phone.replace("+", ""),
        CenterHeadPhone: values.CenterHeadPhone.replace("+", ""),
        Status: true,
      })
    );
    await dispatch(SelectCenter(centerid));
  };

  return center == null || isLoading || Object.keys(center).length == 0 ? (
    <Loader />
  ) : (
    <div>
      <Formik
        initialValues={center}
        validationSchema={CenterValidation("default")}
        onSubmit={onSubmit}
      >
        {({
          touched,
          errors,
          values,
          setFieldValue,
          isSubmitting,
          handleSubmit,
          handleBlur,
        }) => (
          <>
            <Form>
              <div className="mb-4">
                <div className="container-action d-flex justify-content-between">
                  <h3 className="mb-3">
                    {isEdit ? "Edit Details" : "Center Details"}
                  </h3>
                </div>
                <Label
                  className={isEdit ? "form-label required" : "form-label"}
                  htmlFor="center-name"
                >
                  Center Name
                </Label>
                <Field
                  type="text"
                  name="CenterName"
                  id="center-name"
                  placeholder="Enter center name"
                  className="form-control"
                  disabled={isEdit === true ? false : true}
                />

                {errors.CenterName && touched.CenterName ? (
                  <ErrorMessage
                    className="text-danger small"
                    name="CenterName"
                    component="div"
                  />
                ) : null}
              </div>
              {!isEdit ? (
                <>
                  <Row>
                    <Col>
                      <div className="mb-4">
                        <Label className="form-label" htmlFor="center-id">
                          Center ID
                        </Label>
                        <Field
                          type="number"
                          name="CenterID"
                          className="form-control"
                          id="center-id"
                          disabled
                        />
                      </div>
                    </Col>
                    <Col>
                      <div className="mb-4">
                        <Label
                          className="form-label"
                          htmlFor="ClientID"
                        >
                          Client ID
                        </Label>
                        <Field disabled className="form-control" name="ClientID" />
                      </div>
                    </Col>
                    <Col>
                      <div className="mb-4">
                        <Label
                          className="form-label"
                          htmlFor="ClientName"
                        >
                          Client Name
                        </Label>
                        <Field disabled className="form-control" name="ClientName" />
                      </div>
                    </Col>
                  </Row>
                  {center?.CenterApiKey && (
                    <Row>
                      <Col>
                        <div className="mb-4">
                          <Label className="form-label">Center API Key</Label>
                          <div className="d-flex align-items-center gap-2">
                            <input
                              type="text"
                              readOnly
                              value={center.CenterApiKey}
                              className="form-control font-monospace"
                              style={{ fontSize: "0.8rem", letterSpacing: "0.03em" }}
                            />
                            <Button
                              color="secondary"
                              size="sm"
                              onClick={handleCopyApiKey}
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {apiKeyCopied ? "Copied!" : "Copy"}
                            </Button>
                            {UserData?.RoleName === "SuperAdmin" && (
                              <Button
                                color="warning"
                                size="sm"
                                onClick={handleRegenerateApiKey}
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Regenerate
                              </Button>
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  )}
                </>
              ) : UserData.RoleName === "SuperAdmin" ?
                  // <div className="mb-4">
                  //   <Label className="form-label required" htmlFor="Client-ID">
                  //     Client
                  //   </Label>
                  //   <Field
                  //     component={Select}
                  //     options={ClientIDList}
                  //     id="Client-ID"
                  //     name="ClientID"
                  //     placeholder="Select"
                  //     isSearchable={true}
                  //     filterOption={handleCountryStateSearch}
                  //     value={initialValueSet}
                  //     onChange={(client) => {
                  //       handleCountryChange(client.value);
                  //       setFieldValue("ClientID", client.value);
                  //       setFieldValue("ClientName", client.label);
                  //       setInitialValueSet({ value: client.value, label: client.label })
                  //     }}
                  //     styles={selectStyles}
                  //   />
                  //   {errors.ClientID && touched.ClientID ? (
                  //     <ErrorMessage
                  //       className="text-danger small"
                  //       name="ClientID"
                  //       component="div"
                  //     />
                  //   ) : null}
                  // </div> 
                  null
                  : null}
              <Row>
                <Col lg="6">
                  <div className="mb-4">
                    <Label className="form-label" htmlFor="email-id">
                      Email ID
                    </Label>
                    <Field
                      type="email"
                      name="EmailId"
                      id="email-id"
                      placeholder="Enter email id"
                      className="form-control"
                      disabled
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
                <Col>
                  <div className="mb-4">
                    <Label
                      className={
                        isEdit ? "form-label required mb-3" : "form-label mb-3"
                      }
                    >
                      Center Type
                    </Label>
                    <div className="d-flex flex-wrap">
                      <div className="custom-control custom-radio mb-2 mr-3">
                        <Field
                          type="radio"
                          id="Association"
                          name="CenterType"
                          className="custom-control-Input form-check-input"
                          value="Association"
                          disabled={isEdit === true ? false : true}
                        />
                        <Label
                          className="custom-control-Label"
                          htmlFor="Association"
                        >
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
                          disabled={isEdit === true ? false : true}
                        />
                        <Label
                          className="custom-control-Label"
                          htmlFor="Partner"
                        >
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
                      className={isEdit ? "form-label required" : "form-label"}
                      htmlFor="addressLine1-input1"
                    >
                      Address line 1
                    </Label>
                    <Field
                      type="text"
                      name="AddressLine1"
                      id="addressLine1-input1"
                      placeholder="Enter address line 1"
                      className="form-control"
                      disabled={isEdit === true ? false : true}
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
                      className={isEdit ? "form-label required" : "form-label"}
                      htmlFor="addressLine2-input1"
                    >
                      Address line 2
                    </Label>
                    <Field
                      type="text"
                      name="AddressLine2"
                      id="addressLine2-input1"
                      placeholder="Enter address line 2"
                      className="form-control"
                      disabled={isEdit === true ? false : true}
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
                    <Label
                      className={isEdit ? "form-label required" : "form-label"}
                      htmlFor="city-input1"
                    >
                      City
                    </Label>
                    <Field
                      type="text"
                      name="City"
                      id="city-input1"
                      placeholder="Enter city "
                      className="form-control"
                      disabled={isEdit === true ? false : true}
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
                    <Label
                      className={isEdit ? "form-label required" : "form-label"}
                      htmlFor="district-input"
                    >
                      District
                    </Label>
                    <Field
                      type="text"
                      name="District"
                      id="district-input"
                      placeholder="Enter district"
                      className="form-control"
                      disabled={isEdit === true ? false : true}
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
                    <Label
                      className={isEdit ? "form-label required" : "form-label"}
                      htmlFor="country-input1"
                    >
                      Country
                    </Label>
                    <Field
                      component={Select}
                      options={AllCountriesList}
                      defaultValue={DefaultCountry}
                      id="country-input1"
                      name="Country"
                      placeholder="Select country"
                      isSearchable={true}
                      filterOption={handleCountryStateSearch}
                      onChange={(country) => {
                        handleCountryChange(country.value);
                        setStateValue("");
                        setFieldValue("State", "");
                        setFieldValue("Country", country.label);
                      }}
                      styles={selectStyles}
                      isDisabled={isEdit === true ? false : true}
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
                    <Label
                      className={isEdit ? "form-label required" : "form-label"}
                      htmlFor="state-input1"
                    >
                      State
                    </Label>
                    <Field
                      component={Select}
                      options={AllStatesList}
                      value={stateValue}
                      id="state-input1"
                      name="State"
                      placeholder="Select state"
                      isSearchable={true}
                      filterOption={handleCountryStateSearch}
                      isLoading={stateLoading}
                      onChange={(state) => {
                        setFieldValue("State", state.label);
                        setStateValue(state);
                      }}
                      styles={selectStyles}
                      isDisabled={isEdit === true ? false : true}
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
                    <Label
                      className={isEdit ? "form-label required" : "form-label"}
                      htmlFor="pincode-input1"
                    >
                      Pincode
                    </Label>
                    <Field
                      type="text"
                      name="Pincode"
                      id="pincode-input1"
                      placeholder="Enter Pincode "
                      className="form-control"
                      disabled={isEdit === true ? false : true}
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
                    <Label
                      className={isEdit ? "form-label required" : "form-label"}
                      htmlFor="Phone"
                    >
                      Phone Number
                    </Label>
                    <Field
                      component={PhoneInput}
                      country={countryCode}
                      onChange={(value) => setFieldValue("Phone", value)}
                      name="Phone"
                      value={values.Phone}
                      id="phonenumber-input"
                      placeholder="Enter Phone Number"
                      inputClass="mr-auto border-0"
                      className={!isEdit && "form-control"}
                      buttonClass="mr-auto border-0 bg-transparent"
                      containerClass="form-control d-flex align-items-center"
                      disabled={isEdit === true ? false : true}
                      onBlur={handleBlur}
                      validate={(value) => validatePhone(value, countryCode)}
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
              <h6 className="mb-3">Center Head Details</h6>
              <Row>
                <Col lg="6">
                  <div className="mb-4">
                    <Label
                      className={isEdit ? "form-label required" : "form-label"}
                      htmlFor="salutation"
                    >
                      Salutation
                    </Label>

                    <Field
                      component={Select}
                      options={salutationOption}
                      name="CenterHeadSalutation"
                      id="salutation"
                      isDisabled={isEdit === true ? false : true}
                      value={StateSalutation}
                      placeholder="Enter salutation"
                      onChange={(client) => {
                        setFieldValue("CenterHeadSalutation", client.value);
                        setStateSalutation({ "value": `${client.value}`, "label": `${client.value}` })
                      }}
                      styles={{
                        control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
                      }}
                    />
                    {errors.CenterHeadSalutation &&
                      touched.CenterHeadSalutation ? (
                      <ErrorMessage
                        className="text-danger small"
                        name="CenterHeadSalutation"
                        component="div"
                      />
                    ) : null}
                  </div>
                </Col>
                <Col lg="6">
                  <div className="mb-4">
                    <Label
                      className={isEdit ? "form-label required" : "form-label"}
                      htmlFor="name-input1"
                    >
                      Name
                    </Label>
                    <Field
                      type="text"
                      name="CenterHeadName"
                      id="name-input1"
                      className="form-control"
                      placeholder="Enter Name "
                      disabled={isEdit === true ? false : true}
                    />
                    {errors.CenterHeadName && touched.CenterHeadName ? (
                      <ErrorMessage
                        className="text-danger small"
                        name="CenterHeadName"
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
                      className={isEdit ? "form-label required" : "form-label"}
                      htmlFor="designation-input1"
                    >
                      Designation
                    </Label>
                    <Field
                      type="text"
                      name="CenterHeadDesignation"
                      id="designation-input1"
                      className="form-control"
                      placeholder="Enter designation "
                      disabled={isEdit === true ? false : true}
                    />
                    {errors.CenterHeadDesignation &&
                      touched.CenterHeadDesignation ? (
                      <ErrorMessage
                        className="text-danger small"
                        name="CenterHeadDesignation"
                        component="div"
                      />
                    ) : null}
                  </div>
                </Col>
                <Col lg="6">
                  <div className="mb-4">
                    <Label
                      className={isEdit ? "form-label required" : "form-label"}
                      htmlFor="centerHeadEmailId"
                    >
                      Email
                    </Label>
                    <Field
                      type="text"
                      name="CenterHeadEmailId"
                      id="centerHeadEmailId"
                      className="form-control"
                      placeholder="Enter Email"
                      disabled={isEdit === true ? false : true}
                    />
                    {errors.CenterHeadEmailId && touched.CenterHeadEmailId ? (
                      <ErrorMessage
                        className="text-danger small"
                        name="CenterHeadEmailId"
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
                      className={isEdit ? "form-label required" : "form-label"}
                      htmlFor="phonenumber-input"
                    >
                      Phone number
                    </Label>
                    <Field
                      component={PhoneInput}
                      country={countryCode}
                      onChange={(value) =>
                        setFieldValue("CenterHeadPhone", value)
                      }
                      name="CenterHeadPhone"
                      value={values.CenterHeadPhone}
                      id="phonenumber-input"
                      placeholder="Enter Phone Number"
                      inputClass="mr-auto border-0"
                      className={!isEdit && "form-control"}
                      buttonClass="mr-auto border-0 bg-transparent"
                      containerClass="form-control d-flex align-items-center"
                      disabled={isEdit === true ? false : true}
                      onBlur={handleBlur}
                      validate={(value) => validatePhone(value, countryCode)}
                      inputProps={{
                        required: true,
                        id: "CenterHeadPhone",
                      }}
                      alwaysDefaultMask={false}
                    />

                    {errors.CenterHeadPhone && touched.CenterHeadPhone ? (
                      <ErrorMessage
                        className="text-danger small"
                        name="CenterHeadPhone"
                        component="div"
                      />
                    ) : null}
                  </div>
                </Col>
              </Row>

              <ul
                className="pager wizard twitter-bs-wizard-pager-link w-100"
                style={{ listStyle: "none" }}
              >
                <li className={"submit"}>
                  {isEdit ? (
                    <>
                      <Button
                        onClick={onCancel}
                        color="primary"
                        className="btn-md m-1 waves-effect waves-light action_btn"
                      >
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        color="primary"
                        className="btn-md m-1 waves-effect waves-light action_btn"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      color="secondary"
                      className="btn-md waves-effect waves-light action_btn"
                      onClick={() => router.back()}
                    >
                      Back
                    </Button>
                  )}
                </li>
              </ul>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default ViewCenterDetails;
