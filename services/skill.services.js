import Axios from "../util/api.util";

export const fetchAllSkillsService = async () => {
  const result = await Axios.get(`/api/v1/skills`);
  return result;
};

export const createSkillService = async (data) => {
  const result = await Axios.post(`/api/v1/skills`, data);
  return result;
};
export const updateSkillService = async (data ) => {
  const result = await Axios.put(`/api/v1/skills/${data.skillID}`, data.body);
  return result;
};
export const deleteSkillService = async (SkillID) => {
  const result = await Axios.delete(`/api/v1/skills/${SkillID}`);
  return result;
};
export const skillDetailsService = async (SkillID) => {
  const result = await Axios.get(`/api/v1/skills/${SkillID}`);
  return result;
};
export const searchSkillService = async (SkillName) => {
  const result = await Axios.post(`/api/v1/skills/search`, SkillName);
  return result;
};
export const skillMappingService = async (SkillID) => {
  const result = await Axios.get(`/api/v1/skills/mappings`);
  return result;
};
