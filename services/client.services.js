// API
import Axios from "../util/api.util";

export const fetchAllClients = async () => {
  const result = await Axios.get(`/api/v1/clients`);
  return result;
};
export const createClient = async (data) => {
  const result = await Axios.post(`/api/v1/clients`, data);
  return result;
};

export const fetchClientDetails = async (ClientID) => {
  const result = await Axios.get(`/api/v1/clients/${ClientID}`);
  console.log("result",result);
  return result;
};

export const updateClient = async (ClientID, data) => {
  const result = await Axios.put(`/api/v1/clients/${ClientID}`, data);
  return result;
};

export const deleteClient = async (ClientID) => {
  const result = await Axios.delete(`/api/v1/clients/${ClientID}`);
  return result;
};

export const searchClient = async (data) => {
  const result = await Axios.post(`/api/v1/clients/search`, data);
  return result;
};

export const activateSubscription = async (ClientID) => {
  const result = await Axios.post(`/api/v1/clients/${ClientID}/activate-subscription`);
  return result;
};

// data
export const ClientTypeList = [
  { value: "Autism Schools", label: "Autism Schools" },
  { value: "Block Resource Center", label: "Block Resource Center" },
  { value: "Bud School", label: "Bud School" },
  { value: "Buds Rehabilitation Centre", label: "Buds Rehabilitation Centre" },
  { value: "Clinics", label: "Clinics" },
  { value: "Hospitals", label: "Hospitals" },
  { value: "Special Education Centers", label: "Special Education Centers" },
  { value: "Special Schools", label: "Special Schools" },
  { value: "Other", label: "Other" },
];
