import Axios from "../util/api.util";

export const fetchAllSubscriptionPlans = async (data) => {
  const result = await Axios.get(`/api/v1/subscriptionPlans`,data);
  return result;
};
export const AddSubscriptionPlans = async (data) => {
  const result = await Axios.post(`/api/v1/subscriptionPlans`,data);
  return result;
};
export const SubscriptionPlanService = async (data) => {
  const result = await Axios.get(`/api/v1/subscriptionPlans/${data}`);
  return result;
};

export const updateSubscriptionPlanService = async (data ) => {
  const result = await Axios.put(`/api/v1/subscriptionPlans/${data.SubscriptionPlanID}`, data.body);
  return result;
};