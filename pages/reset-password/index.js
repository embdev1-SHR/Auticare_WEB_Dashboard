import { Button, Col, Container, Label, Row } from "reactstrap";
import * as yup from "yup";
// import images

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

  // handleValidSubmit
  const handleValidSubmit = async (values) => {
    const originalPromiseResult = await dispatch(resetPassword({ Password: values.Password })).unwrap();
    originalPromiseResult?.success && router.push("login");
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

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const validationSchema = yup.object().shape({
    NewPassword: yup.string().min(6, "Password must be atleast 6 characters").required("Password is required"),
    Password: yup.string().oneOf([yup.ref("NewPassword"), null], "Passwords must match"),
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

                          <h4 className='font-size-18 mt-4'>Reset Password</h4>
                          <p className='text-muted'>Reset your password to Auticare.</p>
                        </div>
                        <Formik initialValues={{ NewPassword: "", Password: "" }} validationSchema={validationSchema} onSubmit={handleValidSubmit}>
                          {({ handleSubmit, isSubmitting, touched, errors }) => (
                            <div className='p-2 '>
                              <div className='form-horizontal'>
                                <div className='auth-form-group-custom mb-4'>
                                  <i className=' ri-lock-2-line auti-custom-input-icon'></i>
                                  <i className={showPassword ? "ri-eye-off-line reverse-custom-input-icon" : "ri-eye-line reverse-custom-input-icon"} onClick={handleClickShowPassword}></i>
                                  <Label htmlFor='userpsw'>New Password</Label>
                                  <Field name='NewPassword' type={showPassword ? "text" : "password"} className='form-control' id='userpsw' placeholder='Enter new password' />
                                  {errors.NewPassword && touched.NewPassword ? <ErrorMessage className='text-danger small p-1' name='NewPassword' component='div' /> : null}
                                </div>

                                <div className='auth-form-group-custom mb-4'>
                                  <i className='ri-mail-line auti-custom-input-icon'></i>
                                  <Label htmlFor='psw'>Confirm Password</Label>
                                  <Field name='Password' type='password' className='form-control' id='psw' placeholder='confirm password' />
                                  {errors.Password && touched.Password ? <ErrorMessage className='text-danger small p-1' name='Password' component='div' /> : null}
                                </div>

                                <div className='mt-4 text-center'>
                                  <Button color='primary' className='w-md waves-effect waves-light' type='submit' onClick={handleSubmit} disabled={isSubmitting}>
                                    {isSubmitting ? "Loading..." : "Submit"}
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

export default ResetPasswordPage;
