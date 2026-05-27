import { ErrorMessage, Field, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Button, Col, Label, Row } from "reactstrap";
import * as Yup from "yup";
import FileDropZoneForm from "../components/shared/filedropzoneform";
import Layout from "../components/shared/layout";
import PageTitle from "../components/shared/pagetitle";
import { ClientTypeList } from "../services/client.services";
import { getAllCountries, getAllStates, selectCountries, selectStates, uploadImage } from "../store/slice/common.slice";
import { changeBreadcrumb, changeTitle } from "../store/slice/layout.slice";
import { selectUserData } from "../store/slice/auth.slice";
import { clientUpdation, getClient, selectClient, selectIsLoading } from "../store/slice/client.slice";
import { getTherapist, selectTherapist, selectTherapistLoading, therapistUpdation } from "../store/slice/therapist.slice";
import { CenterDetails, SelectCenter, centerIsLoading, updateCenter } from "../store/slice/center.slice";
import FACILITATORS from "../constants/facilitators.constant";
import Loader from "../components/shared/loader";

const MyProfile = () => {
  const dispatch = useDispatch();
  const UserData = useSelector(selectUserData);
  const ClientData = useSelector(selectClient)[0]
  const CenterData = useSelector(CenterDetails)
  const TherapistData = useSelector(selectTherapist)[0]

  const clientLoading = useSelector(selectIsLoading)
  const CenterLoading = useSelector(centerIsLoading)
  const TherapistLoading = useSelector(selectTherapistLoading)


  useEffect(() => {
    dispatch(SelectCenter(UserData?.UserID));
    dispatch(getClient(UserData?.UserID));
  }, []);


  const [selectedBillingCountry, setSelectedBillingCountry] = useState([]);

  useEffect(() => {
    UserData?.RoleName === "Center" && dispatch(getClient(1));
    UserData?.RoleName === "Center" && dispatch(SelectCenter(1));
  }, []);

  useEffect(() => {
    UserData?.RoleName === "Therapist" && dispatch(getTherapist(1));
  }, []);

  useEffect(() => {
    dispatch(getTherapist(UserData?.UserID));
  }, [UserData]);


  useEffect(() => {
    UserData?.RoleName === "Center" ? setSelectedCountry({ label: CenterData?.Country, value: CenterData?.Country }) : setSelectedCountry({ label: ClientData?.Country, value: ClientData?.Country });
    setClientType({ value: ClientData?.ClientType, label: ClientData?.ClientType });
    setSelectedState({
      label: ClientData?.State,
    })
  }, [ClientData, CenterData]);

  useEffect(() => {
    setTherapistType({ value: TherapistData?.FacilitatorType, label: TherapistData?.FacilitatorType })
    UserData?.RoleName === "Center" ? setSelectedBillingCountry({ label: CenterData?.Country, value: CenterData?.Country }) : setSelectedBillingCountry({ label: TherapistData?.Country, value: TherapistData?.Country })
    UserData?.RoleName === "Center" ? setSelectedBillingState({ label: CenterData?.State }) : setSelectedBillingState({ label: TherapistData?.State, })
    UserData?.RoleName === "ClientAdmin" ? setSelectedBillingCountry({ label: ClientData?.BillingCountry, value: ClientData?.BillingCountry }) : undefined;
    UserData?.RoleName === "ClientAdmin" ? setSelectedBillingState({ label: ClientData?.BillingState }) : undefined;
  }, [TherapistData, CenterData]);

  const [TherapistType, setTherapistType] = useState();
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [ClientType, setClientType] = useState();

  useEffect(() => {
    const breadcrumb_Items = [{ title: "My Profile", link: "my-profile" }];
    dispatch(changeTitle("My Profile"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
  }, []);


  //setting countries
  useEffect(() => {
    dispatch(getAllCountries());
  }, []);
  const CountryList = useSelector(selectCountries);
  const [CountryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  useEffect(() => {
    const option = [];
    CountryList.map((country) => {
      option.push({ label: country.CountryName, value: country.CountryID });
    });
    setCountryOptions(option);
  }, [CountryList]);
  const handleCountryChange = (selectedValue, setFieldValue) => {
    setFieldValue("Country", selectedValue.value);
    setSelectedCountry(selectedValue);
  };

  // setting states
  useEffect(() => {
    dispatch(getAllStates(selectedCountry.value));
  }, [selectedCountry]);
  const StateList = useSelector(selectStates);
  const [StateOptions, setStateOptions] = useState({
    label: TherapistData?.State,
  });
  const [selectedState, setSelectedState] = useState([]);
  useEffect(() => {
    const option = [];
    StateList.map((state) => {
      option.push({ label: state.StateName, value: state.StateID });
    });
    setStateOptions(option);
  }, [StateList]);
  const handleStateChange = (selectedValue, setFieldValue) => {
    setFieldValue("State", selectedValue.value);
    setSelectedState(selectedValue);
  };

  // setting Billing country
  const handleBillCountryChange = (selectedValue, setFieldValue) => {
    setFieldValue("BillingCountry", selectedValue.value);
    setSelectedBillingCountry(selectedValue);
  };
  // setting Billing states

  useEffect(() => {
    dispatch(getAllStates(selectedBillingCountry.value));
  }, [selectedBillingCountry]);
  const [selectedBillingState, setSelectedBillingState] = useState([]);

  const ClientCertificate1DocumentFile = async (files, setFieldValue) => {
    if (files.length > 0) {
      setDocumentsLoading(true);

      let formData = new FormData();
      formData.append("imageFile", files[0]);

      try {
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, "-") : filename;
        await setFieldValue("RegistrationCertificateURL", nonSpaceName);
        setDocumentsLoading(false);
      } catch (rejectedValueOrSerializedError) {
        console.log(rejectedValueOrSerializedError);
        setDocumentsLoading(false);
      }
    }
  };

  const ClientCertificateDocumentFile = async (files, setFieldValue) => {
    if (files.length > 0) {
      setDocumentsLoading(true);

      let formData = new FormData();
      formData.append("imageFile", files[0]);

      try {
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, "-") : filename;
        await setFieldValue("IncorporationCertificateURL", nonSpaceName);
        setDocumentsLoading(false);
      } catch (rejectedValueOrSerializedError) {
        console.log(rejectedValueOrSerializedError);
        setDocumentsLoading(false);
      }
    }
  };

  const ClientLogoDocumentFile = async (files, setFieldValue) => {
    if (files.length > 0) {
      setDocumentsLoading(true);

      let formData = new FormData();
      formData.append("imageFile", files[0]);

      try {
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, "-") : filename;
        await setFieldValue("ClientLogo", nonSpaceName);
        setDocumentsLoading(false);
      } catch (rejectedValueOrSerializedError) {
        console.log(rejectedValueOrSerializedError);
        setDocumentsLoading(false);
      }
    }
  };

  const uploadDocumentFile = async (files, setFieldValue) => {
    if (files.length > 0) {
      setDocumentsLoading(true);

      let formData = new FormData();
      formData.append("imageFile", files[0]);

      try {
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, "-") : filename;
        await setFieldValue("Photo", nonSpaceName);
        setDocumentsLoading(false);
      } catch (rejectedValueOrSerializedError) {
        console.log(rejectedValueOrSerializedError);
        setDocumentsLoading(false);
      }
    }
  };

  const uploadTherapistDocumentFile = async (files, setFieldValue) => {
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


  const InitialValues = {
    ...ClientData, ...CenterData, ...TherapistData,
    TherapistAddressLine1: UserData?.RoleName === "Therapist" ? TherapistData?.AddressLine1 : CenterData?.AddressLine1,
    TherapistAddressLine2: UserData?.RoleName === "Therapist" ? TherapistData?.AddressLine2 : CenterData?.AddressLine2,
    TherapistCity: UserData?.RoleName === "Therapist" ? TherapistData?.City : CenterData?.City,
    TherapistDistrict: UserData?.RoleName === "Therapist" ? TherapistData?.District : CenterData?.District,
    TherapistPincode: UserData?.RoleName === "Therapist" ? TherapistData?.Pincode : CenterData?.Pincode,
    TherapistPhone: UserData?.RoleName === "Therapist" ? TherapistData?.Phone : CenterData?.Phone,
    TherapistCountry: UserData?.RoleName === "Therapist" ? TherapistData?.Country : CenterData?.Country,
    TherapistState: UserData?.RoleName === "Therapist" ? TherapistData?.State : CenterData?.State,
  };



  function validationSchema() {

    if (UserData.RoleName === "Therapist") {
      return Yup.object().shape({
        Salutation: Yup.string().matches("").required("Please select salutation"),
        Name: Yup.string().required("Please enter Therapist Name"),
        Designation: Yup.string().required("Please enter Designation"),
        Language: Yup.string().required("Please enter Language"),
        Photo: Yup.mixed().required("Please upload a Photo"),
        Qualification: Yup.string().required("Please enter Qualification"),
        Experience: Yup.number().required("Please enter Experience"),
        Profile: Yup.string().required("Required"),
        DocumentsURL: Yup.mixed().required("Please upload Document"),
        TherapistType: Yup.string().matches("").required("Please select a Facilitator"),
      });
    }

    if (UserData.RoleName === "ClientAdmin") {
      return Yup.object().shape({
        EmailId: Yup.string().email("Invalid email").required("Please enter Email"),
        Phone: Yup.string().required("Please enter Phone Number"),
        // Password: Yup.string().required("Please enter password"),
        AddressLine1: Yup.string().required("Please enter Address"),
        City: Yup.string().required("Please enter a City"),
        Pincode: Yup.string().required("Please enter Pincode"),
        State: Yup.string().matches("").required("Please select a State"),
        Country: Yup.string().matches("").required("Please select a Country"),
        ClientName: Yup.string().required("Please enter a client Name"),
        ClientLogo: Yup.mixed().required("Please upload client logo"),
        WebsiteURL: Yup.string()
          .matches(
            /^([H|h][T|t]{2}[P|p][S|s]?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
            "Invalid Website URL"
          )
          .nullable(),
        ClientType: Yup.string().matches("").required("Please select a client Type"),
        OrganizationType: Yup.string().required("Please select a organization Type"),
        ContactPersonName: Yup.string().required("Please enter a name"),
        ContactEmailId: Yup.string().email("Invalid email").required("Please enter an Email"),
        // ContactPhone: Yup.string().required("Contact Phone Required"),
        ContactPersonDesignation: Yup.string().required("Please enter the Designation"),
        IncorporationCertificateURL: Yup.string().required("Please upload incorporation certificate"),
        RegistrationCertificateURL: Yup.string().required("Please upload registration certificate"),
        BillingAddressLine1: Yup.string().required("Please enter address").nullable(),
        BillingCity: Yup.string().required("Please enter a city").nullable(),
        BillingPincode: Yup.string().required("Please enter pincode").nullable(),
        BillingState: Yup.string().matches("").required("Please select a state").nullable(),
        BillingCountry: Yup.string().matches("").required("Please select a country").nullable(),
        GSTNumber: Yup.string()
          .min(15, "GST Number must be 15 characters long!")
          .max(15, "GST Number must be 15 characters long!")
          .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number")
          .required("Please enter GST Number"),
        BankAccountNumber: Yup.string()
          .matches(/^[0-9\b]+$/, "Invalid account number")
          .min(9, "Too Short!")
          .max(18, "Too Long!")
          .nullable(),
        Bank: Yup.string().nullable(),
        Branch: Yup.string().nullable(),
        IFSCCode: Yup.string()
          .min(11, "IFSC Code must be 11 characters long!")
          .max(11, "IFSC Code must be 11 characters long!")
          .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code")
          .nullable(),
      });
    }

    if (UserData.RoleName === "Center") {
      return Yup.object().shape({
        CenterName: Yup.string().required("Center Name is required"),
        CenterType: Yup.string().required("Select one Center Type"),
        CenterHeadName: Yup.string().required("Center Head name is required"),
        CenterHeadEmailId: Yup.string().email("Invalid email").required("Email is required"),
        CenterHeadDesignation: Yup.string().required("Designation is required"),
        CenterHeadPhone: Yup.string().required("Phone number is required"),
      });
    }

  }


  const onSubmit = (values) => {
    if (UserData.RoleName === "Therapist") {
      const valueToSend = {
        "TherapistID": TherapistData.TherapistID,
        "Phone": values.TherapistPhone,
        "AddressLine1": values.TherapistAddressLine1,
        "AddressLine2": values.TherapistAddressLine2,
        "City": values.TherapistCity,
        "District": values.TherapistDistrict,
        "Pincode": values.TherapistPincode,
        "State": values.TherapistState,
        "Country": values.Country,
        "Status": values.Status,
        "Salutation": values.Salutation,
        "Name": values.Name,
        "Designation": values.Designation,
        "Language": values.Language,
        "Photo": values.Photo,
        "Qualification": values.Qualification,
        "Experience": values.Experience,
        "Profile": values.Profile,
        "DocumentsURL": values.DocumentsURL,
        "DepartmentID": TherapistData?.DepartmentID,
        "TherapistType": values.TherapistType,
        "FacilitatorType": values.TherapistType
      }
      dispatch(therapistUpdation(valueToSend))
    }

    if (UserData.RoleName === "Center") {
      const valueToSend = {
        "CenterID": CenterData.CenterID,
        "Phone": values.TherapistPhone,
        "AddressLine1": values.TherapistAddressLine1,
        "AddressLine2": values.TherapistAddressLine2,
        "City": values.TherapistCity,
        "District": values.TherapistDistrict,
        "Pincode": values.TherapistPincode,
        "State": values.TherapistState,
        "Country": values.TherapistCountry,
        "Status": values.Status,
        "CenterName": values.CenterName,
        "CenterType": values.CenterType,
        "CenterHeadSalutation": values.CenterHeadSalutation,
        "CenterHeadName": values.CenterHeadName,
        "CenterHeadDesignation": values.CenterHeadDesignation,
        "CenterHeadEmailId": values.CenterHeadEmailId,
        "CenterHeadPhone": values.CenterHeadPhone
      }
      dispatch(updateCenter(valueToSend))
    }

    if (UserData.RoleName === "ClientAdmin") {
      const valueToSend = {
        "ClientName": values.ClientName,
        "Phone": values.Phone,
        "AddressLine1": values.AddressLine1,
        "AddressLine2": values.AddressLine2,
        "City": values.City,
        "Pincode": values.Pincode,
        "State": values.State,
        "Country": values.Country,
        "Status": values.Status,
        "ClientLogo": values.ClientLogo,
        "WebsiteURL": values.WebsiteURL,
        "ClientType": values.ClientType,
        "OrganizationType": values.OrganizationType,
        "ContactPersonName": values.ContactPersonName,
        "ContactPersonDesignation": values.ContactPersonDesignation,
        "ContactEmailId": values.ContactEmailId,
        "IncorporationCertificateURL": values.IncorporationCertificateURL,
        "RegistrationCertificateURL": values.RegistrationCertificateURL,
        "UpdateSubscriptionPlan": false,
        "SubscriptionPlanId": values.SubscriptionPlanId,
        "SubscriptionPlanStatus": values.SubscriptionPlanStatus,
        "PaymentId": values.PaymentId,
        "BillingAddressLine1": values.BillingAddressLine1,
        "BillingAddressLine2": values.BillingAddressLine2,
        "BillingCity": values.BillingCity,
        "BillingDistrict": values.BillingDistrict,
        "BillingPincode": values.BillingPincode,
        "BillingState": values.BillingState,
        "BillingCountry": values.BillingCountry,
        "GSTNumber": values.GSTNumber,
        "Bank": values.Bank,
        "BankAccountNumber": values.BankAccountNumber,
        "Branch": values.Branch,
        "IFSCCode": values.IFSCCode
      }
      dispatch(clientUpdation(valueToSend))
    }
  };

  const loading = clientLoading || CenterLoading || TherapistLoading;

  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        <div className='page-content'>
          <PageTitle />
          <Formik initialValues={InitialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ touched, errors, handleSubmit, setFieldValue, values }) => (
              <div className='main_listing'>
                {/* ******************************  Client Users  ****************************** */}
                {UserData.RoleName === "ClientAdmin" && <>
                  {console.log("errors", errors)}
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='ClientName'>
                      Client Name
                    </Label>
                    <Field type='text' className='form-control' id='ClientName' name='ClientName' placeholder='Enter client name' />
                    {errors.ClientName && touched.ClientName ? <ErrorMessage className='text-danger small' name='ClientName' component='div' /> : null}
                  </div>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='ClientLogo'>
                      Client Logo
                    </Label>
                    <FileDropZoneForm multiFiles={false} name='ClientLogo' isUploading={documentsLoading} fileData={ClientLogoDocumentFile} displayName={ClientData?.ClientLogo} setFieldValue={setFieldValue} />
                    {errors.ClientLogo && touched.ClientLogo ? <ErrorMessage className='text-danger small' name='ClientLogo' component='div' /> : null}
                  </div>
                  <Row>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label ' htmlFor='WebsiteURL'>
                          Website URL
                        </Label>
                        <Field type='text' className='form-control' id='WebsiteURL' name='WebsiteURL' placeholder='Enter website url' />
                        {errors.WebsiteURL && touched.WebsiteURL ? <ErrorMessage className='text-danger small' name='WebsiteURL' component='div' /> : null}
                      </div>
                    </Col>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='ClientType'>
                          Client type
                        </Label>
                        <Field
                          component={Select}
                          options={ClientTypeList}
                          id='ClientType'
                          value={ClientType}
                          name='ClientType'
                          placeholder='Select client type'
                          onChange={(ClientType) => {
                            setFieldValue("ClientType", ClientType.value);
                            setClientType({ "value": ClientType.value, "label": ClientType.value })
                          }}
                          classNamePrefix='select2-selection'
                        />
                        {errors.ClientType && touched.ClientType ? <ErrorMessage className='text-danger small' name='ClientType' component='div' /> : null}
                      </div>
                    </Col>
                    <Col lg='4'>
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
                    </Col>
                  </Row>
                  <Row>
                    <Col md='6'>
                      <div className='mb-4'>
                        <Label className='form-label required'>Contact Person Name</Label>
                        <Field type='text' name='ContactPersonName' className='form-control' placeholder='Enter full name' />
                        {errors.ContactPersonName && touched.ContactPersonName ? <ErrorMessage className='text-danger small' name='ContactPersonName' component='div' /> : null}
                      </div>
                    </Col>
                    <Col md='6'>
                      <div className='mb-4'>
                        <Label className='form-label required'>Contact Person Designation</Label>
                        <Field type='text' name='ContactPersonDesignation' className='form-control' placeholder='Enter designation' />
                        {errors.ContactPersonDesignation && touched.ContactPersonDesignation ? <ErrorMessage className='text-danger small' name='ContactPersonDesignation' component='div' /> : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md='6'>
                      <div className='mb-4'>
                        <Label className='form-label required'>Contact Person Email ID</Label>
                        <Field type='text' name='ContactEmailId' className='form-control' placeholder='Enter email id' />
                        {errors.ContactEmailId && touched.ContactEmailId ? <ErrorMessage className='text-danger small' name='ContactEmailId' component='div' /> : null}
                      </div>
                    </Col>
                    {/* <Col md='6'>
                    <div className='mb-4'>
                      <Label className='form-label required'>Contact Person Phone Number</Label>
                      <Field type='text' name='ContactPhone' className='form-control' placeholder='Enter phone no' />
                      {errors.ContactPhone && touched.ContactPhone ? <ErrorMessage className='text-danger small' name='ContactPhone' component='div' /> : null}
                    </div>
                  </Col> */}
                  </Row>

                  <Row>
                    <Col md='6'>
                      <div className='mb-4'>
                        <Label className='form-label required'>Incorporation Certificate</Label>
                        <FileDropZoneForm multiFiles={false} name='IncorporationCertificateURL' isUploading={documentsLoading} fileData={ClientCertificateDocumentFile} displayName={ClientData?.IncorporationCertificateURL} setFieldValue={setFieldValue} />
                        {errors.IncorporationCertificateURL && touched.IncorporationCertificateURL ? (
                          <ErrorMessage className='text-danger small' name='IncorporationCertificateURL' component='div' />
                        ) : null}
                      </div>
                    </Col>
                    <Col md='6'>
                      <div className='mb-4'>
                        <Label className='form-label required'>Registration Certificate</Label>
                        <FileDropZoneForm multiFiles={false} name='IncorporationCertificateURL' isUploading={documentsLoading} fileData={ClientCertificate1DocumentFile} displayName={ClientData?.RegistrationCertificateURL} setFieldValue={setFieldValue} />
                        {errors.RegistrationCertificateURL && touched.RegistrationCertificateURL ? <ErrorMessage className='text-danger small' name='RegistrationCertificateURL' component='div' /> : null}
                      </div>
                    </Col>
                  </Row>
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
                    <Col lg='6'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='Phone'>
                          Phone
                        </Label>
                        <Field type='text' className='form-control' id='Phone' name='Phone' placeholder='Enter phone' />
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
                        <Label className='form-label required' htmlFor='Country'>
                          Country
                        </Label>
                        <Field
                          component={Select}
                          options={CountryOptions}
                          id='Country'
                          name='Country'
                          placeholder='Select country'
                          isSearchable={true}
                          value={selectedCountry}
                          onChange={(selectedValue) => {
                            handleCountryChange(selectedValue, setFieldValue);
                          }}
                          classNamePrefix='select2-selection'
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
                          options={StateOptions}
                          id='State'
                          name='State'
                          value={selectedState}
                          placeholder='Select state'
                          isSearchable={true}
                          onChange={(State) => {
                            handleStateChange(State, setFieldValue);
                          }}
                          classNamePrefix='select2-selection'
                        />
                        {errors.State && touched.State ? <ErrorMessage className='text-danger small' name='State' component='div' /> : null}
                      </div>
                    </Col>
                  </Row>
                  <h6 className='mb-3'>Billing Address</h6>
                  <Row>
                    <Col md='6'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='BillingAddressLine1'>
                          Address Line 1
                        </Label>
                        <Field type='text' className='form-control' id='BillingAddressLine1' name='BillingAddressLine1' placeholder='Enter address line 1' />
                        {errors.BillingAddressLine1 && touched.BillingAddressLine1 ? <ErrorMessage className='text-danger small' name='BillingAddressLine1' component='div' /> : null}
                      </div>
                    </Col>
                    <Col md='6'>
                      <div className='mb-4'>
                        <Label className='form-label' htmlFor='BillingAddressLine2'>
                          Address Line 2
                        </Label>
                        <Field type='text' className='form-control' id='BillingAddressLine2' name='BillingAddressLine2' placeholder='Enter address line 2' />
                        {errors.BillingAddressLine2 && touched.BillingAddressLine2 ? <ErrorMessage className='text-danger small' name='BillingAddressLine2' component='div' /> : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='BillingCity'>
                          City
                        </Label>
                        <Field type='text' className='form-control' id='BillingCity' name='BillingCity' placeholder='Enter city' />
                        {errors.BillingCity && touched.BillingCity ? <ErrorMessage className='text-danger small' name='BillingCity' component='div' /> : null}
                      </div>
                    </Col>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label' htmlFor='BillingDistrict'>
                          District
                        </Label>
                        <Field type='text' className='form-control' id='BillingDistrict' name='BillingDistrict' placeholder='Enter district' />
                        {errors.BillingDistrict && touched.BillingDistrict ? <ErrorMessage className='text-danger small' name='BillingDistrict' component='div' /> : null}
                      </div>
                    </Col>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='BillingPincode'>
                          Pin/Zip
                        </Label>
                        <Field type='text' className='form-control' id='BillingPincode' name='BillingPincode' placeholder='Enter zip/pin' />
                        {errors.BillingPincode && touched.BillingPincode ? <ErrorMessage className='text-danger small' name='BillingPincode' component='div' /> : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md='6'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='BillingCountry'>
                          Country
                        </Label>
                        <Field
                          component={Select}
                          options={CountryOptions}
                          id='BillingCountry'
                          name='BillingCountry'
                          placeholder='Select'
                          isSearchable={true}
                          value={selectedBillingCountry}
                          onChange={(Country) => {
                            handleBillCountryChange(Country, setFieldValue);
                          }}
                        />
                        {errors.BillingCountry && touched.BillingCountry ? <ErrorMessage className='text-danger small' name='BillingCountry' component='div' /> : null}
                      </div>
                    </Col>
                    <Col md='6'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='BillingState'>
                          State
                        </Label>
                        <Field
                          component={Select}
                          options={StateOptions}
                          value={selectedBillingState}
                          id='BillingState'
                          name='BillingState'
                          placeholder='Select billing state'
                          isSearchable={true}
                          onChange={(State) => {
                            setFieldValue("BillingState", State.label);
                            setSelectedBillingState(State);
                          }}
                        />

                        {errors.BillingState && touched.BillingState ? <ErrorMessage className='text-danger small' name='BillingState' component='div' /> : null}
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md='6'>
                      <div className='mb-4'>
                        <Label className='form-label required'>GST Number</Label>
                        <Field type='text' className='form-control' placeholder='Enter gst no' name='GSTNumber' />
                        {errors.GSTNumber && touched.GSTNumber ? <ErrorMessage className='text-danger small' name='GSTNumber' component='div' /> : null}
                      </div>
                    </Col>

                    <Col md='6'>
                      <div className='mb-4'>
                        <Label className='form-label'>Bank Account Number</Label>
                        <Field type='text' className='form-control' name='BankAccountNumber' placeholder='Enter account no' />
                        {errors.BankAccountNumber && touched.BankAccountNumber ? <ErrorMessage className='text-danger small' name='BankAccountNumber' component='div' /> : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md='4'>
                      <div className='mb-4'>
                        <Label className='form-label'>IFSC Code</Label>
                        <Field type='text' className='form-control' placeholder='Enter ifsc code' name='IFSCCode' />
                        {errors.IFSCCode && touched.IFSCCode ? <ErrorMessage className='text-danger small' name='IFSCCode' component='div' /> : null}
                      </div>
                    </Col>
                    <Col md='4'>
                      <div className='mb-4'>
                        <Label className='form-label'>Bank</Label>
                        <Field type='text' className='form-control' placeholder='Enter bank' name='Bank' />
                        {errors.Bank && touched.Bank ? <ErrorMessage className='text-danger small' name='Bank' component='div' /> : null}
                      </div>
                    </Col>
                    <Col md='4'>
                      <div className='mb-4'>
                        <Label className='form-label'>Bank Branch</Label>
                        <Field type='text' className='form-control' placeholder='Enter branch' name='Branch' />
                        {errors.Branch && touched.Branch ? <ErrorMessage className='text-danger small' name='Branch' component='div' /> : null}
                      </div>
                    </Col>
                  </Row>
                </>}
                {/* ******************************  Center Users  ****************************** */}
                {UserData.RoleName === "Center" && <>
                  <Row>
                    <Col lg='6'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='center-name'>
                          Center Name
                        </Label>
                        <Field type='text' name='CenterName' id='center-name' placeholder='Enter center name' className='form-control' />
                        {errors.CenterName && touched.CenterName ? <ErrorMessage className='text-danger small' name='CenterName' component='div' /> : null}
                      </div>
                    </Col>
                    <Col lg='6'>
                      <div className='mb-4'>
                        <Label className='form-label required mb-3'>Center Type</Label>
                        <div className='d-flex flex-wrap'>
                          <div className='custom-control custom-radio mb-2 mr-5'>
                            <Field type='radio' id='Association' name='CenterType' className='custom-control-Input form-check-input' value='Association' />
                            <Label className='custom-control-Label' htmlFor='Association'>
                              Association
                            </Label>
                          </div>
                          <div className='custom-control custom-radio mb-2 mx-5'>
                            <Field type='radio' id='Partner' name='CenterType' value='Partner' className='custom-control-Input form-check-input' />
                            <Label className='custom-control-Label' htmlFor='Partner'>
                              Partner
                            </Label>
                          </div>
                        </div>

                        {errors.CenterType && touched.CenterType ? <ErrorMessage className='text-danger small' name='CenterType' component='div' /> : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='name-input1'>
                          Center Head Salutation
                        </Label>
                        <Field type='text' name='CenterHeadSalutation' id='name-input1' className='form-control' placeholder='Enter Name ' />
                        {errors.CenterHeadSalutation && touched.CenterHeadSalutation ? <ErrorMessage className='text-danger small' name='CenterHeadSalutation' component='div' /> : null}
                      </div>
                    </Col>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='name-input1'>
                          Head of Center
                        </Label>
                        <Field type='text' name='CenterHeadName' id='name-input1' className='form-control' placeholder='Enter Name ' />
                        {errors.CenterHeadName && touched.CenterHeadName ? <ErrorMessage className='text-danger small' name='CenterHeadName' component='div' /> : null}
                      </div>
                    </Col>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='designation-input1'>
                          Designation
                        </Label>
                        <Field type='text' name='CenterHeadDesignation' id='designation-input1' className='form-control' placeholder='Enter designation ' />
                        {errors.CenterHeadDesignation && touched.CenterHeadDesignation ? <ErrorMessage className='text-danger small' name='CenterHeadDesignation' component='div' /> : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg='6'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='email-input2'>
                          Email
                        </Label>
                        <Field type='text' name='CenterHeadEmailId' id='email-input2' className='form-control' placeholder='Enter email' />
                        {errors.CenterHeadEmailId && touched.CenterHeadEmailId ? <ErrorMessage className='text-danger small' name='CenterHeadEmailId' component='div' /> : null}
                      </div>
                    </Col>
                    <Col lg='6'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='CenterHeadPhone'>
                          Phone number
                        </Label>
                        <Field type='text' className='form-control' name='CenterHeadPhone' placeholder='Enter Phone Number' />
                        {errors.CenterHeadPhone && touched.CenterHeadPhone ? <ErrorMessage className='text-danger small' name='CenterHeadPhone' component='div' /> : null}
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='BillingAddressLine1'>
                          Address Line 1
                        </Label>
                        <Field type='text' className='form-control' id='BillingAddressLine1' name='TherapistAddressLine1' placeholder='Enter address line 1' />
                        {errors.TherapistAddressLine1 && touched.TherapistAddressLine1 ? <ErrorMessage className='text-danger small' name='TherapistAddressLine1' component='div' /> : null}
                      </div>
                    </Col>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label' htmlFor='TherapistAddressLine2'>
                          Address Line 2
                        </Label>
                        <Field type='text' className='form-control' id='TherapistAddressLine2' name='TherapistAddressLine2' placeholder='Enter address line 2' />
                        {errors.TherapistAddressLine2 && touched.TherapistAddressLine2 ? <ErrorMessage className='text-danger small' name='TherapistAddressLine2' component='div' /> : null}
                      </div>
                    </Col>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='Phone'>
                          Phone
                        </Label>
                        <Field type='text' className='form-control' id='TherapistPhone' name='TherapistPhone' placeholder='Enter phone' />
                        {errors.TherapistPhone && touched.TherapistPhone ? <ErrorMessage className='text-danger small' name='TherapistPhone' component='div' /> : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='City'>
                          City
                        </Label>
                        <Field type='text' className='form-control' id='City' name='TherapistCity' placeholder='Enter city' />
                        {errors.TherapistCity && touched.TherapistCity ? <ErrorMessage className='text-danger small' name='TherapistCity' component='div' /> : null}
                      </div>
                    </Col>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='District'>
                          District
                        </Label>
                        <Field type='text' className='form-control' id='District' name='TherapistDistrict' placeholder='Enter district' />
                        {errors.TherapistDistrict && touched.TherapistDistrict ? <ErrorMessage className='text-danger small' name='TherapistDistrict' component='div' /> : null}
                      </div>
                    </Col>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='Pincode'>
                          Pin/Zip
                        </Label>
                        <Field type='text' className='form-control' id='TherapistPincode' name='TherapistPincode' placeholder='Enter zip/pin' />
                        {errors.TherapistPincode && touched.TherapistPincode ? <ErrorMessage className='text-danger small' name='TherapistPincode' component='div' /> : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md='6'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='BillingCountry'>
                          Country
                        </Label>
                        <Field
                          component={Select}
                          options={CountryOptions}
                          // defaultValue={DefaultCountry}
                          id='TherapistCountry'
                          name='TherapistCountry'
                          placeholder='Select'
                          isSearchable={true}
                          value={selectedBillingCountry}
                          onChange={(Country) => {
                            handleBillCountryChange(Country, setFieldValue);
                            setFieldValue("Country", Country.label);
                          }}
                        />
                        {errors.TherapistCountry && touched.TherapistCountry ? <ErrorMessage className='text-danger small' name='TherapistCountry' component='div' /> : null}
                      </div>
                    </Col>
                    <Col md='6'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='BillingState'>
                          State
                        </Label>
                        <Field
                          component={Select}
                          options={StateOptions}
                          value={selectedBillingState}
                          id='BillingState'
                          name='BillingState'
                          placeholder='Select billing state'
                          isSearchable={true}
                          onChange={(State) => {
                            setFieldValue("BillingState", State.label);
                            setSelectedBillingState(State);
                          }}
                        />
                        {errors.BillingState && touched.BillingState ? <ErrorMessage className='text-danger small' name='BillingState' component='div' /> : null}
                      </div>
                    </Col>
                  </Row>
                </>}
                {/* ******************************  Therapist Users  ****************************** */}
                {UserData.RoleName === "Therapist" && <>
                  <Row>
                    {console.log("errors", errors)}
                    <Col lg='6'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='salutation'>
                          Salutation
                        </Label>
                        <Field type='text' className='form-control' id='salutation' name='Salutation' placeholder='Enter salutation' />
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
                  <Row>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='BillingAddressLine1'>
                          Address Line 1
                        </Label>
                        <Field type='text' className='form-control' id='BillingAddressLine1' name='TherapistAddressLine1' placeholder='Enter address line 1' />
                        {errors.TherapistAddressLine1 && touched.TherapistAddressLine1 ? <ErrorMessage className='text-danger small' name='TherapistAddressLine1' component='div' /> : null}
                      </div>
                    </Col>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label' htmlFor='TherapistAddressLine2'>
                          Address Line 2
                        </Label>
                        <Field type='text' className='form-control' id='TherapistAddressLine2' name='TherapistAddressLine2' placeholder='Enter address line 2' />
                        {errors.TherapistAddressLine2 && touched.TherapistAddressLine2 ? <ErrorMessage className='text-danger small' name='TherapistAddressLine2' component='div' /> : null}
                      </div>
                    </Col>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='Phone'>
                          Phone
                        </Label>
                        <Field type='text' className='form-control' id='TherapistPhone' name='TherapistPhone' placeholder='Enter phone' />
                        {errors.TherapistPhone && touched.TherapistPhone ? <ErrorMessage className='text-danger small' name='TherapistPhone' component='div' /> : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='City'>
                          City
                        </Label>
                        <Field type='text' className='form-control' id='City' name='TherapistCity' placeholder='Enter city' />
                        {errors.TherapistCity && touched.TherapistCity ? <ErrorMessage className='text-danger small' name='TherapistCity' component='div' /> : null}
                      </div>
                    </Col>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='District'>
                          District
                        </Label>
                        <Field type='text' className='form-control' id='District' name='TherapistDistrict' placeholder='Enter district' />
                        {errors.TherapistDistrict && touched.TherapistDistrict ? <ErrorMessage className='text-danger small' name='TherapistDistrict' component='div' /> : null}
                      </div>
                    </Col>
                    <Col lg='4'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='Pincode'>
                          Pin/Zip
                        </Label>
                        <Field type='text' className='form-control' id='TherapistPincode' name='TherapistPincode' placeholder='Enter zip/pin' />
                        {errors.TherapistPincode && touched.TherapistPincode ? <ErrorMessage className='text-danger small' name='TherapistPincode' component='div' /> : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md='6'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='BillingCountry'>
                          Country
                        </Label>
                        <Field
                          component={Select}
                          options={CountryOptions}
                          // defaultValue={DefaultCountry}
                          id='TherapistCountry'
                          name='TherapistCountry'
                          placeholder='Select'
                          isSearchable={true}
                          value={selectedBillingCountry}
                          onChange={(Country) => {
                            handleBillCountryChange(Country, setFieldValue);
                            setFieldValue("Country", Country.label);
                          }}
                        />
                        {errors.TherapistCountry && touched.TherapistCountry ? <ErrorMessage className='text-danger small' name='TherapistCountry' component='div' /> : null}
                      </div>
                    </Col>
                    <Col md='6'>
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='BillingState'>
                          State
                        </Label>
                        <Field
                          component={Select}
                          options={StateOptions}
                          value={selectedBillingState}
                          id='TherapistState'
                          name='TherapistState'
                          placeholder='Select billing state'
                          isSearchable={true}
                          onChange={(State) => {
                            setFieldValue("TherapistState", State.label);
                            setSelectedBillingState(State);
                          }}
                        />
                        {errors.TherapistState && touched.TherapistState ? <ErrorMessage className='text-danger small' name='TherapistState' component='div' /> : null}
                      </div>
                    </Col>
                  </Row>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='photo'>
                      Photo
                    </Label>

                    <FileDropZoneForm multiFiles={false} name='Photo' isUploading={documentsLoading} fileData={uploadDocumentFile} displayName={TherapistData?.Photo} setFieldValue={setFieldValue} />
                    {errors.Photo && touched.Photo ? <ErrorMessage className='text-danger small' name='Photo' component='div' /> : null}
                  </div>
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
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='profile'>
                      Profile
                    </Label>

                    <Field as='textarea' className='form-control' id='profile' name='Profile' rows={3} />
                    {errors.Profile && touched.Profile ? <ErrorMessage className='text-danger small' name='Profile' component='div' /> : null}
                  </div>
                  <div className='mb-4'>
                    <Label className='form-label required'>Documents</Label>
                    <FileDropZoneForm multiFiles={false} name='DocumentsURL' isUploading={documentsLoading} fileData={uploadTherapistDocumentFile} displayName={TherapistData?.DocumentsURL} setFieldValue={setFieldValue} />
                    {errors.DocumentsURL && touched.DocumentsURL ? <ErrorMessage className='text-danger small' name='DocumentsURL' component='div' /> : null}
                  </div>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='TherapistType'>
                      Facilitator
                    </Label>
                    <Field
                      component={Select}
                      options={FACILITATORS}
                      id='TherapistType'
                      name='TherapistType'
                      placeholder='Select'
                      isSearchable={true}
                      value={TherapistType}
                      onChange={(therapist) => {
                        setFieldValue("TherapistType", therapist.value);
                        setTherapistType({ value: therapist.value, label: therapist.value })
                      }}
                    />
                    {errors.TherapistType && touched.TherapistType ? <ErrorMessage className='text-danger small' name='TherapistType' component='div' /> : null}
                  </div>
                </>}
                <div className='container-action d-flex justify-content-end px-3'>
                  <Button type='submit' color='primary' className='btn-md waves-effect waves-light action_btn' onClick={handleSubmit}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </Formik>
        </div>
      )}</Layout>
  );
};

export default MyProfile;
