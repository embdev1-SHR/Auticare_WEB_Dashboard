import Axios from "../util/api.util";

const base = (centerID) => (centerID ? `?centerID=${centerID}` : "");

export const getClassesService = (centerID) =>
  Axios.get(`/api/v1/blueroom/classes${base(centerID)}`);

export const getDepartmentCredentialsService = (centerID) =>
  Axios.get(`/api/v1/blueroom/classes/credentials${base(centerID)}`);

export const setDepartmentAuthService = (classId, data, centerID) =>
  Axios.post(`/api/v1/blueroom/classes/${classId}/auth${base(centerID)}`, data);

export const getClassStudentsService = (classId, centerID) =>
  Axios.get(`/api/v1/blueroom/classes/${classId}/students${base(centerID)}`);

export const getLiveSessionsService = (centerID) =>
  Axios.get(`/api/v1/blueroom/live${base(centerID)}`);

export const getSessionDetailService = (sessionId, centerID) =>
  Axios.get(`/api/v1/blueroom/sessions/${sessionId}${base(centerID)}`);

export const getActivityService = (params) =>
  Axios.get(`/api/v1/blueroom/activity`, { params });

export const getHeatmapService = (params) =>
  Axios.get(`/api/v1/blueroom/heatmap`, { params });

export const getTimeSeriesService = (params) =>
  Axios.get(`/api/v1/blueroom/timeseries`, { params });
