import { ErrorMessage, Field, useFormikContext } from "formik";
import { Col, Label, Row } from "reactstrap";

function ContactPersonDetails() {
  // Grab values and submitForm from context
  const { errors, touched } = useFormikContext();

  return (
    <>
      <Row>
        {/* <Col md='6'> */}
        <div className='mb-4'>
          <Label className='form-label required'>Full Name</Label>
          <Field type='text' name='ContactPersonName' className='form-control' placeholder='Enter full name' />
          {errors.ContactPersonName && touched.ContactPersonName ? <ErrorMessage className='text-danger small' name='ContactPersonName' component='div' /> : null}
        </div>
      </Row>
      <Row>
        <Col md='6'>
          <div className='mb-4'>
            <Label className='form-label required'>Designation</Label>
            <Field type='text' name='ContactPersonDesignation' className='form-control' placeholder='Enter designation' />
            {errors.ContactPersonDesignation && touched.ContactPersonDesignation ? <ErrorMessage className='text-danger small' name='ContactPersonDesignation' component='div' /> : null}
          </div>
        </Col>
        <Col md='6'>
          <div className='mb-4'>
            <Label className='form-label required'>Email ID</Label>
            <Field type='text' name='ContactEmailId' className='form-control' placeholder='Enter email id' />
            {errors.ContactEmailId && touched.ContactEmailId ? <ErrorMessage className='text-danger small' name='ContactEmailId' component='div' /> : null}
          </div>
        </Col>
      </Row>
    </>
  );
}
export default ContactPersonDetails;
