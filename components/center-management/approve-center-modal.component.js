import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Row, Col, Label,
} from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { approveCenter, selectIsPendingLoading } from "../../store/slice/center.slice";
import { selectClientList } from "../../store/slice/client.slice";
import { salutationOption } from "../content-management/common.content";

const validationSchema = yup.object({
  CenterName: yup.string().required("Center name is required"),
  ClientID: yup.number().required("Client is required").typeError("Please select a client"),
  CenterType: yup.string().required("Center type is required"),
  CenterHeadName: yup.string().required("Center head name is required"),
  CenterHeadDesignation: yup.string().required("Designation is required"),
  CenterHeadEmailId: yup.string().email("Invalid email").required("Email is required"),
  CenterHeadPhone: yup.string().required("Phone is required"),
});

function ApproveCenterModal({ pendingCenter, onClose }) {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsPendingLoading);
  const clientList = useSelector(selectClientList);
  const [countryCode] = useState("in");

  const clientOptions = (clientList || []).map((c) => ({
    value: c.ClientID,
    label: c.ClientName,
  }));

  const initialValues = {
    CenterName: pendingCenter.CenterName || "",
    ClientID: "",
    CenterType: "Association",
    CenterHeadSalutation: "",
    CenterHeadName: "",
    CenterHeadDesignation: "",
    CenterHeadEmailId: "",
    CenterHeadPhone: "",
  };

  const handleSubmit = async (values) => {
    await dispatch(approveCenter({ ...values, UserID: pendingCenter.UserID }));
    onClose();
  };

  return (
    <Modal isOpen toggle={onClose} size="lg" scrollable>
      <ModalHeader toggle={onClose}>
        Approve Center Registration
      </ModalHeader>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, handleBlur, values }) => (
          <Form>
            <ModalBody>
              <div className="mb-3 p-3" style={{ background: "#f8f9fa", borderRadius: 8, fontSize: 13 }}>
                <strong>Signup Info</strong> — Email: {pendingCenter.EmailId}
                {pendingCenter.Phone ? ` · Phone: ${pendingCenter.Phone}` : ""}
                {pendingCenter.Create_TS
                  ? ` · Submitted: ${new Date(pendingCenter.Create_TS).toLocaleDateString()}`
                  : ""}
              </div>

              <h6 className="mb-3">Center Details</h6>
              <Row>
                <Col lg="6">
                  <div className="mb-4">
                    <Label className="form-label required">Center Name</Label>
                    <Field name="CenterName" className="form-control" placeholder="Center name" />
                    {errors.CenterName && touched.CenterName && (
                      <ErrorMessage className="text-danger small" name="CenterName" component="div" />
                    )}
                  </div>
                </Col>
                <Col lg="6">
                  <div className="mb-4">
                    <Label className="form-label required">Client</Label>
                    <Select
                      options={clientOptions}
                      placeholder="Select client"
                      onChange={(opt) => setFieldValue("ClientID", opt ? opt.value : "")}
                      styles={{
                        control: (s) => ({ ...s, borderColor: "#e8eaed", borderRadius: "0.375rem" }),
                      }}
                    />
                    {errors.ClientID && touched.ClientID && (
                      <div className="text-danger small">{errors.ClientID}</div>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg="6">
                  <div className="mb-4">
                    <Label className="form-label required">Center Type</Label>
                    <div className="d-flex gap-4 mt-1">
                      <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
                        <Field type="radio" name="CenterType" value="Association" />
                        <span>Association</span>
                      </label>
                      <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
                        <Field type="radio" name="CenterType" value="Partner" />
                        <span>Partner</span>
                      </label>
                    </div>
                    {errors.CenterType && touched.CenterType && (
                      <div className="text-danger small">{errors.CenterType}</div>
                    )}
                  </div>
                </Col>
              </Row>

              <h6 className="mb-3 mt-2">Center Head Details</h6>
              <Row>
                <Col lg="6">
                  <div className="mb-4">
                    <Label className="form-label">Salutation</Label>
                    <Select
                      options={salutationOption}
                      placeholder="Select salutation"
                      onChange={(opt) => setFieldValue("CenterHeadSalutation", opt ? opt.value : "")}
                      styles={{
                        control: (s) => ({ ...s, borderColor: "#e8eaed", borderRadius: "0.375rem" }),
                      }}
                    />
                  </div>
                </Col>
                <Col lg="6">
                  <div className="mb-4">
                    <Label className="form-label required">Name</Label>
                    <Field name="CenterHeadName" className="form-control" placeholder="Center head name" />
                    {errors.CenterHeadName && touched.CenterHeadName && (
                      <ErrorMessage className="text-danger small" name="CenterHeadName" component="div" />
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg="6">
                  <div className="mb-4">
                    <Label className="form-label required">Designation</Label>
                    <Field name="CenterHeadDesignation" className="form-control" placeholder="Designation" />
                    {errors.CenterHeadDesignation && touched.CenterHeadDesignation && (
                      <ErrorMessage className="text-danger small" name="CenterHeadDesignation" component="div" />
                    )}
                  </div>
                </Col>
                <Col lg="6">
                  <div className="mb-4">
                    <Label className="form-label required">Email</Label>
                    <Field name="CenterHeadEmailId" type="email" className="form-control" placeholder="Email address" />
                    {errors.CenterHeadEmailId && touched.CenterHeadEmailId && (
                      <ErrorMessage className="text-danger small" name="CenterHeadEmailId" component="div" />
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg="6">
                  <div className="mb-4">
                    <Label className="form-label required">Phone</Label>
                    <PhoneInput
                      country={countryCode}
                      value={values.CenterHeadPhone}
                      onChange={(value) => setFieldValue("CenterHeadPhone", value)}
                      onBlur={handleBlur}
                      inputClass="mr-auto border-0"
                      buttonClass="mr-auto border-0 bg-transparent"
                      containerClass="form-control d-flex align-items-center"
                      inputProps={{ id: "CenterHeadPhone" }}
                    />
                    {errors.CenterHeadPhone && touched.CenterHeadPhone && (
                      <div className="text-danger small">{errors.CenterHeadPhone}</div>
                    )}
                  </div>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button color="success" type="submit" disabled={isLoading}>
                {isLoading ? "Approving..." : "Approve & Activate"}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default ApproveCenterModal;
