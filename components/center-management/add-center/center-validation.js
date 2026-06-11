import * as yup from "yup";
import { PINCODES } from "../../../constants/regExp/pincode.regex";

const CenterValidation = (tab, isClientManagementAvailable = true) => {
  switch (tab) {
    case 1:
      return yup.object().shape({
        CenterName: yup
          .string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .required("Centername is required"),
        EmailId: yup
          .string()
          .max(191, "Too Long!")
          .email("Invalid email")
          .required("Email is required"),
        CenterType: yup.string().min(2, "Too Short!")
          .max(100, "Too Long!").required("Select one Centertype"),
        ClientID: isClientManagementAvailable
          ? yup.string().required("Select a ClientID")
          : yup.string().nullable(true),
        AddressLine1: yup
          .string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .required("Address is required"),
        AddressLine2: yup
          .string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .required("Address2 is required"),
        City: yup
          .string()
          .min(2, "Too Short!")
          .max(100, "Too Long!")
          .required("City is required"),
        District: yup
          .string()
          .min(2, "Too Short!")
          .max(100, "Too Long!")
          .required("District is required"),
        Pincode: yup
          .string()
          .min(4, "Too Short!")
          .max(10, "Too Long!")
          .required("Please enter pincode")
          .matches(
            /^[a-z0-9][a-z0-9]{0,4}[ - ]?[a-z0-9]{0,5}$/,
            "Invalid pincode"
          )
          .test("Country", "Select a country first", (value, context) => {
            if (context.parent.Country === undefined) {
              return false;
            }
            return true;
          })
          .test("pin", "Invalid pincode", (value, context) => {
            const currentCountry = PINCODES.find(
              (pinobj) =>
                pinobj.Country?.toUpperCase() ===
                context.parent.Country?.toUpperCase()
            );
            let valide = false;
            if (currentCountry && value) {
              valide = new RegExp(currentCountry.Regex).test(
                value?.replace(/ /g, "")
              );
            }
            return valide;
          }),
        State: yup.string().max(100, "Too Long!").required("State is required"),
        Country: yup.string().max(100, "Too Long!")
          .required("Country is required"),
        Phone: yup.string().max(25, "Too Long!").required("Phone number is required"),
        Password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        ConfirmPassword: yup.string().oneOf([yup.ref("Password"), null], "Passwords must match").required("Please confirm your password"),
      });
    case 2:
      return yup.object().shape({
        CenterHeadName: yup
          .string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .required("Center Head name is required"),
        CenterHeadEmailId: yup
          .string()
          .email("Invalid email")
          .max(200, "Too Long!")
          .required("Email is required"),
        CenterHeadDesignation: yup
          .string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .required("Designation is required"),
        CenterHeadSalutation: yup
          .string()
          .min(2, "Too Short!")
          .max(20, "Too Long!")
          .required("Salutation is required"),
        CenterHeadPhone: yup
          .string()
          .max(25, "Too Long!")
          .required("Phone number is required"),
      });
    default:
      return yup.object().shape({
        CenterName: yup
          .string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .required("Center Name is required"),
        EmailId: yup
          .string()
          .max(191, "Too Long!")
          .email("Invalid email")
          .required("Email is required"),
        CenterType: yup.string().min(2, "Too Short!")
          .max(100, "Too Long!").required("Select one Center Type"),
        AddressLine1: yup
        .string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .required("Address is required"),
      AddressLine2: yup
        .string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .required("Address2 is required"),
      City: yup
        .string()
        .min(2, "Too Short!")
        .max(100, "Too Long!")
        .required("City is required"),
      District: yup
        .string()
        .min(2, "Too Short!")
        .max(100, "Too Long!")
        .required("District is required"),
        Pincode: yup
          .string()
          .min(4, "Too Short!")
          .max(10, "Too Long!")
          .required("Please enter pincode")
          .matches(
            /^[a-z0-9][a-z0-9]{0,4}[ - ]?[a-z0-9]{0,5}$/,
            "Invalid pincode"
          )
          .test("Country", "Select a country first", (value, context) => {
            if (context.parent.Country === undefined) {
              return false;
            }
            return true;
          })
          .test("pin", "Invalid pincode", (value, context) => {
            const currentCountry = PINCODES.find(
              (pinobj) =>
                pinobj.Country?.toUpperCase() ===
                context.parent.Country?.toUpperCase()
            );
            let valide = false;
            if (currentCountry && value) {
              valide = new RegExp(currentCountry.Regex).test(
                value?.replace(/ /g, "")
              );
            }
            return valide;
          }),
        State: yup.string().max(100, "Too Long!").required("State is required"),
        Country: yup.string().max(100, "Too Long!")
          .required("Country is required"),
        Phone: yup.string().max(25, "Too Long!").required("Phone number is required"),
        CenterHeadName: yup
          .string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .required("CenterHead name is required"),
        CenterHeadEmailId: yup
          .string()
          .email("Invalid email")
          .max(200, "Too Long!")
          .required("Email is required"),
        CenterHeadDesignation: yup
          .string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .required("Designation is required"),
        CenterHeadSalutation: yup
          .string()
          .min(2, "Too Short!")
          .max(20, "Too Long!")
          .required("Salutation is required"),
        CenterHeadPhone: yup
          .string()
          .max(25, "Too Long!")
          .required("Phone number is required"),
      });
  }
};

export default CenterValidation;
