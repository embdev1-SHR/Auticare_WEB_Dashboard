import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { FormGroup, Label, Spinner } from "reactstrap";
import * as yup from "yup";
import { signIn } from "../../store/slice/auth.slice";
import ButtonComponent from "../shared/button";
import { ToastNotification } from "../shared/toast";
import ForgotPassword from "./forgot-password.component";

function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const loginSchema = yup.object().shape({
    username: yup
      .string()
      .email("Invalid email address")
      .matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Invalid email address"
      )
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });


  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={loginSchema}
      onSubmit={async (values) => {
        setIsLoading(true);
        const res = await dispatch(signIn(values));

        if (res?.success) {
          await router.push("/dashboard");
          ToastNotification("success", "Login Success!", null);
          setIsLoading(false);
        } else {
          ToastNotification("error", "Login Failed!", res?.message);
          setIsLoading(false);
        }
      }}
    >
      {({ touched, errors }) => (
        <Form className="form-horizontal">
          <FormGroup className="auth-form-group-custom mb-4">
            <i className="ri-user-2-line auti-custom-input-icon"></i>
            <Label htmlFor="username">Username</Label>

            <Field type="email" name="username" className="form-control" id="username" placeholder="Enter username" />
            {errors.username && touched.username ? <ErrorMessage className="text-danger small" name="username" component="div" /> : null}
          </FormGroup>

          <FormGroup className="auth-form-group-custom mb-4">
            <i className="ri-lock-2-line auti-custom-input-icon"></i>
            <Label htmlFor="userpassword">Password</Label>
            <Field name="password" type="password" className="form-control" id="userpassword" placeholder="Enter password" />
            {errors.password && touched.password ? <ErrorMessage className="text-danger small" name="password" component="div" /> : null}
          </FormGroup>

          <div className="mt-4 text-right">
            <ForgotPassword />
          </div>

          <div className="mt-4 text-center">
            <p className="text-muted mb-3">
              New organization?{" "}
              <Link href="/client-signup">
                <a className="text-primary fw-medium">Register here</a>
              </Link>
            </p>
            <ButtonComponent className="btn btn-primary w-md waves-effect waves-light w-100" disabled={isLoading}>
              {isLoading ? (
                <Spinner
                  className="me-2"
                  color="light"
                  style={{
                    height: "1rem",
                    width: "1rem",
                  }}
                />
              ) : (
                "Log In"
              )}
            </ButtonComponent>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default LoginForm;
