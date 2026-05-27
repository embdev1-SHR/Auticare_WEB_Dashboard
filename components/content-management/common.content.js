import * as yup from "yup";

export const contentSchema = yup.object().shape({
  ContentActivityName: yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Content Activity name is required"),
  ContentActivityDescription: yup.string().max(500, "Too Long!").required("Content Activity Description is required"),
  ContentType: yup.string().max(25, "Too Long!").required("Content category is required"),
});

export const ContentTypeoptions = [
  { value: "VR", label: "VR" },
  { value: "Video", label: "Video" },
  { value: "Audio", label: "Audio" },
  { value: "Text", label: "Text" },
  { value: "Image", label: "Image" },
];

export const salutationOption = [
  { value: "Mr", label: "Mr" },
  { value: "Mrs", label: "Mrs" },
  { value: "Ms", label: "Ms" },
];

export const ContentCategoryOptions = [
  {
    label: "Picnic",
    options: [
      { label: "select", value: "" },
      { label: "Mustard", value: "Mustard" },
      { label: "Ketchup", value: "Ketchup" },
      { label: "Relish", value: "Relish" },
    ],
  },
  {
    label: "Camping",
    options: [
      { label: "Tent", value: "Tent" },
      { label: "Flashlight", value: "Flashlight" },
      { label: "Toilet Paper", value: "Toilet Paper" },
    ],
  },
];

export const TherapyOptions = [
  {
    label: "Picnic",
    options: [
      { label: "Mustard", value: "Mustard" },
      { label: "Ketchup", value: "Ketchup" },
      { label: "Relish", value: "Relish" },
    ],
  },
  {
    label: "Camping",
    options: [
      { label: "Tent", value: "Tent" },
      { label: "Flashlight", value: "Flashlight" },
      { label: "Toilet Paper", value: "Toilet Paper" },
    ],
  },
];
