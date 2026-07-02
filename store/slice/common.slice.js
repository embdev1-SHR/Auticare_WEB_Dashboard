import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { ToastNotification } from "../../components/shared/toast";
import { fetchAllCountries, fetchAllRegion, fetchAllStates, fetchDashboard, imageUpload } from "../../services/common.services";

const initialState = {
  isLoading: false,
  imageIsLoading: false,
  Countries: [],
  States: [],
  uploadImageData: null,
  exportData: {},
  Regions: [],
  dashboardAnalytics: {},
  dashboardLoading: false,
};

export const getAllCountries = createAsyncThunk("common/getAllCountries", async (thunkApi) => {
  try {
    const { data } = await fetchAllCountries();
    const results = data.results.data;
    return results;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});

export const getAllRegion = createAsyncThunk("common/getAllRegion", async (thunkApi) => {
  try {
    const { data } = await fetchAllRegion();
    const results = data.results.data;
    return results;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});
export const getAllStates = createAsyncThunk("common/getAllStates", async (CountryID, thunkApi) => {
  try {
    const { data } = await fetchAllStates(CountryID);
    const results = data.results.data;
    return results;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});

export const uploadImage = createAsyncThunk("common/uploadImage", async (imageFile, thunkApi) => {
  try {
    const { data } = await imageUpload(imageFile);
    const results = data.results.data;
    return results;
  } catch (error) {
    await thunkApi.dispatch(resetUploadData())
    console.log(error);
    const message = error.errors.message.message;
    ToastNotification("error", "Image upload failed!", message);
    return thunkApi.rejectWithValue(message);
  }
});

export const getDashboard = createAsyncThunk("common/getDashboard", async (args, thunkApi) => {
  try {
    const { data } = await fetchDashboard();
    const results = data.results.data;
    return results;
  } catch (error) {
    console.log(error);
    const message = error?.response?.data?.errors?.message || error?.message || "Failed to load dashboard";
    return thunkApi.rejectWithValue(message);
  }
});

export const commonSlice = createSlice({
  name: "common",
  initialState: initialState,
  reducers: {
    setExportData: (state, action) => {
      state.exportData = action.payload;
    },
    resetUploadData: (state, action) => {
      state.uploadImageData = null;
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action) => {
        state = action.payload.auth;
      })
      .addCase(getAllCountries.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCountries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Countries = action.payload;
      })
      .addCase(getAllRegion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRegion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Regions = action.payload;
      })
      .addCase(getAllStates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllStates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.States = action.payload;
      })
      .addCase(uploadImage.pending, (state) => {
        state.uploadImageData = null;
        state.imageIsLoading = true;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.imageIsLoading = false;
        state.uploadImageData = action.payload;
      })
      .addCase(uploadImage.rejected, (state) => {
        state.imageIsLoading = false;
      })
      .addCase(getDashboard.pending, (state) => {
        state.dashboardLoading = true;
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardAnalytics = action.payload;
      })
      .addCase(getDashboard.rejected, (state) => {
        state.dashboardLoading = false;
      });
  },
});
export const { setExportData, resetUploadData } = commonSlice.actions;

// Selectors
export const selectCountries = (state) => state.common.Countries;
export const selectStates = (state) => state.common.States;
export const selectIsLoading = (state) => state.common.imageIsLoading;
// export const selectImageLoading = (state) => state.common.imageIsLoading;
export const selectUploadImageData = (state) => state.common.uploadImageData;
export const selectExportData = (state) => state.common.exportData;
export const selectRegions = (state) => state.common.Regions;

export const selectDashboardData = (state) => state.common.dashboardAnalytics;
export const selectDashboardLoading = (state) => state.common.dashboardLoading;
