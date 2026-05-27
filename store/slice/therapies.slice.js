import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { ToastNotification } from "../../components/shared/toast";
import { createTherapy, deleteTherapy, fetchAllTherapies, fetchTherapyDetails, searchTherapy, updateTherapy, fetchAllTherapiesSkillGoals } from "../../services/therapies.services";
import { setModalOpen } from "./layout.slice";

const initialState = {
  isTherapyCreating: false,
  isLoading: false,
  therapiesList: [],
  selectedTherapy: [],
  currentTherapyId: null,
  searchLoading: false,
  isEdit: false,
  viewModal: false,
  SkillGoal:[]
};

export const getAllTherapiesSkillGoal = createAsyncThunk("therapy/getAllTherapiesSkillGoal", async (thunkApi) => {
  try {
    const response = await fetchAllTherapiesSkillGoals();
    const { results } = response.data;
    return results.data;
  } catch (error) {
    const message = error.response.data.errors.message;
    ToastNotification("error", message);
    return thunkApi.rejectWithMessage(message);
  }
});

export const getAllTherapies = createAsyncThunk("therapy/getAllTherapies", async (thunkApi) => {
  try {
    const response = await fetchAllTherapies();
    const { results } = response.data;
    return results.data;
  } catch (error) {
    const message = error.response.data.errors.message;
    ToastNotification("error", message);
    return thunkApi.rejectWithMessage(message);
  }
});

export const therapyCreation = createAsyncThunk("therapy/therapyCreation", async (values, thunkApi) => {
  try {
    const { data } = await createTherapy(values);
    const results = data.results.data;
    await thunkApi.dispatch(getAllTherapies());
    thunkApi.dispatch(setModalOpen(false));
    thunkApi.dispatch(getAllTherapiesSkillGoal());

    ToastNotification("success", data.results.message);
    return results;
  } catch (error) {
    const err = error.response.data.errors;
    if (Array.isArray(err)) {
      err.map((e) => {
        ToastNotification("error", "Therapy creation Failed", e.param + " " + e.msg);
      });
    } else {
      const message = err.message;
      ToastNotification("error", "Therapy creation Failed", message);
    }

    return thunkApi.rejectWithMessage(message);
  }
});
export const getATherapy = createAsyncThunk("therapy/getATherapy", async (TherapyID, thunkApi) => {
  try {
    const response = await fetchTherapyDetails(TherapyID);
    const { results } = response.data;
    return results.data;
  } catch (error) {
    const message = error.response.data.errors.message;
    ToastNotification("error", message);
    return thunkApi.rejectWithMessage(message);
  }
});

export const therapyUpdation = createAsyncThunk("therapy/therapyUpdation", async (values, thunkApi) => {
  try {
    const { data } = await updateTherapy(values.TherapyID, values);
    ToastNotification("success", data.results.message);
    thunkApi.dispatch(setTherapyEdit(false));
    thunkApi.dispatch(getAllTherapies());
    thunkApi.dispatch(setModalOpen(false));
    thunkApi.dispatch(getAllTherapiesSkillGoal());
    return data;
  } catch (error) {
    console.log(error);
    const err = error.response.data.errors;
    if (Array.isArray(err)) {
      err.map((e) => {
        ToastNotification("error", "Therapy updation failed", e.param + " " + e.msg);
      });
    } else {
      const message = err.message;
      ToastNotification("error", "Therapy updation failed", message);
    }
    return thunkApi.rejectWithMessage(message);
  }
});

export const therapyDeletion = createAsyncThunk("therapy/therapyDeletion", async (TherapyID, thunkApi) => {
  try {
    const response = await deleteTherapy(TherapyID);
    const { results } = response.data;
    results.success && ToastNotification("success", "Deleted!", results.message);
    thunkApi.dispatch(getAllTherapies());
    return results;
  } catch (error) {
    const message = error.response.data.errors.message;
    ToastNotification("error", message);
    return thunkApi.rejectWithMessage(message);
  }
});

export const therapySearch = createAsyncThunk("center/therapySearch", async (searchData, thunkApi) => {
  try {
    const res = await searchTherapy(searchData);

    return res.data.results.data;
  } catch (error) {
    console.log(error);
    const message = error.responce.data.message;
    return thunkApi.rejectWithMessage(message);
  }
});

export const therapySlice = createSlice({
  name: "therapy",
  initialState: initialState,
  reducers: {
    setCurrentTherapyId: (state, action) => {
      return {
        ...state,
        currentTherapyId: action.payload,
      };
    },
    setTherapyEdit: (state, action) => {
      return {
        ...state,
        isEdit: action.payload,
      };
    },
    setViewModalState: (state, action) => {
      return {
        ...state,
        viewModal: action.payload,
      };
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action) => {
        state = action.payload.auth;
      })
      .addCase(getAllTherapies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTherapies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.therapiesList = action.payload.filter((therapy) => therapy.Status !== 0);

        // state.therapiesList = action.payload;
      })
      .addCase(therapyCreation.pending, (state) => {
        state.isTherapyCreating = true;
      })
      .addCase(therapyCreation.fulfilled, (state) => {
        state.isTherapyCreating = false;
      })
      .addCase(therapyCreation.rejected, (state) => {
        state.isTherapyCreating = false;
      })
      .addCase(getAllTherapiesSkillGoal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTherapiesSkillGoal.fulfilled, (state, action) => {
        state.SkillGoal = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllTherapiesSkillGoal.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getATherapy.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getATherapy.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedTherapy = action.payload;
      })
      .addCase(getATherapy.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(therapyUpdation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(therapyUpdation.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(therapyUpdation.rejected, (state, action) => {
        state.isLoading = false;
        console.log(action);
      })
      .addCase(therapySearch.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(therapySearch.fulfilled, (state, action) => {
        state.searchLoading = false;
        // state.therapiesList = action.payload;
        state.therapiesList = action.payload.filter((therapy) => therapy.Status !== 0);
      })
      .addCase(therapySearch.rejected, (state) => {
        state.searchLoading = false;
      });
  },
});

export const { setTherapyEdit, setCurrentTherapyId, setViewModalState } = therapySlice.actions;

// Selectors

export const selectTherapiesList = (state) => state.therapy.therapiesList;
export const selectIsLoading = (state) => state.therapy.isLoading;
export const selectTherapy = (state) => state.therapy.selectedTherapy;
export const selectCurrentTherapyId = (state) => state.therapy.currentTherapyId;
export const selectSearchLoading = (state) => state.therapy.searchLoading;
export const selectIsTherapyEdit = (state) => state.therapy.isEdit;
export const selectTherapyView = (state) => state.therapy.viewModal;
export const selectTherapySkillGoal = (state) => state.therapy.SkillGoal;
