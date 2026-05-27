import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { ToastNotification } from "../../components/shared/toast";
import {
  createTherapist,
  deleteTherapist,
  fetchAllTherapists,
  fetchTherapistDetails,
  searchTherapist,
  updateTherapist
} from "../../services/therapist.services";
import { setModalOpen } from "./layout.slice";

const initialState = {
  isLoading: false,
  Loading: false,
  isTherapistCreating: false,
  therapistList: [],
  isEdit: false,
  therapist: [],
  currentTherapistId: null,
  isSearchLoading: false,
  therapistFilterData: {},
};

export const getAllTherapists = createAsyncThunk("therapist/getAllTherapists", async (thunkApi) => {
  try {
    const response = await fetchAllTherapists();
    const { results } = response.data;
    return results.data;
  } catch (error) {
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithMessage(message);
  }
});
export const therapistCreation = createAsyncThunk("therapist/therapistCreation", async (values, thunkApi) => {
  try {
    const { data } = await createTherapist(values);
    ToastNotification("success", data.results.message);
    thunkApi.dispatch(setModalOpen(false));
    thunkApi.dispatch(getAllTherapists());
    return data;
  } catch (error) {
    console.log("error",error);
    if (typeof error.errors === "object") {
      const err = error.errors.message.replace("Duplicate entry", "");
      const errorr = err.replace(" for key 'EmailId'", "");
      ToastNotification("error", "Failed", errorr + " is already exist");
    } 
  
    else {
      error.response.data.errors.map((e) => {
        ToastNotification("error", "Failed", e.param + " " + e.msg);
      });
    }
    return error.message;
  }
});

export const getTherapist = createAsyncThunk("therapist/getTherapist", async (TherapistID, thunkApi) => {
  try {
    const { data } = await fetchTherapistDetails(TherapistID);
    const results = data.results.data;
    return results;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithMessage(message);
  }
});

export const therapistUpdation = createAsyncThunk("therapist/therapistUpdation", async (values, thunkApi) => {
  console.log("values --> slice",values);
  try {
    const { data } = await updateTherapist(values.TherapistID, values);
    ToastNotification("success", data.results.message);
    await thunkApi.dispatch(setEdit(false));
    await thunkApi.dispatch(getTherapist(values.TherapistID));
    return data;
  } catch (error) {
    console.log(error);
    const err = error.response.data.errors;
    if (Array.isArray(err)) {
      err.map((e) => {
        ToastNotification("error", "Therapist updation failed", e.param + " " + e.msg);
      });
    } else {
      const message = err.message;
      ToastNotification("error", "Therapist updation failed", message);
    }
    return thunkApi.rejectWithMessage(message);
  }
});

export const therapistDeletion = createAsyncThunk("therapist/therapistDeletion", async (TherapistID, thunkApi) => {
  try {
    const { data } = await deleteTherapist(TherapistID);
    const results = data.results;
    data.success && ToastNotification("success", "Deleted!", results.message);
    thunkApi.dispatch(getAllTherapists());
    return results;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    ToastNotification("error", "Failed to delete", message);
    return thunkApi.rejectWithMessage(message);
  }
});

export const therapistSearch = createAsyncThunk("therapist/therapistSearch", async (searchData, thunkApi) => {
  try {
    const res = await searchTherapist(searchData);
    return res.data.results.data;
  } catch (error) {
    const message = error.responce.data.message;
    ToastNotification("error", message);
    return thunkApi.rejectWithMessage(message);
  }
});

export const therapistSlice = createSlice({
  name: "therapist",
  initialState: initialState,
  reducers: {
    setEdit: (state, action) => {
      return {
        ...state,
        isEdit: action.payload,
      };
    },
    setCurrentTherapistId: (state, action) => {
      return {
        ...state,
        currentTherapistId: action.payload,
      };
    },
    setTherapistFilterData: (state, action) => {
      return {
        ...state,
        therapistFilterData: action.payload,
      };
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action) => {
        state = action.payload.auth;
      })
      .addCase(getAllTherapists.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTherapists.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.therapistList = action.payload;
        state.therapistList = action.payload.filter((Therapist) => Therapist.Status !== 0);
      })
      .addCase(getAllTherapists.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(therapistCreation.pending, (state) => {
        state.Loading = true;
        state.isTherapistCreating = true;
      })
      .addCase(therapistCreation.fulfilled, (state) => {
        state.Loading = false;
        state.isTherapistCreating = false;
      })
      .addCase(therapistCreation.rejected, (state) => {
        state.Loading = false;
        state.isTherapistCreating = false;
      })
      .addCase(getTherapist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTherapist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.therapist = action.payload;
      })
      .addCase(getTherapist.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(therapistUpdation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(therapistUpdation.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(therapistUpdation.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(therapistDeletion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(therapistDeletion.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(therapistDeletion.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(therapistSearch.pending, (state) => {
        state.isSearchLoading = true;
      })
      .addCase(therapistSearch.fulfilled, (state, action) => {
        state.isSearchLoading = false;
        state.therapistList = action.payload.filter((Therapist) => Therapist.Status !== 0);
      })
      .addCase(therapistSearch.rejected, (state, action) => {
        state.isSearchLoading = false;
        console.log(action);
      });
  },
});

export const { setEdit, setCurrentTherapistId, setTherapistFilterData } = therapistSlice.actions;
// Selectors

export const selectTherapistList = (state) => state.therapist.therapistList;
export const selectIsLoading = (state) => state.therapist.isLoading;
export const selectTherapistIsEdit = (state) => state.therapist.isEdit;
export const selectTherapist = (state) => state.therapist.therapist;
export const selectCurrentTherapistId = (state) => state.therapist.currentTherapistId;
export const selectIsTherapistCreating = (state) => state.therapist.isTherapistCreating;
export const selectSearchLoading = (state) => state.therapist.isSearchLoading;
export const selectLoading = (state) => state.therapist.Loading;
export const selectTherapistLoading = (state) => state.therapist.Loading;
export const selectTherapistFilterdata = (state) => state.therapist.therapistFilterData;
