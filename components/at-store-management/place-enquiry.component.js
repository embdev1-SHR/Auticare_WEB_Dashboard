import { ErrorMessage, Field, Formik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, CardTitle, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import * as Yup from "yup";
import { StoreMainIsLoading, storeCreationSlice } from "../../store/slice/store.slice";

const PlaceEnquiry = ({ProductId}) => {
  const [Open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const loading = useSelector(StoreMainIsLoading);


  const validationSchema=(Yup.object().shape({
    Message: Yup.string().min(2, "Too Short!").max(500, "Too Long!").required("Please enter Message"),
  }))

  const onSubmit = async (values,{resetForm}) => {
    
    const data={"ProductID": ProductId,
    "Enquiry": values.Message}
    
    const valueToSend = {
      data,
      setOpen,
      resetForm
    }
    dispatch(storeCreationSlice(valueToSend));
  };


  return (
    <>
      <Button
        type='button'
        color='primary'
        onClick={() => {
          setOpen(!Open);
        }}
        className='float-right waves-effect waves-light me-1'>
        Place Enquiry
      </Button>
      <Formik initialValues={{
        Message: "",

      }} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
        {({ touched, errors, handleSubmit, resetForm, isSubmitting, setFieldValue, values }) => (

          <Modal
            isOpen={Open}
            toggle={() => {
              setOpen(!Open);
            }}>
            <ModalHeader
              toggle={() => {
                setOpen(!Open);
              }}>
              Place Enquiry
            </ModalHeader>
            <ModalBody>
              <div className='mb-3'>
                <label className='form-label' htmlFor='productdesc'>
                  Product Name :
                </label>
                <CardTitle className='h5'>Full sleeve T-shirt</CardTitle>
              </div>
              <div className='mb-3'>
                <label className='form-label' htmlFor='productdesc'>
                  Message :
                </label>
                <Field
                  as='textarea'
                  name='Message'
                  placeholder='Enter Your Message'
                  className='form-control'
                />
                {errors.Message && touched.Message ? <ErrorMessage className='text-danger small' name='Message' component='div' /> : null}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type='submit' onClick={handleSubmit} disabled={loading} color='primary' className='btn-md m-1 waves-effect waves-light action_btn'>
                Submit
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default PlaceEnquiry;
