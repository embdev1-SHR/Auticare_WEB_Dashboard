import Axios from "../util/api.util";

export const fetchAllTherapies = async () => {
  const result = await Axios.get(`/api/v1/therapies`);
  return result;
};
export const createTherapy = async (data) => {
  const result = await Axios.post(`/api/v1/therapies`, data);
  return result;
};

export const fetchTherapyDetails = async (TherapyID) => {
  const result = await Axios.get(`/api/v1/therapies/${TherapyID}`);
  console.log("result",result);
  return result;
};

export const deleteTherapy = async (TherapyID) => {
  const result = await Axios.delete(`/api/v1/therapies/${TherapyID}`);
  return result;
};

export const searchTherapy = async (data) => {
  const result = await Axios.post(`/api/v1/therapies/search`, data);
  return result;
};

export const updateTherapy = async (TherapyID, data) => {
  const result = await Axios.put(`/api/v1/therapies/${TherapyID}`, data);
  return result;
};
export const fetchAllTherapiesSkillGoals = async () => {
  const result = await Axios.get(`/api/v1/therapies/mappings`);
  return result;
};