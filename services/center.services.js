import Axios from "../util/api.util";

export const fetchAllCentersService = async () => {
  const result = await Axios.get(`/api/v1/centers`);
  return result;
};

export const createCenterService = async (data) => {
  const result = await Axios.post(`/api/v1/centers`, data);
  return result;
};
export const updateCenterService = async ({ ...data }) => {
  const result = await Axios.put(`/api/v1/centers/${data.CenterID}`, data);
  return result;
};
export const deleteCenterService = async (CenterID) => {
  const result = await Axios.delete(`/api/v1/centers/${CenterID}`);
  return result;
};
export const centerDetailsService = async (CenterID) => {
  const result = await Axios.get(`/api/v1/centers/${CenterID}`);
  return result;
};
export const searchCenterService = async (CenterName) => {
  const result = await Axios.post(`/api/v1/centers/search`,CenterName);
  return result;
};
