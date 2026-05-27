import { ErrorMessage, Field, Formik, useFormikContext } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { fetchPatientIssuesList, selectPatientDetails, selectPatientIssuesList, selectpatientIsEdit, setPatientEdit, updatePatient } from "../../../store/slice/patient.slice";
import MultiSelectTextInput from "../../shared/multi-select-text.component";
import moment from "moment";
import FileDropZoneForm from "../../shared/filedropzoneform";
import { uploadImage } from "../../../store/slice/common.slice";

const HistoricalData = () => {
  // const { setFieldValue } = useFormikContext();
  const dispatch = useDispatch();
  const router = useRouter();
  const { PatientId } = router.query;
  const isEdit = useSelector(selectpatientIsEdit);
  let patient = useSelector(selectPatientDetails);
  console.log("patient >>>>>>>", patient);
  patient = patient[0]
  useEffect(() => {
    dispatch(fetchPatientIssuesList(PatientId));
  }, [PatientId, dispatch]);
  let patientDetail = useSelector(selectPatientDetails);
  const patientIssuesList = useSelector(selectPatientIssuesList);
  console.log("patientIssuesList *1",patientIssuesList);
  patientDetail = patientDetail[0];
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState();
  const [imgUrl2, setImgUrl2] = useState();

  const [Issue, setIssue] = useState();
  console.log("patientIssuesList", Issue);


  useEffect(() => {
    const newArray = patientIssuesList.map(obj => ({ label: obj.IssueName, value: obj.IssueName }));
    setIssue(newArray);
  }, [patientIssuesList]);

  const validationSchema = Yup.object().shape({
    // SubSkill: Yup.string().required("Please enter Issue"),
    Difficulty: Yup.string().max(500, "Too Long!").required("Please enter Difficulty"),
    Remarks: Yup.string().max(500, "Too Long!").required("Please enter Remarks"),
  })
  const onCancel = async () => {
    await dispatch(setPatientEdit(false));
    await router.back();
  };
  function createFormatDate(date) {
    return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
  }

  const onSubmit = async (values) => {
    const deletedArray = [];
    const newArray = [];

    for (const item of patientIssuesList) {
      if (!values.IssueList.includes(item.IssueName)) {
        deletedArray.push(item);
      }
    }

    for (const issue of values.IssueList) {
      const found = patientIssuesList.find(item => item.IssueName === issue);
      if (!found) {
        newArray.push(issue);
      }
    }

    dispatch(
      updatePatient({
        ...patient,
        Status: true,
        Remarks: values.Remarks,
        PreviousTreatmentHistoryDescription: values.PreviousTreatmentHistoryDescription,
        Difficulty: values.Difficulty,
        DOB: createFormatDate(patient.DOB),
        AddIssueList: newArray.length > 0 ? newArray : undefined,
        RemoveIssueListID: deletedArray.length > 0 ? deletedArray.map(e => e.IssueID) : undefined,
        ReportsURL: imgUrl2 ? imgUrl2 : patient.ReportsURL,
        DocumentsURL: imgUrl ? imgUrl : patient.DocumentsURL
      })
    );
  };


  const uploadDocumentFile = async (files) => {
    if (files.length > 0) {
      setDocumentsLoading(true);

      let formData = new FormData();
      formData.append("imageFile", files[0]);

      try {
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();

        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, "-") : filename;
        // await setFieldValue("DocumentsURL", originalPromiseResult);
        setImgUrl(originalPromiseResult)
        setDocumentsLoading(false);
      } catch (rejectedValueOrSerializedError) {
        console.log(rejectedValueOrSerializedError);
        setDocumentsLoading(false);
      }
    }
  };

  const uploadReportFile = async (files) => {
    if (files.length > 0) {
      setReportsLoading(true);

      let formData = new FormData();
      formData.append("imageFile", files[0]);

      try {
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();
        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, "-") : filename;
        // await setFieldValue("ReportsURL", originalPromiseResult);
        setImgUrl2(originalPromiseResult)
        setReportsLoading(false);
      } catch (rejectedValueOrSerializedError) {
        setReportsLoading(false);
      }
    }
  };


  return (
    <Formik initialValues={patient} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
      {({ touched, errors, handleSubmit, resetForm, isSubmitting, setFieldValue, values }) => (

        <>
          <div className='tab_data_header'>
            <div className='tab_title'>
              <h3>Historical Data</h3>
            </div>
          </div>
          <Row>
            <Col md='6'>
              <div>
                <h5 className='font-size-14'>Previous Treatment History Description</h5>
                {/* <div className='m-1'>{patientDetail?.PreviousTreatmentHistoryDescription ? patientDetail?.PreviousTreatmentHistoryDescription : "- Nil -"}</div> */}
                <Field as='textarea' rows={3} className='form-control' id='activity-desc' name='PreviousTreatmentHistoryDescription' placeholder='Previous Treatment History Description' />
                <div>
                  {/* <Link href={`${patientDetail?.PreviousTreatmentHistoryURL}`} passHref>
                    <a target='_blank' className='waves-effect waves-light my-2 btn-info btn-sm'>
                      View Treatment History
                    </a>
                  </Link> */}
                </div>
                {isEdit ? <div className='mb-4'>
                  <Label className='form-label required' htmlFor='remarks'>
                    Remarks
                  </Label>
                  <Field type='text' name='Remarks' id='remarks' className='form-control' placeholder='Remarks' />
                  {errors.Remarks && touched.Remarks ? <ErrorMessage className='text-danger small' name='Remarks' component='div' /> : null}
                </div> : <div><h5 className='font-size-14'>Remarks</h5>
                  <div className='m-1'>{patientDetail?.Remarks ? patientDetail?.Remarks : "- Nil -"}</div></div>}

              </div>
            </Col>
            <Col md='6'>
              <Row>
                <Col md='6'>
                  <h5 className='font-size-14'>Documents</h5>
                  <div>
                    <Link href={`${patientDetail?.DocumentsURL}`} passHref>
                      <a target='_blank' className='waves-effect waves-light my-1 btn-info btn-sm'>
                        View Documents
                      </a>
                    </Link>
                  </div>
                </Col>
                <Col md='6'>
                  <h5 className='font-size-14'>Reports</h5>
                  <div>
                    <Link href={`${patientDetail?.ReportsURL}`} passHref>
                      <a target='_blank' className='waves-effect waves-light my-1 btn-info btn-sm'>
                        View Reports
                      </a>
                    </Link>
                  </div>
                </Col>
              </Row>
              {isEdit && <Row>
                <Col lg='6'>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='documents'>
                      Documents
                    </Label>

                    <FileDropZoneForm multiFiles={false} name='DocumentsURL' isUploading={documentsLoading} fileData={uploadDocumentFile} />

                    {errors.DocumentsURL && touched.DocumentsURL ? <ErrorMessage className='text-danger small' name='DocumentsURL' component='div' /> : null}
                  </div>
                </Col>
                <Col lg='6'>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='reports'>
                      Reports
                    </Label>

                    <FileDropZoneForm multiFiles={false} name='ReportsURL' isUploading={reportsLoading} fileData={uploadReportFile} />

                    {errors.ReportsURL && touched.ReportsURL ? <ErrorMessage className='text-danger small' name='ReportsURL' component='div' /> : null}
                  </div>
                </Col>
              </Row>}
              {isEdit && <div className='mb-4'>
                <Label className='form-label' htmlFor='Issue'>
                  Issue list
                </Label>
                <Field
                  component={MultiSelectTextInput}
                  name='SubSkill'
                  value={Issue}
                  setValue={setIssue}
                  placeholder='Enter issues'
                  nameAttribute='IssueList' />
                {errors.SubSkill && touched.SubSkill ? <ErrorMessage className='text-danger small' name='SubSkill' component='div' /> : null}
              </div>}

              {!isEdit && <><h5 className='font-size-14 mt-1'>Issues</h5>
                <ul className='list-unstyled product-desc-list'>
                  {patientIssuesList.length > 0
                    ? patientIssuesList.map((item, i) => (
                      <li key={i}>
                        <i className='mdi mdi-circle-medium me-1 align-middle'></i> {item.IssueName}
                      </li>
                    ))
                    : "- Nil -"}
                </ul></>}
              {isEdit ? <div className='mb-4'>
                <Label className='form-label required' htmlFor='Difficulty'>
                  Difficulty
                </Label>
                <Field type='text' name='Difficulty' id='Difficulty' className='form-control' placeholder='Difficulty' />
                {errors.Difficulty && touched.Difficulty ? <ErrorMessage className='text-danger small' name='Difficulty' component='div' /> : null}
              </div> : <div><h5 className='font-size-14 mt-1'>Difficulty</h5>
                <ul className='list-unstyled product-desc-list'>
                  <li>
                    <i className='mdi mdi-circle-medium me-1 align-middle'></i> {patientDetail?.Difficulty}
                  </li>
                </ul></div>}

            </Col>
          </Row>
          <ul className='pager wizard twitter-bs-wizard-pager-link w-100' style={{ listStyle: "none" }}>
            <li className={"submit"}>
              {isEdit ? (
                <>
                  <Button color='secondary' onClick={onCancel} className='btn-md m-1 waves-effect waves-light action_btn'>
                    Cancel
                  </Button>

                  <Button type='submit' color='primary' className='btn-md m-1 waves-effect waves-light action_btn' onClick={handleSubmit} disabled={isSubmitting}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button type='button' color='secondary' className='btn-md waves-effect waves-light action_btn' onClick={() => router.back()}>
                  Back
                </Button>
              )}
            </li>
          </ul>
        </>
      )}
    </Formik>
  );
};

export default HistoricalData;
