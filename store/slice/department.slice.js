import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { createDepartment, deleteDepartment, fetchAllDepartments, fetchDepartmentDetails, searchDepartment, updateDepartment } from "../../services/department.services";
import { ToastNotification } from "../../components/shared/toast";
import { setModalOpen } from "./layout.slice";

const initialState = {
  isLoading: false,
  isDepartmentCreating: false,
  DepartmentList: [],
  department: [],
  currentDepartmentId: null,
  isEdit: false,
  isViewModal: false,
  IsSearch: false,
  searchKey: "",
};

export const getAllDepartments = createAsyncThunk("department/getAllDepartments", async (thunkApi) => {
  try {
    const response = await fetchAllDepartments();
    const { results } = response.data;
    return results.data;
  } catch (error) {
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});

export const departmentCreation = createAsyncThunk("department/departmentCreation", async (values, thunkApi) => {
  try {
    const { data } = await createDepartment(values);
    ToastNotification("success", data.results.message);
    thunkApi.dispatch(setModalOpen(false));
    thunkApi.dispatch(getAllDepartments());
    return data;
  } catch (error) {
    console.log(error);
    const err = error.response.data.errors;
    if (Array.isArray(err)) {
      err.map((e) => {
        ToastNotification("error", "Failed", e.param + " " + e.msg);
      });
    } else {
      const message = err.message;
      ToastNotification("error", message);
    }
    return thunkApi.rejectWithValue(message);
  }
});

export const departmentDeletion = createAsyncThunk("department/departmentDeletion", async (departmentID, thunkApi) => {
  try {
    const { data } = await deleteDepartment(departmentID);
    const results = data.results;
    data.success && ToastNotification("success", "Deleted!", results.message);

    thunkApi.dispatch(getAllDepartments());
    return results;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    ToastNotification("error", message);
    return thunkApi.rejectWithValue(message);
  }
});

export const getDepartment = createAsyncThunk("department/getDepartment", async (departmentID, thunkApi) => {
  try {
    const { data } = await fetchDepartmentDetails(departmentID);
    const results = data.results.data;
    return results;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});

export const departmentUpdation = createAsyncThunk("department/departmentUpdation", async (values, thunkApi) => {
  try {
    const { data } = await updateDepartment(values.DepartmentID, values);
    ToastNotification("success", data.results.message);
    thunkApi.dispatch(setEdit(false));
    thunkApi.dispatch(setView(false));
    thunkApi.dispatch(getAllDepartments());
    return data;
  } catch (error) {
    console.log(error);
    const err = error.response.data.errors;
    if (Array.isArray(err)) {
      err.map((e) => {
        ToastNotification("error", "Failed", e.param + " " + e.msg);
      });
    } else {
      const message = err.message;
      ToastNotification("error", message);
    }
    return thunkApi.rejectWithValue(message);
  }
});

export const departmentSearch = createAsyncThunk("department/departmentSearch", async (searchData, thunkApi) => {
  try {
    const res = await searchDepartment(searchData);
    return res.data.results.data;
  } catch (error) {
    const message = error.responce.data.message;
    ToastNotification("error", message);
    return thunkApi.rejectWithValue(message);
  }
});

export const departmentSlice = createSlice({
  name: "department",
  initialState: initialState,
  reducers: {
    setEdit: (state, action) => {
      return {
        ...state,
        isEdit: action.payload,
      };
    },
    setView: (state, action) => {
      return {
        ...state,
        isViewModal: action.payload,
      };
    },
    setCurrentDepartmentId: (state, action) => {
      return {
        ...state,
        currentDepartmentId: action.payload,
      };
    },
    setDepartmentSearchKey: (state, action) => {
      return {
        ...state,
        searchKey: action.payload,
      };
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action) => {
        state = action.payload.auth;
      })
      .addCase(getAllDepartments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDepartments.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.DepartmentList = action.payload;
        state.DepartmentList = action.payload.filter((dep) => dep.Status !== 0);
      })
      .addCase(departmentCreation.pending, (state) => {
        state.isDepartmentCreating = true;
      })
      .addCase(departmentCreation.fulfilled, (state) => {
        state.isDepartmentCreating = false;
      })
      .addCase(departmentCreation.rejected, (state) => {
        state.isDepartmentCreating = false;
      })
      .addCase(getDepartment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.department = action.payload;
      })
      .addCase(getDepartment.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(departmentUpdation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(departmentUpdation.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(departmentUpdation.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(departmentSearch.pending, (state) => {
        state.IsSearch = true;
      })
      .addCase(departmentSearch.fulfilled, (state, action) => {
        state.IsSearch = false;
        state.DepartmentList = action.payload.filter((dep) => dep.Status !== 0);
      })
      .addCase(departmentSearch.rejected, (state, action) => {
        state.IsSearch = false;
        console.log(action);
      });
  },
});

export const { setEdit, setView, setCurrentDepartmentId, setDepartmentSearchKey } = departmentSlice.actions;

// Selectors
export const selectDepartmentList = (state) => state.department.DepartmentList;
export const selectIsLoading = (state) => state.department.isLoading;
export const selectCurrentDepartmentId = (state) => state.department.currentDepartmentId;
export const selectEditState = (state) => state.department.isEdit;
export const selectDepartment = (state) => state.department.department;
export const selectViewModalState = (state) => state.department.isViewModal;
export const selectDepartmentSearchKey = (state) => state.department.searchKey;
export const selectDepartmentIsSearch = (state) => state.department.IsSearch;
export const selectIsDepartmentCreating = (state) => state.department.isDepartmentCreating;
