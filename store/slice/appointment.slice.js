import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ToastNotification } from "../../components/shared/toast";

import { fetchAllAppointmentsService, updateAppointmentService, createAppointmentService } from "../../services/appointment.services";

export const fetchAllAppointments = createAsyncThunk("appointment/fetchAllAppointments", async (thunkApi) => {
  try {
    const { data } = await fetchAllAppointmentsService();
    return data.results.data;
  } catch (error) {
    const message = error.responce.data.message;
    return thunkApi.rejectWithValue(message);
  }
});

export const createAppointment = createAsyncThunk("appointment/createAppointment", async (values, thunkApi) => {
  try {
    const { data } = await createAppointmentService(values);
    await thunkApi.dispatch(fetchAllAppointments());
    ToastNotification("success", data.results.message || "Appointment created successfully");
    return data;
  } catch (error) {
    const err = error.response?.data?.errors;
    if (Array.isArray(err)) {
      err.forEach((e) => ToastNotification("error", "Failed", e.param + " " + e.msg));
    } else {
      ToastNotification("error", err?.message || "Failed to create appointment");
    }
    return thunkApi.rejectWithValue(err?.message);
  }
});

export const updateAppointment = createAsyncThunk("appointment/updateAppointment", async (values, thunkApi) => {
  try {
    const { AppointmentID, AppointmentStatus } = values;
    const { data } = await updateAppointmentService(AppointmentID, { AppointmentStatus });
    await thunkApi.dispatch(fetchAllAppointments());
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

const initialState = {
  appointments: [],
  isLoading: false,
};

export const appointmentSlice = createSlice({
  name: "appointment",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAppointments.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAllAppointments.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAppointment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createAppointment.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const selectAppointmentsList = (state) => state.appointment.appointments;
export const selectAppointmentsLoading = (state) => state.appointment.isLoading;
