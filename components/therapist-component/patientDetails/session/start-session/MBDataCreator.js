import { useState } from "react";
import { Label } from "reactstrap";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import { BehaviourList, TrailData, mandList, patientHlist } from "../../../../../store/slice/patient.slice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export function MBDataCreator() {
  const dispatch = useDispatch();
  const addedData = useSelector(patientHlist)
  const [BMdata, SetBMdata] = useState(false)
  const [Behavior, SetBehavior] = useState(false)
  const [inputList, setInputList] = useState([""]);
  const TrailValue = useSelector(TrailData);




  const validationSchema = Yup.object().shape({
    MBData: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Please enter Data"),
  })
  const onSubmit = async (values, { resetForm }) => {
    setInputList([values.MBData])

    if (Behavior) {
      dispatch(BehaviourList(values.MBData));
      setInputList([""]);
    }
    else {
      dispatch(mandList(values.MBData));
      setInputList([""]);
    }
    resetForm();
    SetBMdata(false);
    SetBehavior(false);
  };

  return (
    <>
      {TrailValue[0]?.IsFinished === 1 ? <></> :
        <Formik initialValues={{
          MBData: ""
        }} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
          {({
            touched, errors, handleSubmit
          }) => <div className="col-4">
              {BMdata != true ? <div className='container-action pb-1 pl-3 mt-5 mb-4'>
                <div className="row ml-5">
                  <div className="col-7 mb-2">
                    <button type='button' onClick={() => {
                      SetBMdata(true), SetBehavior(true);
                    }} className='btn btn-primary btn-md waves-effect waves-light btn-block'>Add Behavior Data</button>
                  </div>
                  <div className="col-7">
                    <button onClick={() => SetBMdata(true)} className='btn btn-primary btn-md waves-effect waves-light btn-block'>Add Mand Data</button>
                  </div>
                </div>
              </div> : <div className="row mt-5">
                <div className='mb-4'>
                  <div className="row">
                    <div className="col">
                      <div className='mb-4'>
                        <Label className='form-label required' htmlFor='Department'>
                          {Behavior == true ? "Behavior Data" : "Mand Data"}
                        </Label>
                        <Field id='MBData' name='MBData' placeholder='Type here ...' className='form-control' />
                        {errors.MBData && touched.MBData ? <ErrorMessage className='text-danger small' name='MBData' component='div' /> : null}
                      </div>
                    </div>
                    <div className='ml-4'>
                      <div className=' d-flex justify-content-end pt-2' >
                        <button type='button' onClick={() => {
                          SetBMdata(false), SetBehavior(false);
                        }} className='btn btn-light btn-md waves-effect waves-light action_btn'>
                          Cancel
                        </button>
                        <button type='submit' className='btn btn-primary btn-md waves-effect waves-light action_btn ml-2 mr-4' onClick={handleSubmit}>Submit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
            </div>}
        </Formik>}
    </>
  );
}
