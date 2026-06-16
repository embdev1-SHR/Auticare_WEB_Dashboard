import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ToastNotification } from "../../components/shared/toast";
import { AtStoreCreation, AtStoreDetailsService, AtStoreListService, AtStoreUpdateService, DeleteStoreEnquiryService, MarkAsReadService, storeCreation, storeEnquiryListService } from "../../services/store.services";



export const storeEnquiryList = createAsyncThunk("storeSlice/storeEnquiryList", async () => {
    try {
        const res = await storeEnquiryListService();
        return res.data.results.data;
    } catch (error) {
        console.log(error);
        return error;
    }
});


export const AtStoreList = createAsyncThunk("storeSlice/AtStoreList", async () => {
    try {
        const res = await AtStoreListService();
        return res.data.results.data;
    } catch (error) {
        console.log(error);
        return error;
    }
});


export const AtStoreDetails = createAsyncThunk("storeSlice/AtStoreDetails", async (data, thunkApi) => {
    try {
        const res = await AtStoreDetailsService(data);
        return res.data.results.data;
    } catch (error) {
        console.log(error);
        return error;
    }
});


export const markAsRead = createAsyncThunk("storeSlice/markAsRead", async (data, thunkApi) => {
    try {
        const res = await MarkAsReadService(data);
        ToastNotification("success", " Mark As Read success");
         thunkApi.dispatch(storeEnquiryList());
        return res.data.results.message;
    } catch (error) {
        console.log(error);
        ToastNotification("error", " Mark As Read Failed");
        return error;
    }
});


export const storeCreationSlice = createAsyncThunk("storeSlice/storeCreationSlice", async (data) => {
    try {
        const res = await storeCreation(data.data);
        ToastNotification("success", "Enquiry added successfully");
        await data.setOpen(false);
        await data.resetForm();
        return res.data.results.data;
    } catch (error) {
        console.log(error);
        ToastNotification("error", " Enquiry added Failed");
        return error;
    }
});

export const deleteStoreEnquiry = createAsyncThunk("storeSlice/deleteStoreEnquiry", async (StoreEnquiryID, thunkApi) => {
    try {
        const res = await DeleteStoreEnquiryService(StoreEnquiryID);
        ToastNotification("success", "Enquiry deleted successfully");
        thunkApi.dispatch(storeEnquiryList());
        return res.data.results.message;
    } catch (error) {
        console.log(error);
        ToastNotification("error", "Delete failed");
        return error;
    }
});

export const AtStoreCreationSlice = createAsyncThunk("storeSlice/AtStoreCreationSlice", async (data, thunkApi) => {
    try {
        const res = await AtStoreCreation(data);
        ToastNotification("success", "Created successfully");
        await thunkApi.dispatch(AtStoreList());
        return res.data.results.data;
    } catch (error) {
        console.log(error);
        ToastNotification("error", " Creation Failed");
        return error;
    }
});


export const AtStoreUpdateSlice = createAsyncThunk("storeSlice/AtStoreUpdateSlice", async (data, thunkApi) => {
    try {
        const res = await AtStoreUpdateService(data);
        ToastNotification("success", "update successfully");
        await thunkApi.dispatch(AtStoreList());
        return res.data.results.data;
    } catch (error) {
        console.log(error);
        ToastNotification("error", " update Failed");
        return error;
    }
});

export const storeSlice = createSlice({
    name: "storeSlice",
    initialState: {
        isLoading: false,
        isMainPageLoading: false,
        storeList: [],
        AtStoreList: [],
        AtStoreDetailsData: [],
        IsEdit: false,
        ProductID:[],
        Edit:false

    },
    reducers: {
        setAtStoreEdit: (state, action) => {
            return {
                ...state,
                IsEdit: action.payload,
            };
        },
        setAtStoreID: (state, action) => {
            return {
                ...state,
                ProductID: action.payload,
            };
        },
        IsEditStore: (state, action) => {
            return {
                ...state,
                Edit: action.payload,
            };
        },
    },
    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    extraReducers: (builder) => {
        builder

            .addCase(storeEnquiryList.pending, (state, action) => {
                state.isMainPageLoading = true;
            })
            .addCase(storeEnquiryList.fulfilled, (state, action) => {
                state.isMainPageLoading = false;
                state.storeList = action.payload;
            })
            .addCase(storeEnquiryList.rejected, (state, action) => {
                state.isMainPageLoading = false;
            })
            .addCase(AtStoreDetails.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(AtStoreDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.AtStoreDetailsData = action.payload;
            })
            .addCase(AtStoreDetails.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(AtStoreList.pending, (state, action) => {
                state.isMainPageLoading = true;
            })
            .addCase(AtStoreList.fulfilled, (state, action) => {
                state.isMainPageLoading = false;
                state.AtStoreList = action.payload;
            })
            .addCase(AtStoreList.rejected, (state, action) => {
                state.isMainPageLoading = false;
            })
            .addCase(markAsRead.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(markAsRead.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(storeCreationSlice.pending, (state, action) => {
                state.isMainPageLoading = true;
            })
            .addCase(storeCreationSlice.fulfilled, (state, action) => {
                state.isMainPageLoading = false;
            })
            .addCase(storeCreationSlice.rejected, (state, action) => {
                state.isMainPageLoading = false;
            })
            .addCase(deleteStoreEnquiry.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteStoreEnquiry.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(deleteStoreEnquiry.rejected, (state) => {
                state.isLoading = false;
            })
    },
});

export const { setAtStoreEdit, setAtStoreID, IsEditStore } = storeSlice.actions;


export const StoreIsLoading = (state) => state.storeSlice.isLoading;
export const StoreMainIsLoading = (state) => state.storeSlice.isMainPageLoading;
export const fetchAllStoreList = (state) => state.storeSlice.storeList;
export const fetchAllAtStoreList = (state) => state.storeSlice.AtStoreList;
export const AtStoreDetail = (state) => state.storeSlice.AtStoreDetailsData;
export const selectAtStoreIsEdit = (state) => state.storeSlice.IsEdit;
export const selectAtStoreID = (state) => state.storeSlice.ProductID;
export const StoreEdit = (state) => state.storeSlice.Edit;
