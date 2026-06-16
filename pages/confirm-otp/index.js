import { Button, Col, Container, Label, Row } from "reactstrap";
import * as yup from "yup";

import { ErrorMessage, Field, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AuticareLogo from "../../components/shared/auticare-logo";
import PoweredBy from "../../components/shared/powered-by-logo";
import SimpleBarComponent from "../../components/shared/simplebar";
import { confirmOTP, forgotPassword } from "../../store/slice/auth.slice";
import { ToastNotification } from "../../components/shared/toast";

const ConfirmOTPPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const emailId = router.query.EmailId;
  const [resending, setResending] = useState(false);

  const handleValidSubmit = async (values) => {
    const valuesToSend = {
      EmailId: emailId,
      ...values,
    };
    const originalPromiseResult = await dispatch(confirmOTP(valuesToSend)).unwrap();
    originalPromiseResult?.success && router.push("reset-password");
  };

  const handleResend = async () => {
    if (!emailId) return;
    setResending(true);
    try {
      await dispatch(forgotPassword({ EmailId: emailId })).unwrap();
    } catch (e) {
      // toast already shown by the action
    } finally {
      setResending(false);
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

  const validationSchema = yup.object().shape({
    PasswordResetOtp: yup
      .string()
      .required("OTP is required")
      .matches(/^[0-9]+$/, "OTP must contain only digits")
      .min(6, "OTP must be 6 digits")
      .max(6, "OTP must be 6 digits"),
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

                          <h4 className='font-size-18 mt-4'>Verify OTP</h4>
                          {emailId && (
                            <p className='text-muted'>
                              We sent a 6-digit OTP to<br />
                              <strong>{emailId}</strong>
                            </p>
                          )}
                          <p className='text-muted small'>OTP expires in 20 minutes.</p>
                        </div>
                        <Formik initialValues={{ PasswordResetOtp: "" }} validationSchema={validationSchema} onSubmit={handleValidSubmit}>
                          {({ handleSubmit, isSubmitting, touched, errors }) => (
                            <div className='p-2'>
                              <div className='form-horizontal'>
                                <div className='auth-form-group-custom mb-4'>
                                  <i className='ri-shield-keyhole-line auti-custom-input-icon'></i>
                                  <Label htmlFor='otp'>Enter OTP</Label>
                                  <Field
                                    name='PasswordResetOtp'
                                    type='text'
                                    inputMode='numeric'
                                    pattern='[0-9]*'
                                    maxLength={6}
                                    className='form-control'
                                    id='otp'
                                    placeholder='Enter 6-digit OTP'
                                    style={{ letterSpacing: "0.25em", fontSize: "1.2rem" }}
                                  />
                                  {errors.PasswordResetOtp && touched.PasswordResetOtp ? (
                                    <ErrorMessage className='text-danger small p-1' name='PasswordResetOtp' component='div' />
                                  ) : null}
                                </div>

                                <div className='mt-4 text-center'>
                                  <Button color='primary' className='w-md waves-effect waves-light' type='submit' onClick={handleSubmit} disabled={isSubmitting}>
                                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                                  </Button>
                                </div>

                                <div className='mt-3 text-center'>
                                  <button
                                    type='button'
                                    className='btn btn-link text-muted small p-0'
                                    onClick={handleResend}
                                    disabled={resending}
                                  >
                                    {resending ? "Sending..." : "Didn't receive? Resend OTP"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Formik>

                        <div className='mt-3 text-center'>
                          <p>
                            <Link href='/forgot-password' className='fw-medium text-primary'>
                              &larr; Back
                            </Link>
                          </p>
                        </div>
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

export default ConfirmOTPPage;
