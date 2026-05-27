import Axios from "../util/api.util";

export const fetchAllTherapists = async () => {
  const result = await Axios.get(`/api/v1/therapists`);
  return result;
};
export const createTherapist = async (data) => {
  const result = await Axios.post(`/api/v1/therapists`, data);
  return result;
};

export const fetchTherapistDetails = async (TherapistID) => {
  const result = await Axios.get(`/api/v1/therapists/${TherapistID}`);
  return result;
};

export const updateTherapist = async (TherapistID, data) => {
  console.log("TherapistID ,data",TherapistID, data);
  const result = await Axios.put(`/api/v1/therapists/${TherapistID}`, data);
  return result;
};

export const deleteTherapist = async (TherapistID) => {
  const result = await Axios.delete(`/api/v1/therapists/${TherapistID}`);
  return result;
};

export const searchTherapist = async (data) => {
  const result = await Axios.post(`/api/v1/therapists/search`, data);
  return result;
};

