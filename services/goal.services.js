import Axios from "../util/api.util";

export const fetchAllGoalsService = async () => {
  const result = await Axios.get(`/api/v1/goals`);
  return result;
};

export const fetchGoalsByTherapy = async (TherapyID) => {
  const result = await Axios.get(`/api/v1/goals/therapies/${TherapyID}`);
  return result;
};
