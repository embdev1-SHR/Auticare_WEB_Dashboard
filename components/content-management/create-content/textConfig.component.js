import dynamic from "next/dynamic";
import React from "react";
import "react-quill/dist/quill.snow.css";
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
  theme = "snow",
  label = "Text Content",
  readOnly = false,
  edit
}) => {
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "align",
  ];
  const modules = {
    toolbar: [
      // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ 'font': [] }],
      [{ 'align': [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <div className="mb-4">
      <Label className="form-label required" htmlFor={name}>
        {label}
      </Label>
      <QuillNoSSRWrapper
        name={name}
        value={value}
        onChange={setValue}
        theme={theme}
        placeholder={placeholder}
        formats={formats}
        modules={modules}
        readOnly={edit ? edit :readOnly}
      />
    </div>
  );
};

export default TextConfig;
