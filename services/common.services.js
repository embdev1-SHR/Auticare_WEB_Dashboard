import Axios from "../util/api.util";

export const fetchAllCountries = async () => {
  const result = await Axios.get(`/api/v1/others/Countries`);
  return result;
};
export const fetchAllRegion = async () => {
  const result = await Axios.get(`/api/v1/regions`);
  return result;
};
export const fetchAllStates = async (CountryID) => {
  const result = await Axios.get(`/api/v1/others/States/${CountryID}`);
  return result;
};

export const imageUpload = async (formData) => {
  // Do NOT set Content-Type manually — axios detects FormData and sets multipart/form-data
  // with the correct boundary automatically. Manual override loses the boundary and breaks multer.
  const result = await Axios.post(`/api/v1/others/ImageUpload`, formData);
  return result;
};

export const fetchDashboard = async () => {
  const result = await Axios.get(`/api/v1/others/dashboard`);
  return result;
};
