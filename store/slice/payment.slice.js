import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ToastNotification } from "../../components/shared/toast";
import {
    AddPaymentService,
    fetchAllPaymentService,
    ViewPaymentService,
    updateResourcesService,
    updatePaymentService
} from "../../services/payment.services";
import { setModalOpen } from "./layout.slice";


export const addPayment = createAsyncThunk("resources/addPayment", async (data, thunkApi) => {
    try {
        const res = await AddPaymentService(data);
        ToastNotification("success", " Payment created successfully");
        await thunkApi.dispatch(setModalOpen(false));
        await thunkApi.dispatch(fetchAllPayment());
        return res.data.results.message;
    } catch (error) {
        console.log(error);
        ToastNotification("error", " Payment creation Failed");
        return error;
    }
});

export const fetchAllPayment = createAsyncThunk("resources/fetchAllPayment", async (data, thunkApi) => {
    try {
        const res = await fetchAllPaymentService();
        return res.data.results.data;
    } catch (error) {
        console.log(error);
        return error;
    }
});

export const PaymentDetails = createAsyncThunk("resources/PaymentDetails", async (data, thunkApi) => {
    try {
        const res = await ViewPaymentService(data);
        return res.data.results.data;
    } catch (error) {
        console.log(error);
        return error;
    }
});

export const updatePayment = createAsyncThunk("resources/updatePayment", async (data, thunkApi) => {
    try {
        const res = await updatePaymentService(data);
        data.msg ? ToastNotification("success", data.msg) :ToastNotification("success", " Payment update successfully");
        await thunkApi.dispatch(fetchAllPayment());
        await thunkApi.dispatch(PaymentDetails(data.PaymentID));
        return res.data.results.message;
    } catch (error) {
        console.log(error);
        ToastNotification("error", " Payment update Failed");
        return error;
    }
});


export const paymentSlice = createSlice({
    name: "paymentSlice",
    initialState: {
        isLoading: false,
        paymentList: [],
        paymentDetails: [],
        IsEdit: false,
        payment:[]
    },
    reducers: {
        setResourceEdit: (state, action) => {
            return {
                ...state,
                IsEdit: action.payload,
            };
        },
        tableSearch: (state, action) => {
            return {
                ...state,
                payment: action.payload,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addPayment.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(addPayment.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(updatePayment.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(updatePayment.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(fetchAllPayment.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchAllPayment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.paymentList = action.payload;
                state.payment = action.payload;
            })
            .addCase(PaymentDetails.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(PaymentDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.paymentDetails = action.payload;
            })
    },
});

export const { setResourceEdit, tableSearch } = paymentSlice.actions;

export const paymentSliceIsLoading = (state) => state.paymentSlice.isLoading;
export const fetchAllPaymentList = (state) => state.paymentSlice.paymentList;
export const IsEditPayment = (state) => state.paymentSlice.IsEdit;
export const PaymentListDetails = (state) => state.paymentSlice.paymentDetails;
export const PaymentSearch = (state) => state.paymentSlice.payment;
