import axios from "axios";
import Router from "next/router";
import RESPONSE_CODE from "../constants/response-code.constant";
const { clearAuth } = require("./auth.util");
/**
 * @link https://axios-http.com/docs/instance
 * @link https://axios-http.com/docs/interceptors
 */

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

export const resInterceptor = axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response) {
      const statusCode = error.response.status;
      // Access Token was expired
      if (statusCode === RESPONSE_CODE.INTERNAL_ERROR) {
        const responseErrors = error.response.data.errors;
        if (responseErrors.message === "Refresh token expired") {
          clearAuth();
          Router.push("/login");
        }
        // Do something
        return Promise.reject(error.response.data);
      }
      // Access Token was expired
      if (statusCode === RESPONSE_CODE.BAD_REQUEST) {
        const responseErrors = error.response.data.errors[0];

        if (responseErrors.param === "RefreshToken") {
          clearAuth();
          Router.push("/login");
        } else {
          return Promise.reject(error.response.data);
        }
        // Do something
      }
    }
    return Promise.reject(error);
  }
);
