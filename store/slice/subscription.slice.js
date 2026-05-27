import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { ToastNotification } from "../../components/shared/toast";
import {
  AddSubscriptionPlans,
  SubscriptionPlanService,
  fetchAllSubscriptionPlans,
  updateSubscriptionPlanService
} from "../../services/subscription.services";
import { setModalOpen } from "./layout.slice";


const initialState = {
  isLoading: false,
  isLoadingUpdate:false,
  subscriptionPlans: [],
  subscriptionPlansDetails:[],
  isEdit: false,
  searchKey: "",
  table:[],
  subscriptionPlansSearch:[]
};


export const UpdateSubscriptionPlans = createAsyncThunk("skill/UpdateSubscriptionPlans", async (data, thunkApi) => {
  try {
    const res = await updateSubscriptionPlanService(data);
    thunkApi.dispatch(getAllSubscriptionPlans());
    if(data.msg){
      ToastNotification("success",data.msg);
  }
  else{
      ToastNotification("success",res.data.results.message);
  }
    return res.data.results.message;
  } catch (error) {
    console.log(error);
    ToastNotification("error", " SubscriptionPlans update Failed");
    return error;
  }
});


export const getAllSubscriptionPlans = createAsyncThunk("subscription/getAllSubscriptionPlans", async (data, thunkApi) => {
  try {
    const { data } = await fetchAllSubscriptionPlans(data);
    const results = data.results.data;
    thunkApi.dispatch(setModalOpen(false));
    return results;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithMessage(message);
  }
});




export const SubscriptionPlans = createAsyncThunk("skill/SubscriptionPlans", async (data, thunkApi) => {
  try {
    const res = await AddSubscriptionPlans(data);
    thunkApi.dispatch(getAllSubscriptionPlans());
    ToastNotification("success", res.data.results.message);
    return res.data.results.message;
  } catch (error) {
    ToastNotification("error", "Added SubscriptionPlans Failed");
    return error;
  }
});



export const SubscriptionPlanDetails = createAsyncThunk("skill/SubscriptionPlanDetails", async (data, thunkApi) => {
  try {
    const res = await SubscriptionPlanService(data);
    return res.data.results.data;
  } catch (error) {
    return error;
  }
});




export const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: initialState,
  reducers: {
    setEdit: (state, action) => {
      return {
        ...state,
        isEdit: action.payload,
      };
    },
    setSearchKey: (state, action) => {
      return {
        ...state,
        searchKey: action.payload,
      };
    },
    tableSearch: (state, action) => {
      return {
        ...state,
        subscriptionPlans: action.payload,
      };
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action) => {
        state = action.payload.auth;
      })
      .addCase(getAllSubscriptionPlans.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSubscriptionPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptionPlans = action.payload;
        state.subscriptionPlansSearch = action.payload;

      })
      .addCase(SubscriptionPlanDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(SubscriptionPlanDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptionPlansDetails = action.payload;
      })
      .addCase(UpdateSubscriptionPlans.pending, (state) => {
        state.isLoadingUpdate = true;
      })
      .addCase(UpdateSubscriptionPlans.fulfilled, (state, action) => {
        state.isLoadingUpdate = false;
      })
      .addCase(SubscriptionPlans.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(SubscriptionPlans.fulfilled, (state, action) => {
        state.isLoading = false;
      });
  },
});
export const { setEdit, setSearchKey, tableSearch } = subscriptionSlice.actions;

// Selectors
export const selectIsLoading = (state) => state.subscription.isLoading;
export const selectIsLoadingUpdate = (state) => state.subscription.isLoadingUpdate;
export const selectSubscriptionPlans = (state) => state.subscription.subscriptionPlans;
export const SubPlanDetails = (state) => state.subscription.subscriptionPlansDetails;
export const selectSubscriptionIsEdit = (state) => state.subscription.isEdit;
export const selectSearchKey = (state) => state.subscription.searchKey;
export const selectTableSearch = (state) => state.subscription.subscriptionPlansSearch;

