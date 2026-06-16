import { Button, Col, Container, Label, Row } from "reactstrap";
import * as yup from "yup";

import { ErrorMessage, Field, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AuticareLogo from "../../components/shared/auticare-logo";
import PoweredBy from "../../components/shared/powered-by-logo";
import SimpleBarComponent from "../../components/shared/simplebar";
import { resetPassword } from "../../store/slice/auth.slice";

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleValidSubmit = async (values) => {
    const originalPromiseResult = await dispatch(resetPassword({ Password: values.NewPassword })).unwrap();
    if (originalPromiseResult?.success) {
      router.push("/login");
    }
  };

  const getYear = () => {
    return new Date().getFullYear();
  };

  useEffect(() => {
    document.body.classList.add("auth-body-bg");
    return () => {
      document.body.classList.remove("auth-body-bg");
    };
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validationSchema = yup.object().shape({
    NewPassword: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    ConfirmPassword: yup
      .string()
      .oneOf([yup.ref("NewPassword"), null], "Passwords do not match")
      .required("Please confirm your password"),
  });

  return (
    <>
      <div>
        <Container fluid className='p-0'>
          <Row className='no-gutters'>
            <Col lg={4}>
              <SimpleBarComponent className='authentication-page-content min-vh-100'>
                <Row className='w-100 h-100 justify-content-center'>
                  <Col lg={9}>
                    <div className='d-flex flex-column auth_flex h-100'>
                      <div className='auth_body mt-5 py-5 d-flex flex-column'>
                        <div className='text-center mt-5'>
                          <div className='logo-md'>
                            <AuticareLogo />
                          </div>

                          <h4 className='font-size-18 mt-4'>Set New Password</h4>
                          <p className='text-muted'>Choose a strong password for your account.</p>
                        </div>

                        <Formik
                          initialValues={{ NewPassword: "", ConfirmPassword: "" }}
                          validationSchema={validationSchema}
                          onSubmit={handleValidSubmit}
                        >
                          {({ handleSubmit, isSubmitting, touched, errors }) => (
                            <div className='p-2'>
                              <div className='form-horizontal'>
                                <div className='auth-form-group-custom mb-4'>
                                  <i className='ri-lock-2-line auti-custom-input-icon'></i>
                                  <i
                                    className={showPassword ? "ri-eye-off-line reverse-custom-input-icon" : "ri-eye-line reverse-custom-input-icon"}
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ cursor: "pointer" }}
                                  ></i>
                                  <Label htmlFor='newPassword'>New Password</Label>
                                  <Field
                                    name='NewPassword'
                                    type={showPassword ? "text" : "password"}
                                    className='form-control'
                                    id='newPassword'
                                    placeholder='Enter new password (min 6 chars)'
                                  />
                                  {errors.NewPassword && touched.NewPassword ? (
                                    <ErrorMessage className='text-danger small p-1' name='NewPassword' component='div' />
                                  ) : null}
                                </div>

                                <div className='auth-form-group-custom mb-4'>
                                  <i className='ri-lock-2-line auti-custom-input-icon'></i>
                                  <i
                                    className={showConfirm ? "ri-eye-off-line reverse-custom-input-icon" : "ri-eye-line reverse-custom-input-icon"}
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    style={{ cursor: "pointer" }}
                                  ></i>
                                  <Label htmlFor='confirmPassword'>Confirm Password</Label>
                                  <Field
                                    name='ConfirmPassword'
                                    type={showConfirm ? "text" : "password"}
                                    className='form-control'
                                    id='confirmPassword'
                                    placeholder='Re-enter new password'
                                  />
                                  {errors.ConfirmPassword && touched.ConfirmPassword ? (
                                    <ErrorMessage className='text-danger small p-1' name='ConfirmPassword' component='div' />
                                  ) : null}
                                </div>

                                <div className='mt-4 text-center'>
                                  <Button
                                    color='primary'
                                    className='w-md waves-effect waves-light'
                                    type='submit'
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                  >
                                    {isSubmitting ? "Saving..." : "Reset Password"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Formik>
                      </div>
                      <div className='auth_foot pb-2'>
                        <p>
                          © <span id='year'>{getYear()}</span> Auticare.{" "}
                          <span className='powered-by'>
                            <span> Powered by</span>
                            <PoweredBy />
                          </span>
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </SimpleBarComponent>
            </Col>
            <Col lg={8}>
              <div className='authentication-bg'>
                <div className='bg-overlay'></div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ResetPasswordPage;
