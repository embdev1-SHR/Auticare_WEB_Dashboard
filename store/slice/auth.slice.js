import { HYDRATE } from "next-redux-wrapper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../util/api.server.util";
import Axios from "../../util/api.util";
import { ToastNotification } from "../../components/shared/toast";
import Router from "next/router";
const { setAuth, getRefreshToken, clearAuth } = require("../../util/auth.util");

const initialState = {
  isLogin: false,
  logoutLoading: false,
  EmailId: null,
  RoleName: null,
  UserID: null,
  UserData: null,
  RoleBasedModules: null,
};

/**
 * reference
 * @link https://blog.logrocket.com/use-redux-next-js/
 * @link https://github.com/kirill-konshin/next-redux-wrapper#redux-toolkit
 */

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login: (state) => {
      return {
        ...initialState,
        // ...state,
        isLogin: true,
      };
    },


    logout(state) {
      Object.assign(initialState)
    },
    logoutLoader: (state, action) => {
      return {
        logoutLoading: action.payload
      };
    },
    setUserData: (state, action) => {
      return {
        ...state,
        EmailId: action.payload.EmailId,
        RoleName: action.payload.RoleName,
        UserID: action.payload.UserID,
        UserData: action.payload,
        RoleBasedModules: action.payload.RoleBasedModules,
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
      // .addCase(signOut.pending, (state) => {
      //   state.logoutLoading = true;
      // })
      // .addCase(signOut.fulfilled, (state, action) => {
      //   state.logoutLoading = false;
      //   // state.clientList = action.payload;
      // })
      .addCase(signOut.rejected, (state) => {
        state.logoutLoading = false;
      });
  },
});

/** async actions sample
 * @link https://github.com/kirill-konshin/next-redux-wrapper#redux-toolkit
 */
export const signIn = (values) => async (dispatch, getState) => {
  const loginCredentials = {
    EmailId: values.username,
    Password: values.password,
  };

  try {
    const { data } = await Axios.post(`/api/v1/auth/login`, loginCredentials);
    console.log("data", data);
    const { accessToken, refreshToken } = data.results;
    await setAuth(accessToken, refreshToken);
    await dispatch(login());
    await dispatch(getUserData());
    return data;
  } catch (err) {
    console.log(err);
    const { errors } = err.response ? err.response.data : err;
    console.log("errors", errors);
    return errors;
  }
};

export const signOut = createAsyncThunk("auth/signOut", async (args, thunkAPI) => {
  try {
    const RefreshTokenValue = await getRefreshToken();
    const { data } = await Axios.post(`/api/v1/auth/logout`, {
      RefreshToken: RefreshTokenValue,
    });
    thunkAPI.dispatch(logout());
    await clearAuth();
    Router.push("/login");
    window.location = window.location;
    return data;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const getUserData = createAsyncThunk("auth/getUserData", async (args, thunkAPI) => {
  try {
    const RefreshTokenValue = await getRefreshToken();
    if (RefreshTokenValue) {
      const { data } = await Axios.get(`/api/v1/users/details`);
      const SubscriptionPlan = data.results.data.SubscriptionPlan
      if (SubscriptionPlan && SubscriptionPlan.length > 0) {
        const endDate = SubscriptionPlan[SubscriptionPlan.length - 1].SubcriptionPlanEndDate
        const SubscriptionPlanEndDate = Date.parse(endDate)
        const currentDate = Date.parse(new Date())
        if (currentDate > SubscriptionPlanEndDate) {
          return Router.push("subscription-expired");
        } else {
          if (Router.asPath == "/subscription-expired") {
            Router.push("dashboard");
          }
        }
      }
      thunkAPI.dispatch(setUserData(data.results.data));
      return data;
    } else return;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (args, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post(`/api/v1/auth/forgot-password`, args);
    console.log(data);
    ToastNotification("success", data.results.message, null);
    return data;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    ToastNotification("error", message, null);
    return thunkAPI.rejectWithValue(message);
  }
});

export const confirmOTP = createAsyncThunk("auth/confirmOTP", async (args, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post(`/api/v1/auth/confirm-otp`, args);
    if (window) localStorage.setItem("token", data.results.token);
    return data;
  } catch (error) {
    console.log(error);
    const message = error.response.data.errors.message;
    ToastNotification("error", message, null);
    return thunkAPI.rejectWithValue(message);
  }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async (args, thunkAPI) => {
  try {
    if (!window) return;
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const { data } = token && (await axiosInstance.post(`/api/v1/auth/reset-password`, args, config));
    ToastNotification("success", data.results.message, null);
    return data;
  } catch (error) {
    console.log(error);
    const err = error.response.data.errors;
    if (Array.isArray(err)) {
      err.map((e) => {
        ToastNotification("error", "Failed", e.msg);
      });
    } else {
      const message = err.message;
      ToastNotification("error", message);
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const { login, logout, setUserData, logoutLoader } = authSlice.actions;
// Seletors
export const isloginState = (state) => state.auth.isLogin;
export const selectUserID = (state) => state.auth.UserID;
export const selectRole = (state) => state.auth.RoleName;
export const selectUserData = (state) => state.auth.UserData;
export const selectRoleBasedModules = (state) => state.auth.RoleBasedModules;
export const LogoutLoading = (state) => state.auth.logoutLoading;