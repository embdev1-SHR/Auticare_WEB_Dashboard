import Axios from "../util/api.util";

export const createAssessmentService = async (payload) => {
  const result = await Axios.post(`/api/v1/assessments`, payload);
  return result;
};

export const fetchAllAssessmentService = async () => {
    const result = await Axios.get(`/api/v1/assessments`);
    return result;
  };