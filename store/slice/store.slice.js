import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ToastNotification } from "../../components/shared/toast";
import { AtStoreCreation, AtStoreDetailsService, AtStoreListService, AtStoreUpdateService, AtStoreDeleteService, AtStoreBulkCreateService, DeleteStoreEnquiryService, MarkAsReadService, storeCreation, storeEnquiryListService, storeOrderListService, storeOrderCreateService, storeOrderUpdateService, storeOrderDeleteService } from "../../services/store.services";



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

export const deleteAtStore = createAsyncThunk("storeSlice/deleteAtStore", async (ProductID, thunkApi) => {
    try {
        const res = await AtStoreDeleteService(ProductID);
        ToastNotification("success", "Product deleted successfully");
        thunkApi.dispatch(AtStoreList());
        return res.data.results.message;
    } catch (error) {
        console.log(error);
        ToastNotification("error", "Delete failed");
        return error;
    }
});

export const atStoreBulkCreate = createAsyncThunk("storeSlice/atStoreBulkCreate", async (products, thunkApi) => {
    try {
        const res = await AtStoreBulkCreateService(products);
        ToastNotification("success", res.data.results.message || "Products uploaded successfully");
        thunkApi.dispatch(AtStoreList());
        return res.data.results.message;
    } catch (error) {
        console.log(error);
        const msg = error.response?.data?.errors?.message || error.errors?.message || "Bulk upload failed";
        ToastNotification("error", msg);
        return error;
    }
});

export const storeOrderList = createAsyncThunk("storeSlice/storeOrderList", async () => {
    try {
        const res = await storeOrderListService();
        return res.data.results.data;
    } catch (error) {
        console.log(error);
        return error;
    }
});

export const storeOrderCreate = createAsyncThunk("storeSlice/storeOrderCreate", async (payload) => {
    try {
        const res = await storeOrderCreateService(payload.data);
        ToastNotification("success", "Order placed successfully");
        payload.setOpen(false);
        payload.resetForm();
        return res.data.results.message;
    } catch (error) {
        console.log(error);
        const msg = error?.errors?.message || error?.response?.data?.errors?.message || "Failed to place order";
        ToastNotification("error", msg);
        return error;
    }
});

export const storeOrderUpdate = createAsyncThunk("storeSlice/storeOrderUpdate", async (data, thunkApi) => {
    try {
        const res = await storeOrderUpdateService(data);
        ToastNotification("success", "Order status updated");
        thunkApi.dispatch(storeOrderList());
        return res.data.results.message;
    } catch (error) {
        console.log(error);
        ToastNotification("error", "Failed to update order");
        return error;
    }
});

export const storeOrderDelete = createAsyncThunk("storeSlice/storeOrderDelete", async (StoreOrderID, thunkApi) => {
    try {
        const res = await storeOrderDeleteService(StoreOrderID);
        ToastNotification("success", "Order deleted successfully");
        thunkApi.dispatch(storeOrderList());
        return res.data.results.message;
    } catch (error) {
        console.log(error);
        ToastNotification("error", "Failed to delete order");
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
        ProductID: [],
        Edit: false,
        orderList: [],
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
            .addCase(deleteAtStore.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteAtStore.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(deleteAtStore.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(atStoreBulkCreate.pending, (state) => {
                state.isMainPageLoading = true;
            })
            .addCase(atStoreBulkCreate.fulfilled, (state) => {
                state.isMainPageLoading = false;
            })
            .addCase(atStoreBulkCreate.rejected, (state) => {
                state.isMainPageLoading = false;
            })
            .addCase(storeOrderList.pending, (state) => {
                state.isMainPageLoading = true;
            })
            .addCase(storeOrderList.fulfilled, (state, action) => {
                state.isMainPageLoading = false;
                state.orderList = action.payload;
            })
            .addCase(storeOrderList.rejected, (state) => {
                state.isMainPageLoading = false;
            })
            .addCase(storeOrderCreate.pending, (state) => {
                state.isMainPageLoading = true;
            })
            .addCase(storeOrderCreate.fulfilled, (state) => {
                state.isMainPageLoading = false;
            })
            .addCase(storeOrderCreate.rejected, (state) => {
                state.isMainPageLoading = false;
            })
            .addCase(storeOrderUpdate.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(storeOrderUpdate.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(storeOrderUpdate.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(storeOrderDelete.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(storeOrderDelete.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(storeOrderDelete.rejected, (state) => {
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
export const fetchAllOrderList = (state) => state.storeSlice.orderList;
