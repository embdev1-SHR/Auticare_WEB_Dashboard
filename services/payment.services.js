import Axios from "../util/api.util";

export const AddPaymentService = async (data) => {
    const result = await Axios.post(`/api/v1/payments`, data);
    return result;
};

export const fetchAllPaymentService = async () => {
    const result = await Axios.get(`/api/v1/payments`);
    return result;
};

export const ViewPaymentService = async (PaymentID) => {
    const result = await Axios.get(`/api/v1/payments/${PaymentID}`);
    return result;
};

export const updatePaymentService = async (data) => {
    const result = await Axios.put(`/api/v1/payments/${data.PaymentID}`, data.data);
    return result;
};