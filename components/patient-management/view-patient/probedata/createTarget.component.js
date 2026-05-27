import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import * as Yup from "yup";
import { ErrorMessage, Field, Formik } from "formik";
import { patientIsLoading, probeDataCreation } from "../../../../store/slice/patient.slice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

const CreateTarget = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const tog_modal = () => {
    setModalOpen(!modalOpen);
  };
  const loading = useSelector(patientIsLoading);
  const dispatch = useDispatch();
  const router = useRouter();
  const { PatientId } = router.query;

  const validationSchema = Yup.object().shape({
    targetName: Yup.string().min(2, "Too Short!").max(500, "Too Long!").required("Please enter Target Name"),
  })

  const onSubmit = async (values, { resetForm }) => {
    const valueToSend = {
      "PatientID": PatientId,
      "Probdatas": [
        {
          "TargetQuestion": values.targetName
        }
      ],
      setModalOpen,
      resetForm
    }
    dispatch(probeDataCreation(valueToSend));
    setModalOpen
  };

  return (
    <>
      <button type='button' className='btn btn-primary btn-md waves-effect waves-light action_btn' onClick={tog_modal}>
        Create Target
      </button>
      <Formik initialValues={{
        targetName: "",
      }} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
        {({ touched, errors, handleSubmit, resetForm, isSubmitting, setFieldValue, values }) => (
          <Modal isOpen={modalOpen} toggle={tog_modal} size='lg'>
            <ModalHeader toggle={() => setModalOpen(!modalOpen)}>Create Target</ModalHeader>
            <ModalBody>
              <div className='mb-4'>
                <label className='form-label required'>Target Name</label>
                <Field type='text' className='form-control' placeholder='Enter target name' name="targetName" />
                {errors.targetName && touched.targetName ? <ErrorMessage className='text-danger small' name='targetName' component='div' /> : null}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type='button' color='light' className='waves-effect' onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={loading} onClick={handleSubmit} color='primary' className='waves-effect waves-light' >
                Create
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default CreateTarget;
