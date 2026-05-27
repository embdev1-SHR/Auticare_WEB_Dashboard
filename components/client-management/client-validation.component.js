import * as yup from "yup";
import { PHONE_COUNTRIES } from "../../constants/regExp/phone.regex";
import { PINCODES } from "../../constants/regExp/pincode.regex";

export const renderValidation = (tab) => {
  switch (tab) {
    case 1:
      return yup.object().shape({
        ClientName: yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Please enter a client name"),
        ClientLogo: yup.mixed().required("Please upload client logo"),
        EmailId: yup
          .string()
          .email("Invalid email")
          .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Invalid email")
          .required("Please enter an email"),
        Phone: yup.string().required("Please enter a phone number"),
        AddressLine1: yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Please enter address"),
        AddressLine2: yup.string().min(2, "Too Short!").max(200, "Too Long!").nullable(),
        City: yup.string().min(2, "Too Short!").max(100, "Too Long!").required("Please enter a city"),
        Pincode: yup
          .string()
          .min(4, "Too Short!")
          .max(20, "Too Long!")
          .required("Please enter pincode")
          .matches(/^[a-z0-9][a-z0-9]{0,4}[ - ]?[a-z0-9]{0,5}$/, "Invalid pincode")
          .test("pin", "Invalid pincode", (value, context) => {
            const currentCountry = PINCODES.find((pinobj) => pinobj.Country?.toUpperCase() === context.parent.Country?.toUpperCase());
            let valide = false;
            if (currentCountry && value) {
              valide = new RegExp(currentCountry.Regex).test(value?.replace(/ /g, ""));
            }
            return valide;
          }),
        State: yup.string().matches("").max(100, "Too Long!").required("Please select a state"),
        Country: yup.string().matches("").max(100, "Too Long!").required("Please select a country"),
        WebsiteURL: yup
          .string()
          .max(200, "Too Long!")
          // .matches(
          //   /^([H|h][T|t]{2}[P|p][S|s]?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
          //   "Invalid Website URL"
          // )
          .nullable(),
        ClientType: yup.string().max(100, "Too Long!").matches("").required("Please select a client type"),
        OrganizationType: yup.string().max(100, "Too Long!").required("Please select a organization type"),
      });
    case 2:
      return yup.object().shape({
        ContactPersonName: yup
          .string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .matches(/^[A-Za-z\s.]+$/, "Invalid name")
          .required("Please enter a name"),
        ContactEmailId: yup
          .string()
          .email("Invalid email")
          .max(200, "Too Long!")
          .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Invalid email")
          .required("Please enter an email"),
        // ContactPhone: yup.string().min(2, "Too Short!").max(20, "Too Long!").required("Required"),
        ContactPersonDesignation: yup
          .string()
          .min(2, "Too Short!")
          .max(100, "Too Long!")
          .matches(/^[A-Za-z\s,]+$/, "Invalid designation")
          .required("Please enter the designation"),
      });
    case 3:
      return yup.object().shape({
        IncorporationCertificateURL: yup.mixed().required("Please upload incorporation certificate"),
        RegistrationCertificateURL: yup.mixed().required("Please upload registration certificate"),
      });

    default:
      return yup.object().shape({
        BillingAddressLine1: yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Please enter address").nullable(),
        BillingAddressLine2: yup.string().min(2, "Too Short!").max(200, "Too Long!").nullable(),
        BillingCity: yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Please enter a city").nullable(),
        BillingDistrict: yup.string().min(2, "Too Short!").max(200, "Too Long!").nullable(),
        BillingPincode: yup
          .string()
          .min(4, "Too Short!")
          .max(20, "Too Long!")
          .required("Please enter pincode")
          .matches(/^[a-z0-9][a-z0-9]{0,4}[- ]?[a-z0-9]{0,5}$/, "Invalid pincode")
          .test("pincod", "Invalid pincode", (value, context) => {
            const currentCountry = PINCODES.find((pinobj) => pinobj.Country?.toUpperCase() === context.parent.BillingCountry?.toUpperCase());
            let valide = false;

            if (currentCountry && value) {
              valide = new RegExp(currentCountry.Regex).test(value?.replace(/ /g, ""));
            }
            return valide;
          })
          .nullable(),
        BillingState: yup.string().max(200, "Too Long!").matches("").required("Please select a state").nullable(),
        BillingCountry: yup.string().max(200, "Too Long!").matches("").required("Please select a country").nullable(),
        GSTNumber: yup
          .string()
          .min(15, "GST Number must be 15 characters long!")
          .max(15, "GST Number must be 15 characters long!")
          .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number")
          .required("Please enter GST Number"),
        BankAccountNumber: yup
          .string()
          .matches(/^[0-9\b]+$/, "Invalid account number")
          .min(9, "Too Short!")
          .max(30, "Too Long!")
          .nullable(),
        Bank: yup.string().min(2, "Too Short!").max(200, "Too Long!").nullable(),
        Branch: yup.string().min(2, "Too Short!").max(200, "Too Long!").nullable(),
        IFSCCode: yup
          .string()
          .min(11, "IFSC Code must be 11 characters long!")
          .max(15, "IFSC Code must be 11 characters long!")
          .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code")
          .nullable(),
        SubscriptionPlanId: yup.string().matches("").required("Please select subscription plan"),
        SubscriptionPlanStatus: yup.string().min(2, "Too Short!").max(100, "Too Long!").required("Status Required"),
        PaymentId: yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Payment Id Required"),
      });
  }
};

export function validatePhone(value, countryCode) {
  const correspondingCountry = PHONE_COUNTRIES.find((country) => country.iso2 === countryCode.toUpperCase());
  let valide = false;

  if (correspondingCountry && value) {
    valide = new RegExp(correspondingCountry.validation).test(value?.replace(/ /g, ""));
  } else if (value) {
    valide = /(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s.]?[(]?[0-9]{1,3}[)]?([-\s.]?[0-9]{3})([-\s.]?[0-9]{3,4})/.test(value?.replace(/ /g, ""));
  }
  let error = valide ? undefined : "Invalid phone number";
  return error;
}
