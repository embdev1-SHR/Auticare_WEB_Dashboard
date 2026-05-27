import dynamic from "next/dynamic";
import React from "react";
import "react-quill/dist/quill.bubble.css";
import { Label } from "reactstrap";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const TextConfig = ({
  name = "",
  value = "",
  setValue,
  placeholder = "Enter content ...",
  theme = "bubble",
  label = "Text Content",
  readOnly
}) => {

  return (
    <div className="mb-4">
      <Label className="form-label " htmlFor={name}>
        {label}
      </Label>
      <QuillNoSSRWrapper
        name={name}
        value={value}
        onChange={setValue}
        theme={theme}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  );
};

export default TextConfig;
