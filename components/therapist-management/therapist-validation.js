import * as yup from "yup";
import { PHONE_COUNTRIES } from "../../constants/regExp/phone.regex";
import { PINCODES } from "../../constants/regExp/pincode.regex";

export const therapistValidation = (
  tab,
  isCenterManagementAvailable = true
) => {
  switch (tab) {
    case 1:
      return yup.object().shape({
        Salutation: yup
          .string()
          .max(20, "Too Long!")
          .matches(/^[A-Za-z]+[.]{0,1}$/, "Invalid salutation")
          .required("Please enter therapist salutation"),
        Name: yup
          .string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .matches(/^[A-Za-z\s.]+$/, "Invalid name")
          .required("Please enter therapist name"),
        EmailId: yup
          .string()
          .max(191, "Too Long!")
          .email("Invalid email")
          .matches(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Invalid email"
          )
          .required("Please enter email"),
        Phone: yup.string().required("Please enter phone"),
        Photo: yup.mixed().required("Please upload a photo"),
        Qualification: yup
          .string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .matches(/^[A-Za-z0-9\s.']+$/, "Invalid qualification")
          .required("Please enter qualification"),
        Experience: yup
          .number()
          .min(0, "Negative values not allowed")
          .max(99, "Too Large!")
          .required("Please enter experience"),
        AddressLine1: yup
          .string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .required("Please enter address"),
        AddressLine2: yup
          .string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .nullable(),
        City: yup
          .string()
          .min(2, "Too Short!")
          .max(100, "Too Long!")
          .required("Please enter city"),
        District: yup
          .string()
          .min(2, "Too Short!")
          .max(100, "Too Long!")
          .required("Please enter district"),
        Pincode: yup
          .string()
          .min(4, "Too Short!")
          .max(10, "Too Long!")
          .required("Please enter pincode")
          .test("pin", "Invalid Pincode", (value, context) => { 
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
            } else if (value) {
              valide = /^[a-z0-9][a-z0-9]{0,4}[- ]?[a-z0-9]{0,5}$/.test(value);
            }
            return valide;
          }),
        State: yup.string().max(100, "Too Long!").matches("").required("Please select state"),
        Country: yup.string().max(100, "Too Long!").matches("").required("Please select country"),
        Password: yup.string().min(6, "Password must be at least 6 characters").required("Please enter a password"),
        ConfirmPassword: yup.string().oneOf([yup.ref("Password"), null], "Passwords must match").required("Please confirm your password"),
      });
    case 2:
      return yup.object().shape({
        DocumentsURL: yup.mixed().required("Please upload document"),

        // DocumentsURL: yup.string().required("Please upload document"),
      });

    default:
      return yup.object().shape({
        // Center: yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Required"),
        CenterID: isCenterManagementAvailable
          ? yup.string().required("Select a Center")
          : yup.string().nullable(true),
        DepartmentID: yup
          .string()
          .matches("")
          .required("Please select a department"),
        Designation: yup
          .string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .matches(/^[A-Za-z\s,]+$/, "Invalid designation")
          .required("Please enter designation"),
        Language: yup
          .string()
          .min(2, "Too Short!")
          .max(100, "Too Long!")
          .matches(/^[A-Za-z\s,]+$/, "Invalid language")
          .required("Please enter language"),
        TherapistType: yup
          .string()
          .matches("")
          .required("Please select a facilitator"),
      });
  }
};

export function validateTherapistPhone(value, countryCode) {
  const correspondingCountry = PHONE_COUNTRIES.find(
    (country) => country.iso2 === countryCode.toUpperCase()
  );
  let valide = false;

  if (correspondingCountry && value) {
    valide = new RegExp(correspondingCountry.validation).test(
      value?.replace(/ /g, "")
    );
  } else if (value) {
    valide =
      /(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s.]?[(]?[0-9]{1,3}[)]?([-\s.]?[0-9]{3})([-\s.]?[0-9]{3,4})/.test(
        value?.replace(/ /g, "")
      );
  }
  let error = valide ? undefined : "Invalid phone number";
  return error;
}
