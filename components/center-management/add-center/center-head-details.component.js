import { useState } from "react";
import { Row, Col, Label } from "reactstrap";
import { PHONE_COUNTRIES } from "../../../constants/regExp/phone.regex";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";

import { Field, ErrorMessage, useFormikContext } from "formik";
import { validatePhone } from "../../shared/util.common-function";
import { salutationOption } from "../../content-management/common.content";

function CenterHeadDetails({ activeTab }) {
  const { errors, touched, setFieldValue, handleBlur } = useFormikContext();

  const [countryCode, setCountryCode] = useState("in");

  return (
    <>
      <h6 className="mb-3">Center Head Details</h6>
      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="salutation">
              Salutation
            </Label>
            <Field
              component={Select}
              options={salutationOption}
              name="CenterHeadSalutation"
              id="salutation"
              placeholder="Enter salutation"
              onChange={(client) => {
                setFieldValue("CenterHeadSalutation", client.value);
              }}
              styles={{
                control: (styles) => ({ ...styles, borderColor: " #e8eaed;", borderRadius: "0.375rem" }),
              }}
            />
            {/* <Field
              type="text"
              name="CenterHeadSalutation"
              id="salutation"
              className="form-control"
              placeholder="Enter salutation"
            /> */}
            {errors.CenterHeadSalutation && touched.CenterHeadSalutation ? (
              <ErrorMessage
                className="text-danger small"
                name="CenterHeadSalutation"
                component="div"
              />
            ) : null}
          </div>
        </Col>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="name-input1">
              Name
            </Label>
            <Field
              type="text"
              name="CenterHeadName"
              id="name-input1"
              className="form-control"
              placeholder="Enter Name "
            />
            {errors.CenterHeadName && touched.CenterHeadName ? (
              <ErrorMessage
                className="text-danger small"
                name="CenterHeadName"
                component="div"
              />
            ) : null}
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="designation-input1">
              Designation
            </Label>
            <Field
              type="text"
              name="CenterHeadDesignation"
              id="designation-input1"
              className="form-control"
              placeholder="Enter designation "
            />
            {errors.CenterHeadDesignation && touched.CenterHeadDesignation ? (
              <ErrorMessage
                className="text-danger small"
                name="CenterHeadDesignation"
                component="div"
              />
            ) : null}
          </div>
        </Col>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="email-input2">
              Email
            </Label>
            <Field
              type="text"
              name="CenterHeadEmailId"
              id="email-input2"
              className="form-control"
              placeholder="Enter Email"
            />
            {errors.CenterHeadEmailId && touched.CenterHeadEmailId ? (
              <ErrorMessage
                className="text-danger small"
                name="CenterHeadEmailId"
                component="div"
              />
            ) : null}
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="CenterHeadPhone">
              Phone number
            </Label>
            <Field
              component={PhoneInput}
              country={countryCode}
              onChange={(value) => {
                setFieldValue("CenterHeadPhone", value);
              }}
              name="CenterHeadPhone"
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
                id: "CenterHeadPhone",
              }}
              alwaysDefaultMask={false}
            />

            {errors.CenterHeadPhone && touched.CenterHeadPhone ? (
              <ErrorMessage
                className="text-danger small"
                name="CenterHeadPhone"
                component="div"
              />
            ) : null}
          </div>
        </Col>
      </Row>
    </>
  );
}

export default CenterHeadDetails;
