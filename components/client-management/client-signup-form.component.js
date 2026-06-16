import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useState } from "react";
import { Col, FormGroup, Label, Row, Spinner } from "reactstrap";
import * as yup from "yup";

const signupSchema = yup.object().shape({
  OrgName: yup.string().min(2, "Too Short!").max(200, "Too Long!").required("Organization name is required"),
  EmailId: yup.string().email("Invalid email").required("Email is required"),
  Phone: yup.string().min(6, "Too Short!").required("Phone is required"),
  Password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  ConfirmPassword: yup.string().oneOf([yup.ref("Password"), null], "Passwords must match").required("Please confirm your password"),
});

function ClientSignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (values) => {
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/client-signup`,
        {
          OrgName: values.OrgName,
          EmailId: values.EmailId,
          Phone: values.Phone,
          Password: values.Password,
        }
      );
      if (res.data?.success) {
        setSuccessMsg(res.data.results?.message || "Registration submitted successfully.");
      } else {
        setErrorMsg(res.data?.errors?.message || "Registration failed.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.errors?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successMsg) {
    return (
      <div className="text-center p-4">
        <div className="text-success mb-3" style={{ fontSize: 40 }}>✓</div>
        <h5 className="text-success">Registration Submitted!</h5>
        <p className="text-muted">{successMsg}</p>
        <Link href="/login">
          <a className="btn btn-primary mt-2">Back to Login</a>
        </Link>
      </div>
    );
  }

  return (
    <Formik
      initialValues={{
        OrgName: "",
        EmailId: "",
        Phone: "",
        Password: "",
        ConfirmPassword: "",
      }}
      validationSchema={signupSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <FormGroup className="mb-3">
            <Label htmlFor="OrgName">Organization Name <span className="text-danger">*</span></Label>
            <Field type="text" name="OrgName" id="OrgName" className="form-control" placeholder="Enter organization name" />
            {errors.OrgName && touched.OrgName ? <ErrorMessage className="text-danger small" name="OrgName" component="div" /> : null}
          </FormGroup>

          <Row>
            <Col md="6">
              <FormGroup className="mb-3">
                <Label htmlFor="EmailId">Email <span className="text-danger">*</span></Label>
                <Field type="email" name="EmailId" id="EmailId" className="form-control" placeholder="Enter email" />
                {errors.EmailId && touched.EmailId ? <ErrorMessage className="text-danger small" name="EmailId" component="div" /> : null}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup className="mb-3">
                <Label htmlFor="Phone">Phone <span className="text-danger">*</span></Label>
                <Field type="text" name="Phone" id="Phone" className="form-control" placeholder="Enter phone number" />
                {errors.Phone && touched.Phone ? <ErrorMessage className="text-danger small" name="Phone" component="div" /> : null}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="6">
              <FormGroup className="mb-3">
                <Label htmlFor="signup-password">Password <span className="text-danger">*</span></Label>
                <Field type="password" name="Password" id="signup-password" className="form-control" placeholder="Min 6 characters" />
                {errors.Password && touched.Password ? <ErrorMessage className="text-danger small" name="Password" component="div" /> : null}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup className="mb-3">
                <Label htmlFor="ConfirmPassword">Confirm Password <span className="text-danger">*</span></Label>
                <Field type="password" name="ConfirmPassword" id="ConfirmPassword" className="form-control" placeholder="Re-enter password" />
                {errors.ConfirmPassword && touched.ConfirmPassword ? <ErrorMessage className="text-danger small" name="ConfirmPassword" component="div" /> : null}
              </FormGroup>
            </Col>
          </Row>

          {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}

          <button type="submit" className="btn btn-primary w-100 mt-2" disabled={isLoading}>
            {isLoading ? (
              <Spinner size="sm" color="light" className="me-2" />
            ) : null}
            Register Organization
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default ClientSignupForm;
