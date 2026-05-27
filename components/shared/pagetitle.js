
import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import { selectChangeTitleState } from "../../store/slice/layout.slice";
import BreadcrumbComponent from "./breadcrumb";

function PageTitle() {
  const page_title = useSelector(selectChangeTitleState);

  return (
    <Row>
      <Col xs={12}>
        <div className="page-title-box d-flex align-items-center justify-content-between">
          <h4 className="mb-0">{page_title}</h4>

          <div className="page-title-right">
            <BreadcrumbComponent />
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default PageTitle;
