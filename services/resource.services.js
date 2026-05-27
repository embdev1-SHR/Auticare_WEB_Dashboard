import Axios from "../util/api.util";

export const fetchAllResources = async () => {
    const result = await Axios.get(`/api/v1/freeResources`);
    return result;
};
export const AddResources = async (data) => {
    const result = await Axios.post(`/api/v1/freeResources`, data);
    return result;
};
export const ViewResources = async (FreeResourceID) => {
    const result = await Axios.get(`/api/v1/freeResources/${FreeResourceID}`);
    return result;
};

export const updateResourcesService = async (data) => {
    const result = await Axios.put(`/api/v1/freeResources/${data.FreeResourceID}`, data.data);
    return result;
};