import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setModalOpen } from "./layout.slice";
import { fetchAllGoalsService, fetchGoalsByTherapy } from "../../services/goal.services";
import { ToastNotification } from "../../components/shared/toast";

export const fetchAllGoals = createAsyncThunk("goal/fetchAllGoals", async (thunkApi) => {
  try {
    const { data } = await fetchAllGoalsService();
    return data.results.data;
  } catch (error) {
    const message = error.responce.data.message;
    return thunkApi.rejectWithValue(message);
  }
});
export const getGoalsByTherapy = createAsyncThunk("goal/getGoalsByTherapy", async (data, thunkApi) => {
  try {
    const res = await fetchGoalsByTherapy(data.TherapyID);
    return res.data.results.data;
  } catch (error) {
    const message = error.responce.data.message;
    ToastNotification("error", message);
    return error;
  }
});

const initialState = {
  goals: [],
  isLoading: false,
  therapyGoals: [],
  therapyGoalsLoading: false,
};

export const goalSlice = createSlice({
  name: "goal",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGoals.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.goals = action.payload;
      })
      .addCase(fetchAllGoals.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getGoalsByTherapy.pending, (state, action) => {
        state.therapyGoalsLoading = true;
      })
      .addCase(getGoalsByTherapy.fulfilled, (state, action) => {
        state.therapyGoalsLoading = false;
        state.therapyGoals = action.payload;
      })
      .addCase(getGoalsByTherapy.rejected, (state, action) => {
        state.therapyGoalsLoading = false;
      });
  },
});

export const selectGoalList = (state) => state.goal.goals;
export const selectTherapyGoalList = (state) => state.goal.therapyGoals;
export const selectTherapyGoalLoading = (state) => state.goal.therapyGoalsLoading;
