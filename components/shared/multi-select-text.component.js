import { useFormikContext } from "formik";
import { useState } from "react";
import { useEffect } from "react";

import CreatableSelect from "react-select/creatable";

const components = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: label,
});

const MultiSelectTextInput = ({ value, setValue, placeholder, nameAttribute }) => {
  const [inputValue, setInputValue] = useState("");
  // const [value, setValue] = useState([]);

  useEffect(() => {
    if (typeof value === "object")
      setFieldValue(
        nameAttribute,
        value.map((ele) => ele.value)
      );
  }, [nameAttribute, setFieldValue, value]);

  const handleKeyDown = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setValue((prev) => [...prev, createOption(inputValue)]);
        setInputValue("");
        setFieldValue("SubSkill", value);
        event.preventDefault();
    }
  };
  const { setFieldValue, values } = useFormikContext();
  return (
    <CreatableSelect
      components={components}
      inputValue={inputValue}
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={(newValue) => {
        setValue(newValue);
        setFieldValue("SubSkill", newValue);
      }}
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      value={value}
      name={nameAttribute}
    />
  );
};
export default MultiSelectTextInput;
