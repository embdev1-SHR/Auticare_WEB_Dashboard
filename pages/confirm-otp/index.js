import { Button, Col, Container, Label, Row } from "reactstrap";
import * as yup from "yup";
// import images

import { ErrorMessage, Field, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AuticareLogo from "../../components/shared/auticare-logo";
import PoweredBy from "../../components/shared/powered-by-logo";
import SimpleBarComponent from "../../components/shared/simplebar";
import { confirmOTP } from "../../store/slice/auth.slice";

const ConfirmOTPPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // handleValidSubmit
  const handleValidSubmit = async (values) => {
    const valuesToSend = {
      EmailId: router.query.EmailId,
      ...values,
    };
    const originalPromiseResult = await dispatch(confirmOTP(valuesToSend)).unwrap();
    originalPromiseResult?.success && router.push("reset-password");
  };
  const getYear = () => {
    return new Date().getFullYear();
  };

  useEffect(() => {
    document.body.classList.add("auth-body-bg");
    // returned function will be called on component unmount
    return () => {
      document.body.classList.remove("auth-body-bg");
    };
  }, []);

  const validationSchema = yup.object().shape({
    PasswordResetOtp: yup
      .string()
      .required("OTP is required")
      .matches(/^[0-9]+$/, "Invalid OTP")
      .min(6, "Invalid OTP")
      .max(6, "Invalid OTP"),
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
                          {/* <p className='text-muted'>Reset your password to Auticare.</p> */}
                        </div>
                        <Formik initialValues={{ PasswordResetOtp: "" }} validationSchema={validationSchema} onSubmit={handleValidSubmit}>
                          {({ handleSubmit, isSubmitting, touched, errors }) => (
                            <div className='p-2 '>
                              <div className='form-horizontal'>
                                <div className='auth-form-group-custom mb-4'>
                                  <i className='ri-mail-line auti-custom-input-icon'></i>
                                  <Label htmlFor='useremail'>OTP</Label>
                                  <Field name='PasswordResetOtp' type='email' className='form-control' id='useremail' placeholder='Enter OTP' />
                                  {errors.PasswordResetOtp && touched.PasswordResetOtp ? <ErrorMessage className='text-danger small p-1' name='PasswordResetOtp' component='div' /> : null}
                                </div>

                                <div className='mt-4 text-center'>
                                  <Button color='primary' className='w-md waves-effect waves-light' type='submit' onClick={handleSubmit} disabled={isSubmitting}>
                                    {isSubmitting ? "Loading..." : "Confirm"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Formik>
                      </div>
                      <div className='auth_foot  pb-2'>
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
