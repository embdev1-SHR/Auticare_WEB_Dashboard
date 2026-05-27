import "flatpickr/dist/flatpickr.css";
import { ErrorMessage, Field, Formik } from "formik";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
    Button,
    Label
} from "reactstrap";
import * as Yup from "yup";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import Pagetitle from "../../components/shared/pagetitle";
import { selectClientList } from "../../store/slice/client.slice";
import { IsEditPayment, PaymentDetails, PaymentListDetails, paymentSliceIsLoading, updatePayment } from "../../store/slice/payment.slice";


function PaymentReportsDetails() {

    const dispatch = useDispatch();
    const IsEdit = useSelector(IsEditPayment);
    const data = useSelector(PaymentListDetails);


    const loading = useSelector(paymentSliceIsLoading);
    const ClientList = useSelector(selectClientList);
    const router = useRouter();
    const { PaymentID } = router.query;
    const [dob, setDob] = useState("");
    const [selectedBillingState, setSelectedBillState] = useState();

    useEffect(() => {
        if (PaymentID !== undefined) { dispatch(PaymentDetails(PaymentID)); }
    }, [PaymentID]);

    const validationSchema = Yup.object().shape({
        Client: Yup.number().required("Please enter Client"),
        Amount: Yup.number().required("Please enter Amount"),
        PaymentDescription: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Please enter Payment Description"),
    })

    const OnSubmit = async (values) => {
        const data = {
            "ClientID": values.Client,
            "Amount": values.Amount,
            "Description": values.PaymentDescription,
            "PaymentType": values.PaymentType,
            "Status": 1
        }
        const valueToSend = {
            data,
            PaymentID
        }
        dispatch(updatePayment(valueToSend));
    };
    let values = ClientList.filter((e) => e.Status == 1);
    const list = values?.map((e) => ({ label: e.ClientName, value: e.ClientID }))
    useEffect(() => {
        setSelectedBillState({ label: data[0]?.ClientName, value: data[0]?.ClientID });
        setDob(data[0]?.Create_TS)
    }, [data]);

    function createFormatDate(date) {
        return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
    }

    return (
        <Layout>
            <div className="page-content">
                <Pagetitle />
                <div className="main_listing">
                    <div >
                        <>
                            {loading ? (
                                <Loader />
                            ) : (
                                <Formik initialValues={{
                                    Amount: data[0]?.Amount,
                                    PaymentDescription: data[0]?.Description,
                                    PaymentType: data[0]?.PaymentType,
                                    Client: selectedBillingState?.value
                                }} validationSchema={validationSchema} onSubmit={OnSubmit} enableReinitialize={true}>
                                    {({ touched, errors, handleSubmit, resetForm, setFieldTouched, isSubmitting, setFieldValue, values }) => (
                                        <>
                                            <>
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
                                                                disabled={!IsEdit}
                                                            />
                                                            <Label className="custom-control-Label" htmlFor="subscription">
                                                                Subscription
                                                            </Label>
                                                        </div>
                                                        <div className="custom-control custom-radio mb-2 mr-3">
                                                            <Field
                                                                type="radio"
                                                                id="teletherapy"
                                                                name="PaymentType"
                                                                className="custom-control-Input mr-2 pb-2"
                                                                value="TeleTherapy"
                                                                disabled={!IsEdit}
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
                                                                disabled={!IsEdit}
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
                                                        isDisabled={!IsEdit}
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
                                                        disabled={!IsEdit}
                                                    />
                                                    {errors.Amount && touched.Amount ? <ErrorMessage className='text-danger small' name='Amount' component='div' /> : null}
                                                </div>
                                                {!IsEdit && <div className="mb-4">
                                                    <Label className="form-label required" htmlFor="amount">
                                                        Created Date
                                                    </Label>
                                                    <Field
                                                        component={Flatpickr}
                                                        className='form-control'
                                                        name='DOB'
                                                        disabled={!IsEdit}
                                                        placeholder='Date of Birth'
                                                        value={dob}
                                                        onChange={(res) => {
                                                            setDob(res[0]?.toISOString().slice(0, 10));
                                                            setFieldValue("DOB", res[0] ? res[0].toISOString().slice(0, 10) : "");
                                                            setFieldTouched("DOB", true);
                                                        }}
                                                        options={{
                                                            altInput: true,
                                                            altFormat: "j M, Y",
                                                            dateFormat: "Y-m-d",
                                                        }}
                                                    />
                                                </div>}
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
                                                        disabled={!IsEdit}
                                                    />
                                                    {errors.PaymentDescription && touched.PaymentDescription ? <ErrorMessage className='text-danger small' name='PaymentDescription' component='div' /> : null}
                                                </div>
                                            </>
                                            {IsEdit && <Button type='submit' disabled={loading} color='primary' className='btn-md m-1 waves-effect waves-light action_btn' onClick={handleSubmit} >
                                                Submit
                                            </Button>}
                                        </>
                                    )}
                                </Formik>
                            )}
                        </>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default PaymentReportsDetails;
