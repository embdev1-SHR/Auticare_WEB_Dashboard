import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Col, Row } from "reactstrap";

const DashboardSkeleton = () => {
  return (
    <>
      <Row>
        <Col md={3}>
          <Skeleton height={130} className='m-1' />
        </Col>
        <Col md={3}>
          <Skeleton height={130} className='m-1' />
        </Col>
        <Col md={3}>
          <Skeleton height={130} className='m-1' />
        </Col>
        <Col md={3}>
          <Skeleton height={130} className='m-1' />
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <Skeleton height={400} className='m-1 my-3' />
        </Col>
        <Col md={4}>
          <Skeleton height={400} className='m-1 my-3' />
        </Col>
      </Row>
    </>
  );
};

export default DashboardSkeleton;
