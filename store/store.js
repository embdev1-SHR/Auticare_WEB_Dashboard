import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { authSlice } from "./slice/auth.slice";
import { layoutSlice } from "./slice/layout.slice";
import { commonSlice } from "./slice/common.slice";
import { clientSlice } from "./slice/client.slice";
import { departmentSlice } from "./slice/department.slice";
import { centerSlice } from "./slice/center.slice";
import { skillSlice } from "./slice/skills.slice";
import { therapistSlice } from "./slice/therapist.slice";
import { contentSlice } from "./slice/content.slice";
import { patientSlice } from "./slice/patient.slice";
import { therapySlice } from "./slice/therapies.slice";
import { subscriptionSlice } from "./slice/subscription.slice";
import { scaleSlice } from "./slice/scale.slice";
import { assessmentSlice } from "./slice/assessment.slice";
import { goalSlice } from "./slice/goal.slice";
import { appointmentSlice } from "./slice/appointment.slice";
import { resourcesSlice } from "./slice/resource.slice";
import { paymentSlice } from "./slice/payment.slice";
import { storeSlice } from "./slice/store.slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [authSlice.name]: authSlice.reducer,
      [layoutSlice.name]: layoutSlice.reducer,
      [commonSlice.name]: commonSlice.reducer,
      [clientSlice.name]: clientSlice.reducer,
      [departmentSlice.name]: departmentSlice.reducer,
      [centerSlice.name]: centerSlice.reducer,
      [skillSlice.name]: skillSlice.reducer,
      [scaleSlice.name]: scaleSlice.reducer,
      [therapistSlice.name]: therapistSlice.reducer,
      [contentSlice.name]: contentSlice.reducer,
      [patientSlice.name]: patientSlice.reducer,
      [therapySlice.name]: therapySlice.reducer,
      [subscriptionSlice.name]: subscriptionSlice.reducer,
      [assessmentSlice.name]: assessmentSlice.reducer,
      [goalSlice.name]: goalSlice.reducer,
      [appointmentSlice.name]: appointmentSlice.reducer,
      [resourcesSlice.name]: resourcesSlice.reducer,
      [paymentSlice.name]: paymentSlice.reducer,
      [storeSlice.name]: storeSlice.reducer,
    },
    devTools: process.env.NEXT_PUBLIC_APP_ENV !== "production",
  });
};
export const wrapper = createWrapper(makeStore, {
  debug: process.env.NEXT_PUBLIC_APP_ENV !== "production",
});
