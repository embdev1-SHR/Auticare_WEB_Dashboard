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
  // Explicitly remove Content-Type in transformRequest so the browser sets
  // multipart/form-data with the correct boundary — axios instance default
  // (application/json) would otherwise override it and break multer.
  const result = await Axios.post(`/api/v1/others/ImageUpload`, formData, {
    transformRequest: [(data, headers) => {
      delete headers["Content-Type"];
      return data;
    }],
  });
  return result;
};

export const fetchDashboard = async () => {
  const result = await Axios.get(`/api/v1/others/dashboard`);
  return result;
};
