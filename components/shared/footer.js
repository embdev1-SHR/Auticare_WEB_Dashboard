
import { Row, Col, Container } from "reactstrap";
import Copyright from "../shared/copyright";

function Footer() {
  return (
    //  <!-- Footer -->
    <footer className="footer">
      <Container fluid>
        <Row>
          <Col sm={12}>
            <Copyright />
          </Col>
        </Row>
      </Container>
    </footer>
    //  <!-- End Footer -->
  );
}
export default Footer;
