import { ErrorMessage, Field, Formik } from "formik";

import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import * as Yup from "yup";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { getAllClients, selectClientList } from "../../store/slice/client.slice";
import {
  selectSetModalOpenState,
  setModalOpen,
} from "../../store/slice/layout.slice";
import { addPayment, paymentSliceIsLoading } from "../../store/slice/payment.slice";

function AddPayment() {
  const dispatch = useDispatch();
  const setModalOpenState = useSelector(selectSetModalOpenState);
  const ClientList = useSelector(selectClientList);
  const loading = useSelector(paymentSliceIsLoading);
  const tog_standard = () => {
    dispatch(setModalOpen(!setModalOpenState));
  };

  useEffect(() => {
    dispatch(getAllClients());
  }, [dispatch]);

  let values = ClientList.filter((e) => e.Status == 1);

  const list = values?.map((e) => ({ label: e.ClientName, value: e.ClientID }))
  const [selectedBillingState, setSelectedBillState] = useState([]);
  const validationSchema = Yup.object().shape({
    Client: Yup.number().required("Please select a Client"),
    Amount: Yup.number().test('len', 'Must be less than or equal to 11 digits', val => val && val.toString().length <= 11).required("Please enter an Amount"),
    PaymentDescription: Yup.string().min(2, "Too Short!").max(500, "Too Long!").required("Please enter a Description"),
  })

  const onSubmit = async (values) => {

    const valueToSend = {
      "ClientID": values.Client,
      "Amount": values.Amount,
      "Description": values.PaymentDescription,
      "PaymentType": values.PaymentType
    }
    dispatch(addPayment(valueToSend));
  };

  return (
    <>
      <Button
        type="button"
        onClick={tog_standard}
        color="primary"
        className="waves-effect eaves-light"
      >
        Add Payment
      </Button>
      <Formik initialValues={{
        PaymentType: "",
        Client: "",
        Amount: "",
        PaymentDescription: "",
      }} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
        {({ touched, errors, handleSubmit, resetForm, isSubmitting, setFieldValue, values }) => (
          <Modal
            isOpen={setModalOpenState}
            toggle={tog_standard}
            scrollable={true}
            className="modal right app_modal"
          >
            <ModalHeader toggle={() => dispatch(setModalOpen(!setModalOpenState))}>
              Add Payment
            </ModalHeader>
            <ModalBody>
              <div className="mb-4">
                <Label className="form-label required" htmlFor="payment-type">
                  Payment Type
                </Label>
                <div className="d-flex flex-wrap">
                  <div className="custom-control custom-radio mb-2 mr-3">
                    <Field
                      type="radio"
                      id="subscription"
                      name="PaymentType"
                      className="custom-control-Input mr-2 pb-2"
                      value="Subscription"
                    />
                    <Label className="custom-control-Label " htmlFor="subscription">
                      Subscription
                    </Label>
                  </div>
                  <div className="custom-control custom-radio mb-2 mr-3" >
                    <Field
                      type="radio"
                      id="teletherapy"
                      name="PaymentType"
                      className="custom-control-Input mr-2 pb-2"
                      value="TeleTherapy"
                    />
                    <Label className="custom-control-Label" for="teletherapy">
                      TeleTherapy
                    </Label>
                  </div>
                  <div className="custom-control custom-radio mb-2 mr-3">
                    <Field
                      type="radio"
                      id="product-payment"
                      name="PaymentType"
                      className="custom-control-Input mr-2 pb-2"
                      value="Product Payment"
                    />
                    <Label className="custom-control-Label" for="product-payment">
                      Product Payment
                    </Label>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <Label className="form-label required" htmlFor="client">
                  Client
                </Label>

                <Field
                  component={Select}
                  name="Client"
                  options={list}
                  value={selectedBillingState}
                  placeholder="Enter client name"
                  onChange={(e) => {
                    setFieldValue("Client", e.value);
                    setSelectedBillState(e);
                  }} />
                {errors.Client && touched.Client ? <ErrorMessage className='text-danger small' name='Client' component='div' /> : null}
              </div>
              <div className="mb-4">
                <Label className="form-label required" htmlFor="amount">
                  Amount
                </Label>
                <Field
                  type="text"
                  className="form-control"
                  id="amount"
                  name="Amount"
                  placeholder="Enter amount"
                />
                {errors.Amount && touched.Amount ? <ErrorMessage className='text-danger small' name='Amount' component='div' /> : null}
              </div>
              <div className="mb-4">
                <Label
                  className="form-label required"
                  htmlFor="payment-description"
                >
                  Payment Description
                </Label>
                <Field
                  type="text"
                  name="PaymentDescription"
                  className="form-control"
                  id="payment-description"
                  placeholder="Enter payment description"
                />
                {errors.PaymentDescription && touched.PaymentDescription ? <ErrorMessage className='text-danger small' name='PaymentDescription' component='div' /> : null}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type='submit'
                className="btn btn-primary btn-md waves-effect waves-light action_btn" disabled={loading} onClick={handleSubmit}>
                Submit
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
}

export default AddPayment;
