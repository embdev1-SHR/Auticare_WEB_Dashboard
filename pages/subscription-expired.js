import { Button, Col, Container, Row } from "reactstrap";
import AuticareLogo from "../components/shared/auticare-logo";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getUserData, logoutLoader, signOut } from "../store/slice/auth.slice";
import { ToastNotification } from "../components/shared/toast";

const SubscriptionExpired = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  const setLogout = async () => {
    dispatch(logoutLoader(true));
    const originalPromiseResult = await dispatch(signOut()).unwrap();
    if (originalPromiseResult.success) {
      ToastNotification("success", originalPromiseResult.results.message);
    }
    else {
      ToastNotification("Failed", "Log Out Failed");
    }
    dispatch(logoutLoader(false));
  };

  return (
    <>
      <div className='my-5 pt-sm-5'>
        <Container>
          <Row className='justify-content-center'>
            <Col xs={10}>
              <div className='text-center'>
                <div className='mb-5'>
                  <span className='logo-sm'>
                    <AuticareLogo />
                    <span className='logo-text font-size-24'>Auticare</span>
                  </span>
                </div>

                <Row className='justify-content-center'>
                  <Col sm={4}>
                    <div className='maintenance-img'>
                      <img src={"/images/expired.png"} alt='' className='img-fluid mx-auto d-block' />
                    </div>
                  </Col>
                </Row>
                <h3 className='mt-4'>Subscription Expired</h3>

                <Row>
                  <Col md={12} className='mt-2'>
                    <Button color='success' className='px-5' onClick={(e) => setLogout()}>
                      Logout
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default SubscriptionExpired;
