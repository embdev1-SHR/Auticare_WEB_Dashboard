import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCenterService,
  deleteCenterService,
  updateCenterService,
  centerDetailsService,
  searchCenterService,
  fetchAllCentersService,
} from "../../services/center.services";

import { setModalOpen } from "./layout.slice";

import { ToastNotification } from "../../components/shared/toast";

export const fetchAllCenters = createAsyncThunk(
  "center/fetchAllCenters",
  async (thunkApi) => {
    try {
      const { data } = await fetchAllCentersService();
      const results = data.results.data;

      return results;
    } catch (error) {
      const message = error.responce.data.message;
      return thunkApi.rejectWithValue(message);
    }
  }
);
export const createCenter = createAsyncThunk(
  "center/createCenter",
  async (data, thunkApi) => {
    try {
      const res = await createCenterService(data);
      ToastNotification("success", "Added Successfully");
      await thunkApi.dispatch(setModalOpen(false));
      await thunkApi.dispatch(fetchAllCenters());
      return res.data.results.message;
    } catch (error) {

      if (typeof error.errors === 'object') {
        const err = error.errors.message.replace("Duplicate entry", '');
        const errorr = err.replace(" for key 'EmailId'", '');
        ToastNotification("error", "Failed", errorr+" is already exist");
      }
      else {
        error.errors.map((e) => {
          ToastNotification("error", "Failed", e.param + " " + e.msg);
        });
      }
      return error.message;
    }
  }
);
export const updateCenter = createAsyncThunk(
  "center/updateCenter",
  async (data, thunkApi) => {
    try {
      const res = await updateCenterService(data);

      ToastNotification("success", res.data.results.message);

      await thunkApi.dispatch(SelectCenter(data.CenterID));
      return res.data.results.message;
    } catch (error) {
      ToastNotification("error", "Update Failed");
      console.error(error);
      return error.message;
    }
  }
);

export const deleteCenter = createAsyncThunk(
  "center/deleteCenter",
  async (CenterID, thunkApi) => {
    try {
      const res = await deleteCenterService(CenterID);

      ToastNotification("success", "Deleted!", res.data.results.message);
      await thunkApi.dispatch(fetchAllCenters());
      return res.data.results.message;
    } catch (error) {
      ToastNotification("error", error.message);
      console.error(error);
      return error.message;
    }
  }
);
export const SelectCenter = createAsyncThunk(
  "center/SelectCenter",
  async (id, thunkApi) => {
    const res = await centerDetailsService(id);
    return res.data.results.data[0];
  }
);

export const searchCenter = createAsyncThunk(
  "center/searchCenter",
  async (CenterName, thunkApi) => {
    try {
      const res = await searchCenterService(CenterName);
      return res.data.results.data;
    } catch (error) {
      const message = error.responce.data.message;
      return thunkApi.rejectWithValue(message);
    }
  }
);
const initialState = {
  centers: [],
  selectedCenter: null,
  isLoading: false,
  centerIsEdit:
    typeof window !== "undefined" && sessionStorage.getItem("centerIsEdit")
      ? JSON.parse(sessionStorage.getItem("centerIsEdit"))
      : false,
  currentCenterId: null,
  IsSearch: false,
  message: "",
  isCenterCreating: false,
  isCenterUpdating: false,
  isCenterDetails: false,
};
export const centerSlice = createSlice({
  name: "center",
  initialState: initialState,
  reducers: {
    setCenterEdit: (state, action) => {
      typeof window && sessionStorage.setItem("centerIsEdit", action.payload);
      return {
        ...state,
        centerIsEdit: action.payload,
      };
    },
    setCurrentCenterId: (state, action) => {
      return {
        ...state,
        currentCenterId: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCenters.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(fetchAllCenters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.centers = action.payload;
      })
      .addCase(createCenter.pending, (state, action) => {
        state.isCenterCreating = true;
      })
      .addCase(createCenter.fulfilled, (state, action) => {
        state.isCenterCreating = false;
      })
      .addCase(createCenter.rejected, (state, action) => {
        state.isCenterCreating = false;
      })
      .addCase(SelectCenter.pending, (state, action) => {
        state.isCenterDetails = true;
      })
      .addCase(SelectCenter.fulfilled, (state, action) => {
        state.selectedCenter = action.payload;
        state.isCenterDetails = false;
      })
      .addCase(SelectCenter.rejected, (state, action) => {
        state.isCenterDetails = false;
      })

      .addCase(updateCenter.pending, (state, action) => {
        state.isCenterUpdating = true;
      })
      .addCase(updateCenter.fulfilled, (state, action) => {
        state.isCenterUpdating = false;
      })
      .addCase(updateCenter.rejected, (state, action) => {
        state.isCenterUpdating = false;
      })
      .addCase(deleteCenter.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(deleteCenter.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteCenter.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(searchCenter.pending, (state, action) => {
        state.IsSearch = true;
      })
      .addCase(searchCenter.fulfilled, (state, action) => {
        state.IsSearch = false;
        state.centers = action.payload;
      })
      .addCase(searchCenter.rejected, (state, action) => {
        state.IsSearch = false;
      });
  },
});
export const { setCenterEdit, setCurrentCenterId } = centerSlice.actions;

export const selectCenterList = (state) => state.center.centers;
export const CenterDetailsLoading = (state) => state.center.isCenterDetails;

export const CenterDetails = (state) => state.center.selectedCenter;
export const centerIsLoading = (state) => state.center.isLoading;
export const SelectSearchCenterLoading = (state) => state.center.IsSearch;
export const selectCurrentCenterId = (state) => state.center.currentCenterId;
export const selectCenterIsEdit = (state) => state.center.centerIsEdit;
