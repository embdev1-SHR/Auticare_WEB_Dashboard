import Axios from "../util/api.util";

const base = (centerID) => (centerID ? `?centerID=${centerID}` : "");

export const getClassesService = (centerID) =>
  Axios.get(`/api/v1/blueroom/classes${base(centerID)}`);

export const setDepartmentPasswordService = (classId, data, centerID) =>
  Axios.post(`/api/v1/blueroom/classes/${classId}/password${base(centerID)}`, data);

export const getClassStudentsService = (classId, centerID) =>
  Axios.get(`/api/v1/blueroom/classes/${classId}/students${base(centerID)}`);

export const addStudentService = (classId, data) =>
  Axios.post(`/api/v1/blueroom/classes/${classId}/students`, data);

export const removeStudentService = (classId, patientId, centerID) =>
  Axios.delete(`/api/v1/blueroom/classes/${classId}/students/${patientId}${base(centerID)}`);

export const getActivityService = (params) =>
  Axios.get(`/api/v1/blueroom/activity`, { params });

export const getHeatmapService = (params) =>
  Axios.get(`/api/v1/blueroom/heatmap`, { params });

export const getTimeSeriesService = (params) =>
  Axios.get(`/api/v1/blueroom/timeseries`, { params });
