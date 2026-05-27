import { PHONE_COUNTRIES } from "../../constants/regExp/phone.regex";

//phone number

export const validatePhone = (value, countryCode) => {


  const correspondingCountry = PHONE_COUNTRIES.find(
    (country) => country.iso2 === countryCode.toUpperCase()
  );
  let valide = false;

  if (correspondingCountry && value) {
    valide = new RegExp(correspondingCountry.validation).test(
      //value?.replace(/ /g, "")

    );
  }  if (value) {

    valide =
      /(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s.]?[(]?[0-9]{1,3}[)]?([-\s.]?[0-9]{3})([-\s.]?[0-9]{3,4})/.test(
        value?.replace(/ /g, "")
      );
      console.log("phone validation",valide)

  }
  let error = !valide && "Invalid phone number";

  return error;
};

export const handleCountryStateSearch = (option, searchText) => {
  if (option.label.toLowerCase().startsWith(searchText.toLowerCase())) {
    return true;
  } else {
    return false;
  }
};


