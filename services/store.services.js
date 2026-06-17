import Axios from "../util/api.util";

export const storeEnquiryListService = async () => {
    const result = await Axios.get(`/api/v1/storeEnquiries`);
    return result;
};

export const MarkAsReadService = async (data) => {
    const result = await Axios.put(`/api/v1/storeEnquiries/${data.StoreEnquiryID}`, data.payload);
    return result;
};

export const storeCreation = async (data) => {
    const result = await Axios.post(`/api/v1/storeEnquiries`, data);
    return result;
};

export const AtStoreListService = async () => {
    const result = await Axios.get(`/api/v1/products`);
    return result;
};

export const AtStoreCreation = async (data) => {
    const result = await Axios.post(`/api/v1/products`, data);
    return result;
};

export const AtStoreDetailsService = async (ProductID) => {
    const result = await Axios.get(`/api/v1/products/${ProductID}`);
    return result;
};

export const DeleteStoreEnquiryService = async (StoreEnquiryID) => {
    const result = await Axios.delete(`/api/v1/storeEnquiries/${StoreEnquiryID}`);
    return result;
};

export const AtStoreUpdateService = async (data) => {
    const result = await Axios.put(`/api/v1/products/${data.ProductID}`, data);
    return result;
};

export const AtStoreDeleteService = async (ProductID) => {
    const result = await Axios.delete(`/api/v1/products/${ProductID}`);
    return result;
};

export const AtStoreBulkCreateService = async (products) => {
    const result = await Axios.post(`/api/v1/products/bulk`, { products });
    return result;
};

export const storeOrderListService = async () => {
    const result = await Axios.get(`/api/v1/storeOrders`);
    return result;
};

export const storeOrderCreateService = async (data) => {
    const result = await Axios.post(`/api/v1/storeOrders`, data);
    return result;
};

export const storeOrderUpdateService = async (data) => {
    const result = await Axios.put(`/api/v1/storeOrders/${data.StoreOrderID}`, { OrderStatus: data.OrderStatus });
    return result;
};

export const storeOrderDeleteService = async (StoreOrderID) => {
    const result = await Axios.delete(`/api/v1/storeOrders/${StoreOrderID}`);
    return result;
};
