import axios from "axios";
import Router from "next/router";
// import authConstants from "../constants/auth.constant";
import RESPONSE_CODE from "../constants/response-code.constant";
const {
  getRefreshToken,
  getAccessToken,
  setAccessToken,
  clearAuth,
} = require("./auth.util");

/**
 * @link https://axios-http.com/docs/instance
 * @link https://axios-http.com/docs/interceptors
 */
export const Axios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  // timeout: 1000,
  headers: { "Content-Type": "application/json" },
});
export const AxiosBlob = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  headers: { "Content-Type": "blob" },
  responseType: "arraybuffer"
});

// Add a request interceptor
export const reqInterceptor = Axios.interceptors.request.use(
  function (config) {
    if (config.url.includes("/login")) {
      return config;
    }
    // Do something before request is sent
    if (window) {
      const token = getAccessToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Do something with request error
    console.log("error req - ", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
export const resInterceptor = Axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log(error);
    if (error.response) {
      const statusCode = error.response.status;

      // Access Token was expired
      if (statusCode === RESPONSE_CODE.INTERNAL_ERROR) {
        const responseErrors = error.response.data.errors;
        if (
          (responseErrors.name === "TokenExpiredError" ||
            responseErrors.name === "JsonWebTokenError") &&
          !originalConfig._retry
        ) {
          originalConfig._retry = true; //_retry flag set to true to avoid infinite loop
          try {
            const rs = await Axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh-token`,
              {
                RefreshToken: getRefreshToken(),
              }
            );

            const { accessToken } = rs.data.results;
            setAccessToken(accessToken);

            Axios.defaults.headers.Authorization = accessToken;

            return Axios(originalConfig);
          } catch (_error) {
            console.log(_error);
            clearAuth();
            Router.push("/login");
            return Promise.reject(_error);
          }
        }
        if (responseErrors.message === "Refresh token expired") {
          clearAuth();
          Router.push("/login");
        }
        // Do something
        return Promise.reject(error.response.data);
      }
      // if (statusCode === RESPONSE_CODE.UNAUTHORIZED && window) {
      //   // const router = useRouter();
      //   Router.push("/login");
      // }
    }
    return Promise.reject(error);
  }
);

// Add a request interceptor
AxiosBlob.interceptors.request.use(
  function (config) {
    if (config.url.includes("/login")) {
      return config;
    }
    // Do something before request is sent
    if (window) {
      const token = getAccessToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Do something with request error
    console.log("error req - ", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
AxiosBlob.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log(error);
    if (error.response) {
      const statusCode = error.response.status;

      // Access Token was expired
      if (statusCode === RESPONSE_CODE.INTERNAL_ERROR) {
        const responseErrors = error.response.data.errors;
        if (
          (responseErrors.name === "TokenExpiredError" ||
            responseErrors.name === "JsonWebTokenError") &&
          !originalConfig._retry
        ) {
          originalConfig._retry = true; //_retry flag set to true to avoid infinite loop
          try {
            const rs = await Axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh-token`,
              {
                RefreshToken: getRefreshToken(),
              }
            );

            const { accessToken } = rs.data.results;
            setAccessToken(accessToken);

            Axios.defaults.headers.Authorization = accessToken;

            return Axios(originalConfig);
          } catch (_error) {
            console.log(_error);
            clearAuth();
            Router.push("/login");
            return Promise.reject(_error);
          }
        }
        if (responseErrors.message === "Refresh token expired") {
          clearAuth();
          Router.push("/login");
        }
        // Do something
        return Promise.reject(error.response.data);
      }
      // if (statusCode === RESPONSE_CODE.UNAUTHORIZED && window) {
      //   // const router = useRouter();
      //   Router.push("/login");
      // }
    }
    return Promise.reject(error);
  }
);

export function removeRequestInterceptor(interceptor) {
  Axios.interceptors.request.eject(interceptor);
}

export function removeResponseInterceptor(interceptor) {
  Axios.interceptors.response.eject(interceptor);
}

export default Axios;
