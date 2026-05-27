import * as yup from "yup";
import { PINCODES } from "../../../constants/regExp/pincode.regex";

const PatientValidation = (tab,access) => {
  const { isTherapistManagementAccess, isCenterManagementAccess } = access;
  switch (tab) {
    case 1:
      return yup.object().shape({
        PatientName: yup.string().min(2, "Too Short!").max(100, "Too Long!").required("Patient name is required"),
        DOB: yup.date().max(new Date(), "Date cannot be in the future").required("Invalid date of birth"),
        Gender: yup.string().required("Gender is required"),
        AddressLine1: yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Address1 is required"),
        AddressLine2: yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Address2 is required"),
        City: yup.string().min(2, "Too Short!").max(100, "Too Long!").required("City is required"),
        District: yup.string().min(2, "Too Short!").max(100, "Too Long!").required("District is required"),
        Pincode: yup
          .string()
          .min(4, "Too Short!")
          .max(25, "Too Long!")
          .required("Please enter pincode")
          .matches(/^[a-z0-9][a-z0-9]{0,4}[ - ]?[a-z0-9]{0,5}$/, "Invalid pincode")
          .test("Country", "Select a country first", (value, context) => {
            if (context.parent.Country === undefined) {
              return false;
            }
            return true;
          })
          .test("pin", "Invalid pincode", (value, context) => {
            const currentCountry = PINCODES.find((pinobj) => pinobj.Country?.toUpperCase() === context.parent.Country?.toUpperCase());
            let valide = false;

            if (currentCountry && value) {
              valide = new RegExp(currentCountry.Regex).test(value?.replace(/ /g, ""));
            }
            return valide;
          }),
        State: yup.string().max(100, "Too Long!").required("State is required"),
        Country: yup.string().max(100, "Too Long!").required("Country is required"),
      });
    case 2:
      return yup.object().shape({
        ParentName: yup.string().min(2, "Too Short!").max(100, "Too Long!").required("Parent Name is required"),
        Salutation: yup.string().min(2, "Too Short!").max(20, "Too Long!").required("Salutaion is required"),
        ParentEmailID: yup.string().max(191, "Too Long!").email("Invalid email").required("Email is required"),
        ParentPhone: yup.string().max(20, "Too Long!").required("Phone number is required"),
        Relationship: yup.string().max(100, "Too Long!").required("Relationship is required"),
      });
    case 3:
      return yup.object().shape({
        Previoustreatmenthistory: yup.string().max(500, "Too Long!").required("Previous treatment history is required"),
        DocumentsURL: yup.string().required("Documents is required"),
        ReportsURL: yup.string().required("Reports is required"),
        Remarks: yup.string().min(2, "Too Short!").max(500, "Too Long!").required("Remarks is required"),
      });
    case 4:
      return yup.object().shape({
        Center: isCenterManagementAccess?yup.string().matches("").required("Please select a center"):null,
        Departments: yup.string().matches("").required("Please select department"),
        Therapist: isTherapistManagementAccess?yup.string().matches("").required("Please select Therapist"):null,
      });
    default:
      return yup.object().shape({
        PatientName: yup.string().min(2, "Too Short!").max(100, "Too Long!").required("Patient name is required"),
        DOB: yup.date().max(new Date(), "Date cannot be in the future").required("Invalid date of birth"),
        Gender: yup.string().required("Gender is required"),
        AddressLine1: yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Address1 is required"),
        AddressLine2: yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Address2 is required"),
        City: yup.string().min(2, "Too Short!").max(100, "Too Long!").required("City is required"),
        District: yup.string().min(2, "Too Short!").max(100, "Too Long!").required("District is required"),
        Pincode: yup
          .string()
          .min(4, "Too Short!")
          .max(25, "Too Long!")
          .required("Please enter pincode")
          .matches(/^[a-z0-9][a-z0-9]{0,4}[ - ]?[a-z0-9]{0,5}$/, "Invalid pincode")
          .test("Country", "Select a country first", (value, context) => {
            if (context.parent.Country === undefined) {
              return false;
            }
            return true;
          })
          .test("pin", "Invalid pincode", (value, context) => {
            const currentCountry = PINCODES.find((pinobj) => pinobj.Country?.toUpperCase() === context.parent.Country?.toUpperCase());
            let valide = false;
            if (currentCountry && value) {
              valide = new RegExp(currentCountry.Regex).test(value?.replace(/ /g, ""));
            }
            return valide;
          }),
        State: yup.string().max(100, "Too Long!").required("State is required"),
        Country: yup.string().max(100, "Too Long!").required("Country is required"),
        ParentName: yup.string().min(2, "Too Short!").max(100, "Too Long!").required("Parent Name is required"),
        Salutation: yup.string().min(2, "Too Short!").max(20, "Too Long!").required("Salutaion is required"),
        ParentEmailID: yup.string().max(191, "Too Long!").email("Invalid email").required("Email is required"),
        ParentPhone: yup.string().max(20, "Too Long!").required("Phone number is required"),
        Relationship: yup.string().max(100, "Too Long!").required("Relationship is required"),
        Previoustreatmenthistory: yup.string().max(500, "Too Long!").required("Previous Treatment History is required"),
        DocumentsURL: yup.string().required("Documents is required"),
        ReportsURL: yup.string().required("Reports is required"),
        Remarks: yup.string().min(2, "Too Short!").max(500, "Too Long!").required("Remarks is required"),
        Center: isCenterManagementAccess?yup.string().required("Center is required"):null,
        Departments: yup.string().required("Departments is required"),
        Facilitator: yup.string().required("Facilitator is required"),
      });
  }
};

export default PatientValidation;
