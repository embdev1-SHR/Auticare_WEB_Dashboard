import { ErrorMessage, Field, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Col, Input, Label, Row } from "reactstrap";
import { selectClient, selectIsEdit } from "../../../store/slice/client.slice";
import { getAllCountries, getAllStates, selectCountries, selectStates } from "../../../store/slice/common.slice";
import { getAllSubscriptionPlans, selectSubscriptionPlans } from "../../../store/slice/subscription.slice";
import Loader from "../../shared/loader";

function BillingDetails() {
  const dispatch = useDispatch();

  // Grab values and setFieldValue from context
  const { setFieldValue, values, handleBlur, errors, touched } = useFormikContext();
  // Selectors
  const client = useSelector(selectClient);
  const IsEdit = useSelector(selectIsEdit);
  const AllPlans = useSelector(selectSubscriptionPlans);
  const AllCountries = useSelector(selectCountries);
  const AllStates = useSelector(selectStates);
  const [checked, setChecked] = useState(false);



  const [stateLoading, setStateLoading] = useState(false);
  const [selectedBillState, setSelectedBillState] = useState("");
  const [selectedBillingCountry, setSelectedBillingCountry] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState("");


  // Country select options array
  const CountryList = AllCountries.map((item) => {
    return { value: item.CountryID, label: item.CountryName };
  });

  // State select options array
  const StateList = AllStates.map((state) => {
    return { value: state.StateID, label: state.StateName };
  });

  // Subsription select options array
  const SubscriptionList = AllPlans.map((plans) => {
    return { value: plans.SubscriptionPlanID, label: plans.PlanName };
  });

  useEffect(() => {
    dispatch(getAllCountries());
    dispatch(getAllSubscriptionPlans());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const DefaultCountry = CountryList?.find((option) => option.label === client[0]?.BillingCountry);
    if (DefaultCountry !== undefined) handleCountryChange(DefaultCountry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AllCountries, client]);

  useEffect(() => {
    const DefaultPlan = SubscriptionList?.find((option) => option.value === client[0]?.SubscriptionPlanId);
    setSelectedSubscription(DefaultPlan);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AllPlans, client]);

  useEffect(() => {
    if (StateList.length > 0) {
      const DefaultState = StateList?.find((option) => option.label === client[0]?.BillingState);
      setSelectedBillState(DefaultState !== undefined ? DefaultState : "");
      setFieldValue("BillingState", DefaultState !== undefined ? DefaultState.label : "");
    } else {
      setSelectedBillState("");
      setFieldValue("BillingState", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AllStates, client]);

  // Country dropdown search logic
  const customFilter = (option, searchText) => {
    if (option.label.toLowerCase().startsWith(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  // Country onChange Handler
  const handleCountryChange = (country) => {
    setSelectedBillingCountry(country);

    const { value, label } = country;
    setStateLoading(true);

    dispatch(getAllStates(value)).then(() => {
      setStateLoading(false);
    });
    setFieldValue("BillingCountry", label);
  };

  return client.length > 0 ? (
    <fieldset disabled={IsEdit ? false : true}>
      {/* <h6 className='mb-3'>Billing Address</h6> */}
      <Row>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="BillingAddressLine1">
              Address Line 1
            </Label>
            <Field type="text" className="form-control" id="BillingAddressLine1" name="BillingAddressLine1" placeholder="Enter address line 1" />
            {errors.BillingAddressLine1 && touched.BillingAddressLine1 ? (
              <ErrorMessage className="text-danger small" name="BillingAddressLine1" component="div" />
            ) : null}
          </div>
        </Col>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label" htmlFor="BillingAddressLine2">
              Address Line 2
            </Label>
            <Field type="text" className="form-control" id="BillingAddressLine2" name="BillingAddressLine2" placeholder="Enter address line 2" />
            {errors.BillingAddressLine2 && touched.BillingAddressLine2 ? (
              <ErrorMessage className="text-danger small" name="BillingAddressLine2" component="div" />
            ) : null}
          </div>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="BillingCountry">
              Country
            </Label>
            <Field
              component={Select}
              options={CountryList}
              id="BillingCountry"
              name="BillingCountry"
              placeholder="Select"
              isSearchable={true}
              isDisabled={IsEdit === null ? true : false}
              filterOption={customFilter}
              value={selectedBillingCountry}
              onChange={handleCountryChange}
              styles={{
                control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),

              }}
            />
            {errors.BillingCountry && touched.BillingCountry ? <ErrorMessage className="text-danger small" name="BillingCountry" component="div" /> : null}
          </div>
        </Col>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="BillingState">
              State
            </Label>
            <Field
              component={Select}
              options={StateList}
              value={selectedBillState}
              isDisabled={IsEdit === null ? true : false}
              id="BillingState"
              name="BillingState"
              placeholder="Select"
              isSearchable={true}
              onChange={(State) => {
                setFieldValue("BillingState", State.label);
                setSelectedBillState(State);
              }}
              styles={{
                control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
              }}
              isLoading={stateLoading}
            />
            {errors.BillingState && touched.BillingState ? <ErrorMessage className="text-danger small" name="BillingState" component="div" /> : null}
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="BillingCity">
              City
            </Label>
            <Field type="text" className="form-control" id="BillingCity" name="BillingCity" placeholder="Enter city" />
            {errors.BillingCity && touched.BillingCity ? <ErrorMessage className="text-danger small" name="BillingCity" component="div" /> : null}
          </div>
        </Col>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label" htmlFor="BillingDistrict">
              District
            </Label>
            <Field type="text" className="form-control" id="BillingDistrict" name="BillingDistrict" placeholder="Enter district" />
            {errors.BillingDistrict && touched.BillingDistrict ? <ErrorMessage className="text-danger small" name="BillingDistrict" component="div" /> : null}
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="BillingPincode">
              Pin/Zip
            </Label>
            <Field type="text" className="form-control" id="BillingPincode" name="BillingPincode" placeholder="Enter zip/pin" />
            {errors.BillingPincode && touched.BillingPincode ? <ErrorMessage className="text-danger small" name="BillingPincode" component="div" /> : null}
          </div>
        </Col>

        <Col md="6">
          <div className="mb-4">
            <Label className="form-label required">GST Number</Label>
            <Field type="text" className="form-control" placeholder="Enter gst no" name="GSTNumber" />
            {errors.GSTNumber && touched.GSTNumber ? <ErrorMessage className="text-danger small" name="GSTNumber" component="div" /> : null}
          </div>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label">Bank Account Number</Label>
            <Field type="text" className="form-control" name="BankAccountNumber" placeholder="Enter account no" />
            {errors.BankAccountNumber && touched.BankAccountNumber ? (
              <ErrorMessage className="text-danger small" name="BankAccountNumber" component="div" />
            ) : null}
          </div>
        </Col>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label">IFSC Code</Label>
            <Field type="text" className="form-control" placeholder="Enter ifsc code" name="IFSCCode" />
            {errors.IFSCCode && touched.IFSCCode ? <ErrorMessage className="text-danger small" name="IFSCCode" component="div" /> : null}
          </div>
        </Col>
      </Row>
      {!IsEdit ? false : true &&
        <>
          <Row>
            <Col md="6">
              <div className="mb-4">
                <Label className="form-label">Bank</Label>
                <Field type="text" className="form-control" placeholder="Enter bank" name="Bank" />
                {errors.Bank && touched.Bank ? <ErrorMessage className="text-danger small" name="Bank" component="div" /> : null}
              </div>
            </Col>
            <Col md="6">
              <div className="mb-4">
                <Label className="form-label">Bank Branch</Label>
                <Field type="text" className="form-control" placeholder="Enter branch" name="Branch" />
                {errors.Branch && touched.Branch ? <ErrorMessage className="text-danger small" name="Branch" component="div" /> : null}
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="3">
              <div className="form-check form-check-inline" style={{ paddingTop: "10%" }}>
                <Label className="form-label pr-3">Update Subscription Plan</Label>
                <Input className='p-2 form-check-input' type='checkbox' id="UpdateSubscriptionPlan"
                  name="UpdateSubscriptionPlan"
                  checked={checked}
                  onChange={e => setChecked(e.target.checked)} />
                {errors.UpdateSubscriptionPlan && touched.UpdateSubscriptionPlan ? (
                  <ErrorMessage className="text-danger small" name="UpdateSubscriptionPlan" component="div" />
                ) : null}
              </div>
            </Col>
            <Col md="9">
              <div className="mb-4" >
                <Label className="form-label required">Subscription Plan</Label>
                <Field
                  component={Select}
                  options={SubscriptionList}
                  id="SubscriptionPlanId"
                  name="SubscriptionPlanId"
                  placeholder="Select"
                  isDisabled={IsEdit && !checked ? true : false}
                  isSearchable={true}
                  value={selectedSubscription}
                  onChange={(plan) => {
                    setFieldValue("SubscriptionPlanId", plan.value);
                    setSelectedSubscription(plan);
                  }}
                  styles={{
                    control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
                  }}
                />

                {errors.SubscriptionPlanId && touched.SubscriptionPlanId ? (
                  <ErrorMessage className="text-danger small" name="SubscriptionPlanId" component="div" />
                ) : null}
              </div>
            </Col>
          </Row>
        </>
      }
      {IsEdit ? false : true &&
        <Row>
          <Col md="4">
            <div className="mb-4">
              <Label className="form-label">Bank</Label>
              <Field type="text" className="form-control" placeholder="Enter bank" name="Bank" />
              {errors.Bank && touched.Bank ? <ErrorMessage className="text-danger small" name="Bank" component="div" /> : null}
            </div>
          </Col>
          <Col md="4">
            <div className="mb-4">
              <Label className="form-label">Bank Branch</Label>
              <Field type="text" className="form-control" placeholder="Enter branch" name="Branch" />
              {errors.Branch && touched.Branch ? <ErrorMessage className="text-danger small" name="Branch" component="div" /> : null}
            </div>
          </Col>
          <Col md="4">
            <div className="mb-4">
              <Label className="form-label required">Subscription Plan</Label>
              <Field
                component={Select}
                options={SubscriptionList}
                id="SubscriptionPlanId"
                name="SubscriptionPlanId"
                placeholder="Select"
                isSearchable={true}
                isDisabled={IsEdit === null ? true : false}
                value={selectedSubscription}
                onChange={(plan) => {
                  setFieldValue("SubscriptionPlanId", plan.value);
                  setSelectedSubscription(plan);
                }}
                styles={{
                  control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
                }}
              />
              {errors.SubscriptionPlanId && touched.SubscriptionPlanId ? (
                <ErrorMessage className="text-danger small" name="SubscriptionPlanId" component="div" />
              ) : null}
            </div>
          </Col>
        </Row>
      }
      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="SubscriptionPlanStatus">
              Payment Status
            </Label>
            <Field
              type="text"
              className="form-control"
              id="SubscriptionPlanStatus"
              name="SubscriptionPlanStatus"
              placeholder="Enter subscription plan payment status"
            />
            {errors.SubscriptionPlanStatus && touched.SubscriptionPlanStatus ? (
              <ErrorMessage className="text-danger small" name="SubscriptionPlanStatus" component="div" />
            ) : null}
          </div>
        </Col>
        <Col md="6">
          <div className="mb-4">
            <Label className="form-label required">Payment Id</Label>
            <Field type="text" className="form-control" placeholder="Enter payment ID" name="PaymentId" />
            {errors.PaymentId && touched.PaymentId ? <ErrorMessage className="text-danger small" name="PaymentId" component="div" /> : null}
          </div>
        </Col>
      </Row>
    </fieldset>
  ) : (
    <Loader />
  );
}
export default BillingDetails;
