import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import Router from "next/router";
import { ToastNotification } from "../../components/shared/toast";
import { activateSubscription, createClient, deleteClient, fetchAllClients, fetchClientDetails, searchClient, updateClient } from "../../services/client.services";
import { setModalOpen } from "./layout.slice";

const initialState = {
  clientList: [],
  client: [],
  isClientCreating: false,
  isLoading: false,
  isEdit: false,
  currentClientId: null,
  IsSearch: false,
  searchKey: "",
  filterData: {},
};

export const getAllClients = createAsyncThunk("client/getAllClients", async (args, thunkApi) => {
  try {
    const { data } = await fetchAllClients();
    const results = data.results.data;
    return results;
  } catch (error) {
    console.log(error);
    // const message = error.response.data.message;
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});

export const clientCreation = createAsyncThunk("client/clientCreation", async (values, thunkApi) => {
  try {
    const { data } = await createClient(values);
    ToastNotification("success", data.results.message);
    thunkApi.dispatch(setModalOpen(false));
    thunkApi.dispatch(getAllClients());
    return data;
  } catch (error) {
    if (typeof error.errors === "object") {
      const err = error.errors.message.replace("Duplicate entry", "");
      const errorr = err.replace(" for key 'EmailId'", "");
      ToastNotification("error", "Failed", errorr + " is already exist");
    } else {
      error.response.data.errors.map((e) => {
        ToastNotification("error", "Failed", e.param + " " + e.msg);
      });
    }
    return thunkApi.rejectWithValue(message);
  }
});

export const getClient = createAsyncThunk("client/getClient", async (ClientID, thunkApi) => {
  try {
    const { data } = await fetchClientDetails(ClientID);
    const results = data.results.data;
    return results;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    return thunkApi.rejectWithValue(message);
  }
});

export const clientUpdation = createAsyncThunk("client/clientUpdation", async (values, thunkApi) => {
  try {
    const { data } = await updateClient(values.ClientID, values);
    thunkApi.dispatch(setEdit(false));
    Router.back();
    ToastNotification("success", data.results.message);

    return data;
  } catch (error) {
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

export const activateClientSubscription = createAsyncThunk("client/activateClientSubscription", async (values, thunkApi) => {
  try {
    const { data } = await activateSubscription(values.ClientID);
    ToastNotification("success", data.results.message);
    thunkApi.dispatch(getClient(values.ClientID));
    return data;
  } catch (error) {
    const message = error?.response?.data?.errors?.message || "Activation failed";
    ToastNotification("error", message);
    return thunkApi.rejectWithValue(message);
  }
});

export const clientDeletion = createAsyncThunk("client/clientDeletion", async (ClientID, thunkApi) => {
  console.log("slice query0", ClientID.clientId + `?${ClientID.client}`);
  try {
    const { data } = await deleteClient(ClientID.clientId + `?Status=${ClientID.client}`);
    const results = data.results;
    data.success && ToastNotification("success", results.message);
    thunkApi.dispatch(getAllClients());
    thunkApi.dispatch(getClient(ClientID.clientId));
    //Router.back();
    return results;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    ToastNotification("error", message);
    return thunkApi.rejectWithValue(message);
  }
});

export const clientSearch = createAsyncThunk("client/clientSearch", async (searchData, thunkApi) => {
  try {
    const res = await searchClient(searchData);
    return res.data.results.data;
  } catch (error) {
    const message = error.responce.data.message;
    ToastNotification("error", message);
    return thunkApi.rejectWithValue(message);
  }
});

export const clientSlice = createSlice({
  name: "client",
  initialState: initialState,
  reducers: {
    setEdit: (state, action) => {
      return {
        ...state,
        isEdit: action.payload,
      };
    },
    setCurrentClientId: (state, action) => {
      return {
        ...state,
        currentClientId: action.payload,
      };
    },
    setSearchKey: (state, action) => {
      return {
        ...state,
        searchKey: action.payload,
      };
    },
    setFilterData: (state, action) => {
      return {
        ...state,
        filterData: action.payload,
      };
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action) => {
        return {
          ...state,
          ...action.payload.auth,
        };
      })
      .addCase(getAllClients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllClients.fulfilled, (state, action) => {
        state.isLoading = false;
        //state.clientList = action.payload.filter((client) => client.Status !== 0);
        state.clientList = action.payload;
      })
      .addCase(getAllClients.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(clientCreation.pending, (state) => {
        state.isClientCreating = true;
      })
      .addCase(clientCreation.fulfilled, (state) => {
        state.isClientCreating = false;
      })
      .addCase(clientCreation.rejected, (state) => {
        state.isClientCreating = false;
      })
      .addCase(getClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.client = action.payload;
      })
      .addCase(getClient.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(clientUpdation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clientUpdation.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(clientUpdation.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(activateClientSubscription.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(activateClientSubscription.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(activateClientSubscription.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(clientDeletion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clientDeletion.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(clientDeletion.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(clientSearch.pending, (state) => {
        state.IsSearch = true;
      })
      .addCase(clientSearch.fulfilled, (state, action) => {
        state.IsSearch = false;
        state.clientList = action.payload;
      })
      .addCase(clientSearch.rejected, (state, action) => {
        state.IsSearch = false;
      });
  },
});

export const { setEdit, setCurrentClientId, setSearchKey, setFilterData } = clientSlice.actions;
// Selectors
export const selectClientList = (state) => state.client.clientList;
export const selectClient = (state) => state.client.client;
export const selectIsLoading = (state) => state.client.isLoading;
export const selectIsEdit = (state) => state.client.isEdit;
export const selectIsSearch = (state) => state.client.IsSearch;
export const selectCurrentClientId = (state) => state.client.currentClientId;
export const selectSearchKey = (state) => state.client.searchKey;
export const selectIsClientCreating = (state) => state.client.isClientCreating;
export const selectFilterData = (state) => state.client.filterData;
