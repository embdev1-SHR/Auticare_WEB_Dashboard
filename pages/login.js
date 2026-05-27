import Head from "next/head";
import { useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import LoginForm from "../components/login/login-form.component";
import AuticareLogo from "../components/shared/auticare-logo";
import PoweredBy from "../components/shared/powered-by-logo";
import SimpleBarComponent from "../components/shared/simplebar";

function Login() {
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

  return (
    <div>
      <Head>
        <meta property='og:title' content='Auticare' />
        <meta property='og:description' content='Auticare is an XR-AI based Assistive Technology learning platform for Autism Spectrum Disorder(ASD) and special education.' />
        {/* <meta property="og:image" content="/images/auticare_logo.png" /> */}
        <meta property='og:url' content='/login'></meta>
      </Head>
      <Container fluid className='p-0'>
        <Row className='no-gutters'>
          <Col lg={4}>
            <SimpleBarComponent className='authentication-page-content min-vh-100'>
              <div className='w-100 h-100 justify-content-center'>
                <div className='d-flex flex-column auth_flex h-100'>
                  <div className='auth_top p-5 pb-0'>
                    <div className='d-flex align-items-center mb-5'>
                      <div className='logo-lg'>
                        <AuticareLogo />
                        <span className='logo-text'>Auticare</span>
                      </div>
                    </div>
                  </div>

                  <div className='auth_body p-5 d-flex pb-5 flex-column justify-content-center'>
                    <h4 className='font-size-20'>Welcome Back !</h4>
                    <p className='text-muted'>Sign in to continue to Auticare.</p>
                    <div className='mt-5 mb-5'>
                      <LoginForm />
                    </div>
                  </div>

                  <div className='auth_foot pl-5 pr-5 pb-2'>
                    <p>
                      © <span id='year'>{getYear()}</span> Auticare.{" "}
                      <span className='powered-by'>
                        <span> Powered by</span>
                        <PoweredBy />
                      </span>
                    </p>
                  </div>
                </div>
              </div>
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
  );
}

export default Login;
