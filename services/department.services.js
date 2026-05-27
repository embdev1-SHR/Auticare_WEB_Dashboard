import Axios from "../util/api.util";

export const fetchAllDepartments = async () => {
  const result = await Axios.get(`/api/v1/departments`);
  return result;
};
export const createDepartment = async (data) => {
  const result = await Axios.post(`/api/v1/departments`, data);
  return result;
};

export const fetchDepartmentDetails = async (DepartmentID) => {
  const result = await Axios.get(`/api/v1/departments/${DepartmentID}`);
  return result;
};

export const deleteDepartment = async (DepartmentID) => {
  const result = await Axios.delete(`/api/v1/departments/${DepartmentID}`);
  return result;
};

export const searchDepartment = async (data) => {
  const result = await Axios.post(`/api/v1/departments/search`, data);
  return result;
};

export const updateDepartment = async (DepartmentID, data) => {
  const result = await Axios.put(`/api/v1/departments/${DepartmentID}`, data);
  return result;
};
