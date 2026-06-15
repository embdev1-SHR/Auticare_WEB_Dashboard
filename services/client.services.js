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

export const permanentDeleteClient = async (ClientID) => {
  const result = await Axios.delete(`/api/v1/clients/${ClientID}/permanent`);
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

export const deleteUnonboardedClientService = async (UserID) => {
  const result = await Axios.delete(`/api/v1/clients/user/${UserID}`);
  return result;
};

export const fetchMyClientProfile = async () => {
  const result = await Axios.get(`/api/v1/clients/0`);
  return result;
};

export const submitOnboarding = async (data) => {
  const result = await Axios.post(`/api/v1/clients/onboard`, data);
  return result;
};

export const fetchPendingClientsService = async () => {
  const result = await Axios.get(`/api/v1/auth/pending-clients`);
  return result;
};

export const approveClientService = async (data) => {
  const result = await Axios.post(`/api/v1/auth/approve-client`, data);
  return result;
};

export const rejectClientService = async (UserID) => {
  const result = await Axios.delete(`/api/v1/auth/reject-client/${UserID}`);
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
