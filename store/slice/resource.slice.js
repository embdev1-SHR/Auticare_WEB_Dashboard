import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ToastNotification } from "../../components/shared/toast";
import {
    AddResources,
    fetchAllResources,
    ViewResources,
    updateResourcesService
} from "../../services/resource.services";
import { setModalOpen } from "./layout.slice";




export const CreateFreeResources = createAsyncThunk("resources/CreateFreeResources", async (data, thunkApi) => {
    try {
        const res = await AddResources(data);
        ToastNotification("success", " Resources created successfully");
        await thunkApi.dispatch(setModalOpen(false));
        await thunkApi.dispatch(FetchAllResources());
        return res.data.results.message;
    } catch (error) {
        console.log(error);
        ToastNotification("error", " Resources creation Failed");
        return error;
    }
});

export const UpdateFreeResources = createAsyncThunk("resources/UpdateFreeResources", async (data, thunkApi) => {
    try {
        const res = await updateResourcesService(data);
        if(data.msg){
            ToastNotification("success",data.msg);
        }
        else{
            ToastNotification("success",res.data.results.message);
        }
        await thunkApi.dispatch(FetchAllResources());
        await thunkApi.dispatch(ViewResourcesSlice(data.FreeResourceID));
        return res.data.results.message;
    } catch (error) {
        console.log(error);
        ToastNotification("error", " Resources Update Failed");
        return error;
    }
});

export const FetchAllResources = createAsyncThunk("resources/FetchAllResources", async (data, thunkApi) => {
    try {
        const res = await fetchAllResources();
        return res.data.results.data;
    } catch (error) {
        console.log(error);
        return error;
    }
});

export const ViewResourcesSlice = createAsyncThunk("resources/ViewResourcesSlice", async (data, thunkApi) => {

    try {
        const res = await ViewResources(data);
        return res.data.results.data;
    } catch (error) {
        console.log(error);
        return error;
    }
});




export const resourcesSlice = createSlice({
    name: "resources",
    initialState: {
        isLoading: false,
        resourcesList: [],
        resources: [],
        IsEdit: false
    },
    reducers: {
        setResourceEdit: (state, action) => {
            return {
                ...state,
                IsEdit: action.payload,
            };
        },
    },
    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    extraReducers: (builder) => {
        builder
            .addCase(CreateFreeResources.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(CreateFreeResources.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(FetchAllResources.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(FetchAllResources.fulfilled, (state, action) => {
                state.isLoading = false;
                state.resourcesList = action.payload;
            })
            .addCase(ViewResourcesSlice.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(ViewResourcesSlice.fulfilled, (state, action) => {
                state.isLoading = false;
                state.resources = action.payload;
            })
            .addCase(UpdateFreeResources.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(UpdateFreeResources.fulfilled, (state, action) => {
                state.isLoading = false;
            })
    },
});
export const { setResourceEdit } = resourcesSlice.actions;

export const ResourceIsLoading = (state) => state.resources.isLoading;
export const fetchAllResource = (state) => state.resources.resourcesList;
export const viewResource = (state) => state.resources.resources;
export const selectIsEdit = (state) => state.resources.IsEdit;
