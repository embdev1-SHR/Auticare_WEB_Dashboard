import Axios from "../util/api.util";

export const fetchAllAppointmentsService = async () => {
  const result = await Axios.get(`/api/v1/appointments`);
  return result;
};
export const updateAppointmentService = async (AppointmentID, data) => {
  const result = await Axios.put(`/api/v1/appointments/${AppointmentID}`, data);
  return result;
};
