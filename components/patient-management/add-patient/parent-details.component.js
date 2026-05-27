import { ErrorMessage, Field, useFormikContext } from "formik";
import { useState } from "react";
import Select from "react-select";
import { Col, Label, Row } from "reactstrap";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { validatePhone } from "../../shared/util.common-function";
import { salutationOption } from "../../content-management/common.content";

function ParentDetails({ activeTab }) {
  const { errors, touched, setFieldValue, handleBlur } = useFormikContext();

  const RelationshipList = [
    { value: "Father", label: "Father" },
    { value: "Mother", label: "Mother" },
    { value: "Siblings", label: "Siblings" },
    { value: "Uncle", label: "Uncle" },
    { value: "Aunt", label: "Aunt" },
    { value: "Grandparent", label: "Grandparent" },
    { value: "Others", label: "Others" },
  ];
  const selectStyles = {
    control: (styles, { isDisabled }) => ({
      ...styles,
      borderColor: " #e8eaed;",
      color: isDisabled && "#292c39",
      backgroundColor: isDisabled ? "#f9fbff" : "white",
    }),
    singleValue: (styles) => ({ ...styles, color: "#292c39" }),
  };

  // phone validation

  const [countryCode, setCountryCode] = useState("91");
  return (
    <>
      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="salutation">
              Salutation
            </Label>
            <Field
              component={Select}
              options={salutationOption}
              name="Salutation"
              id="salutation"
              placeholder="Enter salutation"
              onChange={(client) => {
                setFieldValue("Salutation", client.value);
              }}
              styles={{
                control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
              }}
            />
            {errors.Salutation && touched.Salutation ? (
              <ErrorMessage
                className="text-danger small"
                name="Salutation"
                component="div"
              />
            ) : null}
          </div>
        </Col>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="name-input1">
              Parent Name
            </Label>
            <Field
              type="text"
              name="ParentName"
              id="name-input1"
              className="form-control"
              placeholder="Enter parent name "
            />
            {errors.ParentName && touched.ParentName ? (
              <ErrorMessage
                className="text-danger small"
                name="ParentName"
                component="div"
              />
            ) : null}
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="email">
              Email
            </Label>
            <Field
              type="text"
              name="ParentEmailID"
              id="email"
              className="form-control"
              placeholder="Enter Email"
            />
            {errors.ParentEmailID && touched.ParentEmailID ? (
              <ErrorMessage
                className="text-danger small"
                name="ParentEmailID"
                component="div"
              />
            ) : null}
          </div>
        </Col>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="ParentPhone">
              Phone number
            </Label>
            <Field

              component={PhoneInput}
              country={"in"}
              onChange={(value, country) => setFieldValue("ParentPhone", country.dialCode + " " + value.slice(country.dialCode.length))}
              name="ParentPhone"
              placeholder="Enter Phone Number"
              inputClass="mr-auto border-0"
              buttonClass="mr-auto border-0 bg-transparent"
              containerClass="form-control d-flex align-items-center"
              onBlur={handleBlur}
              validate={(value) =>
                activeTab === 2 && validatePhone(value, countryCode)
              }
              inputProps={{
                required: true,
                id: "ParentPhone",
              }}
              alwaysDefaultMask={false}
            />

            {errors.ParentPhone && touched.ParentPhone ? (
              <ErrorMessage
                className="text-danger small"
                name="ParentPhone"
                component="div"
              />
            ) : null}
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="relationship">
              Relationship
            </Label>
            <Field
              component={Select}
              id="relationship"
              name="Relationship"
              options={RelationshipList}
              placeholder="Select"
              onChange={(relation) => {
                setFieldValue("Relationship", relation.value);
              }}
              styles={selectStyles}
            />

            {errors.Relationship && touched.Relationship ? (
              <ErrorMessage
                className="text-danger small"
                name="Relationship"
                component="div"
              />
            ) : null}
          </div>
        </Col>
      </Row>
    </>
  );
}

export default ParentDetails;
