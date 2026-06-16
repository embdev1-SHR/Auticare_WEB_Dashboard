import { Button, Col, Container, Label, Row } from "reactstrap";
import * as yup from "yup";

import { ErrorMessage, Field, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AuticareLogo from "../../components/shared/auticare-logo";
import PoweredBy from "../../components/shared/powered-by-logo";
import SimpleBarComponent from "../../components/shared/simplebar";
import { forgotPassword } from "../../store/slice/auth.slice";

const ForgetPasswordPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleValidSubmit = async (values) => {
    const originalPromiseResult = await dispatch(forgotPassword(values)).unwrap();

    if (originalPromiseResult?.success) {
      router.push(
        {
          pathname: "confirm-otp",
          query: { EmailId: values.EmailId },
        },
        "confirm-otp"
      );
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
    EmailId: yup
      .string()
      .email("Invalid email address")
      .matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Invalid email address"
      )
      .required("Email is required"),
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

                          <h4 className='font-size-18 mt-4'>Forgot Password?</h4>
                          <p className='text-muted'>
                            Enter your registered email address.<br />
                            We'll send you a one-time OTP to reset your password.
                          </p>
                        </div>

                        <Formik initialValues={{ EmailId: "" }} validationSchema={validationSchema} onSubmit={handleValidSubmit}>
                          {({ handleSubmit, isSubmitting, touched, errors }) => (
                            <div className='p-2'>
                              <div className='form-horizontal'>
                                <div className='auth-form-group-custom mb-4'>
                                  <i className='ri-mail-line auti-custom-input-icon'></i>
                                  <Label htmlFor='useremail'>Email Address</Label>
                                  <Field
                                    name='EmailId'
                                    type='email'
                                    className='form-control'
                                    id='useremail'
                                    placeholder='Enter your email'
                                  />
                                  {errors.EmailId && touched.EmailId ? (
                                    <ErrorMessage className='text-danger small p-1' name='EmailId' component='div' />
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
                                    {isSubmitting ? "Sending OTP..." : "Send OTP"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Formik>

                        <div className='mt-3 text-center'>
                          <p>
                            Remember your password?{" "}
                            <Link href='/login' className='fw-medium text-primary'>
                              Log in
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

export default ForgetPasswordPage;
