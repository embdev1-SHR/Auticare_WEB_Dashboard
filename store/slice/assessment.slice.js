import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setModalOpen } from "./layout.slice";
import {
  createAssessmentService,
  fetchAllAssessmentService

} from "../../services/assessment.services";
import { ToastNotification } from "../../components/shared/toast";

export const fetchAllAssessments = createAsyncThunk(
    "assessment/fetchAllAssessments",
    async (thunkApi) => {
      try {
        const { data } = await fetchAllAssessmentService();
        return data.results.data;
      } catch (error) {
        const message = error.responce.data.message;
        console.log(message);
        return thunkApi.rejectWithValue(message);
      }
    }
  );

export const createAssessment = createAsyncThunk(
  "assessment/createAssessment",
  async (data, thunkApi) => {

    try {
      const res = await createAssessmentService(data);
      ToastNotification("success", "Added Successfully");
      thunkApi.dispatch(setModalOpen(false));
      thunkApi.dispatch(fetchAllAssessments())
      return res.data.results.message;
    } catch (error) {
      ToastNotification("error", "Failed to add assessment");
      return error;
    }
  }
);

const initialState = {
  isLoading: false,
  isAssessmentCreating: false,
  assessments:[]
};
export const assessmentSlice = createSlice({
  name: "assessment",
  initialState: initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAssessments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAssessments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assessments = action.payload;
      })
      .addCase(fetchAllAssessments.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createAssessment.pending, (state) => {
        state.isAssessmentCreating = true;
      })
      .addCase(createAssessment.fulfilled, (state) => {
        state.isAssessmentCreating = false;
      })
      .addCase(createAssessment.rejected, (state) => {
        state.isAssessmentCreating = false;
      })
  },
});

export const selectAssessmentIsLoading = (state) => state.assessment.isLoading;
export const selectAssessments = (state) => state.assessment.assessments;

