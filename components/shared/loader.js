
import { Col, Container, Row, Spinner } from "reactstrap";

const Loader = () => {
  return (
    <>
      <div className="page-content">
        <div className="my-5 pt-5">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center  my-5">
                  
                  <Spinner
                    className="me-2"
                    color="primary"
                    style={{
                      display: "block",
                      position: "fixed",
                      height: "3rem",
                      width: "3rem",
                      top: "calc( 50% - ( 3rem / 2) )",
                      right: "calc( 50% - ( 3rem / 2) )",
                    }}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Loader;
