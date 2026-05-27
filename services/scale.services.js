import Axios from "../util/api.util";

export const createScaleServices = async (payload) => {
  const result = await Axios.post(`/api/v1/scales`, payload);
  return result;
};

export const fetchAllScaleService = async () => {
  const result = await Axios.get(`/api/v1/scales`);
  return result;
};

export const fetchAllCategoryService = async () => {
  const result = await Axios.get(`/api/v1/categories`);
  return result;
};

export const fetchAllCategoryByScaleIDService = async (ScaleID) => {
  const result = await Axios.get(`/api/v1/categories/scales/${ScaleID}`);
  return result;
};

export const fetchAllQuestionService = async (ScaleID) => {
  const result = await Axios.get(`/api/v1/scales/${ScaleID}/screening`);
  return result;
};

export const createCategoryService = async (payload) => {
  const result = await Axios.post(`/api/v1/categories/`,payload);
  return result;
};

export const createQuestionService = async (payload) => {
  const result = await Axios.post(`/api/v1/scales/${payload.ScaleID}/screening`,payload);
  return result;
};

export const fetchAllAssessmentQuestionService = async (ScaleID) => {
  const result = await Axios.get(`/api/v1/scales/${ScaleID}/assessment`);
  return result;
};

export const createAssessmentQuestionService = async (payload) => {
  const result = await Axios.post(`/api/v1/scales/${payload.ScaleID}/assessment`,payload);
  return result;
};
export const updateCategoryService = async (categoryID,payload) => {
  const result = await Axios.put(`/api/v1/categories/${categoryID}`,payload);
  return result;
};
export const updateQuestionService = async (scaleID,metricID,payload) => {
  const result = await Axios.put(`/api/v1/scales/${scaleID}/screening/${metricID}`,payload);
  return result;
};
export const updateTaskService = async (scaleID,metricID,payload) => {
  const result = await Axios.put(`/api/v1/scales/${scaleID}/assessment/${metricID}`,payload);
  return result;
};
export const ScaleSearchService = async (data) => {
  const result = await Axios.post(`/api/v1/scales/search`,data);
  return result;
};

export const deleteScaleService = async (ScaleID) => {
  const result = await Axios.delete(`/api/v1/scales/${ScaleID}`);
  return result;
};

export const deleteScaleMetricService = async (payload) => {
  const result = await Axios.delete(`/api/v1/scales/${payload.MetricId}/${payload.ScaleMetricType}`);
  return result;
};

export const CategorydeleteScaleService = async (CategoryID) => {
  const result = await Axios.delete(`/api/v1/categories/${CategoryID}`);
  return result;
};

export const ScaleDetailService = async (ScaleID) => {
  const result = await Axios.get(`/api/v1/scales/${ScaleID}`);
  return result;
};

export const ScaleSkillService = async (ScaleID) => {
  const result = await Axios.get(`/api/v1/skills/scales/${ScaleID}`);
  return result;
};

export const ScoreUpdateService = async (payload) => {
  const result = await Axios.put(`/api/v1/scales/${payload.ScaleID}/score-criteria`,payload.data);
  return result;
};

export const ScaleUpdateService = async (payload) => {
  const result = await Axios.put(`/api/v1/scales/${payload.ScaleID}`,payload.data);
  return result;
};