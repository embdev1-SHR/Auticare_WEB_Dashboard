import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import ClientSignupForm from "../components/client-management/client-signup-form.component";
import AuticareLogo from "../components/shared/auticare-logo";
import PoweredBy from "../components/shared/powered-by-logo";
import SimpleBarComponent from "../components/shared/simplebar";

function ClientSignup() {
  const getYear = () => new Date().getFullYear();

  useEffect(() => {
    document.body.classList.add("auth-body-bg");
    return () => document.body.classList.remove("auth-body-bg");
  }, []);

  return (
    <div>
      <Head>
        <meta property="og:title" content="Auticare - Client Registration" />
        <meta property="og:url" content="/client-signup" />
      </Head>
      <Container fluid className="p-0">
        <Row className="no-gutters">
          <Col lg={4}>
            <SimpleBarComponent className="authentication-page-content min-vh-100">
              <div className="w-100 h-100 justify-content-center">
                <div className="d-flex flex-column auth_flex h-100">
                  <div className="auth_top p-5 pb-0">
                    <div className="d-flex align-items-center mb-4">
                      <div className="logo-lg">
                        <AuticareLogo />
                        <span className="logo-text">Auticare</span>
                      </div>
                    </div>
                  </div>

                  <div className="auth_body p-5 d-flex pb-5 flex-column justify-content-center">
                    <h4 className="font-size-20">Organization Registration</h4>
                    <p className="text-muted">Register your organization. An admin will review and activate your account.</p>
                    <div className="mt-3 mb-4">
                      <ClientSignupForm />
                    </div>
                    <div className="text-center">
                      <p className="text-muted mb-0">
                        Already have an account?{" "}
                        <Link href="/login">
                          <a className="text-primary">Sign In</a>
                        </Link>
                      </p>
                    </div>
                  </div>

                  <div className="auth_foot pl-5 pr-5 pb-2">
                    <p>
                      © <span>{getYear()}</span> Auticare.{" "}
                      <span className="powered-by">
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
            <div className="authentication-bg">
              <div className="bg-overlay"></div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ClientSignup;
