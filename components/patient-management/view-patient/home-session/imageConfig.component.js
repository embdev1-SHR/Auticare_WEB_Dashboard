import Image from "next/image";
import React from "react";
import { Col, Container, Row } from "reactstrap";

const ImageConfig = ({ url }) => {
  console.log("uploadedFile",url);
  return (
    <>
      <Container fluid>
        <Row>
          <Col md={10} className='m-2 d-flex justify-content-center'>
            <img src={url} width={300} height={300} alt='ResourcePic' />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ImageConfig;
