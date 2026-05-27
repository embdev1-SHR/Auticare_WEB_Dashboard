import { Row, Col, Label, Spinner } from "reactstrap";
import { useState } from "react";
import { Field, ErrorMessage, useFormikContext, setFieldValue } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../../../store/slice/common.slice";
import FileDropZoneForm from "../../shared/filedropzoneform";
import MultiSelectTextInput from "../../../components/shared/multi-select-text.component";

function ProblemDetails() {
  const dispatch = useDispatch();
  const { errors, touched, setFieldValue } = useFormikContext();
  const [Issue, setIssue] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [reportsLoading, setReportsLoading] = useState(false);
  const uploadDocumentFile = async (files) => {
    if (files.length > 0) {
      setDocumentsLoading(true);

      let formData = new FormData();
      formData.append("imageFile", files[0]);

      try {
        const originalPromiseResult = await dispatch(uploadImage(formData)).unwrap();

        const filename = originalPromiseResult.split("/").pop();
        const nonSpaceName = filename.indexOf("%20") >= 0 ? filename.replace(/%20/g, "-") : filename;
        await setFieldValue("DocumentsURL", originalPromiseResult);
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
        await setFieldValue("ReportsURL", originalPromiseResult);
        setReportsLoading(false);
      } catch (rejectedValueOrSerializedError) {
        setReportsLoading(false);
      }
    }
  };
  return (
    <>
      <Row>
        <Col lg='6'>
          {/* <div className='mb-4'>
            <Label className='form-label required' htmlFor='issuelist'>
              Issue list
            </Label>
            <Field type='text' name='IssueList' id='issuelist' className='form-control' placeholder='enter IssueList ' />
            {errors.IssueList && touched.IssueList ? <ErrorMessage className='text-danger small' name='IssueList' component='div' /> : null}
          </div> */}
          <div className='mb-4'>
            <Label className='form-label' htmlFor='Issue'>
              Issue list
            </Label>
            <Field
              component={MultiSelectTextInput}
              name='IssueList1'
              value={Issue}
              setValue={setIssue}
              placeholder='Enter issues'
              nameAttribute='IssueList' />
            {errors.IssueList1 && touched.IssueList1 ? <ErrorMessage className='text-danger small' name='IssueList1' component='div' /> : null}
          </div>
        </Col>
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='previous'>
              Previous treatment history
            </Label>
            <Field type='text' name='Previoustreatmenthistory' id='previous' className='form-control' placeholder='Enter previous treatment history' />
            {errors.Previoustreatmenthistory && touched.Previoustreatmenthistory ? <ErrorMessage className='text-danger small' name='Previoustreatmenthistory' component='div' /> : null}
          </div>
        </Col>
      </Row>
      <Row>
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
      </Row>
      <Row>
        <Col lg='6'>
          <div className='mb-4'>
            <Label className='form-label required' htmlFor='remarks'>
              Remarks
            </Label>
            <Field type='text' name='Remarks' id='remarks' className='form-control' placeholder='Remarks' />
            {errors.Remarks && touched.Remarks ? <ErrorMessage className='text-danger small' name='Remarks' component='div' /> : null}
          </div>
        </Col>
      </Row>
    </>
  );
}

export default ProblemDetails;
