import { useFormikContext } from "formik";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import { selectUploadImageData } from "../../../store/slice/common.slice";
import { selectContentMediaList, selectIsPostContentMediaLoading } from "../../../store/slice/content.slice";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const ImageConfig = ({ uploadedFile, setContentConfiguration }) => {
  const file_uploaded_url = useSelector(selectUploadImageData);
  const file_url = file_uploaded_url ? file_uploaded_url : uploadedFile;
  const { values, setFieldValue } = useFormikContext();
  const [imgDescription, setImgDescription] = useState(values.ContentDescription ? values.ContentDescription : "");
  const CreateContentMediaIsLoading = useSelector(selectIsPostContentMediaLoading);
  const ContentMediaData = useSelector(selectContentMediaList);
  const ContentMediaDataList = ContentMediaData.filter((media) => media.Status == 1);

  useEffect(() => {
    if (ContentMediaDataList.length > 0) {
      const description = ContentMediaDataList[0].Description;
      setImgDescription(description);
    }
  }, [ContentMediaData]);

  const onSubmitImageContent = async () => {
    await setFieldValue("ContentDescription", imgDescription);

    await setContentConfiguration(false);
  };
  const onCancelImageContent = async () => {
    await setContentConfiguration(false);
  };
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "align",
  ];
  const modules = {
    toolbar: [
      // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ 'font': [] }],
      [{ 'align': [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };
  return (
    <>
      <Container fluid>
        <Row>
          <Col md={10} className='m-2 d-flex justify-content-center'>
            <img className='d-flex justify-content-center' src={file_url} alt='contentpic' style={{ maxHeight: 500, maxWidth: 500 }} />
          </Col>
        </Row>
        <div className='mb-3 mx-3'>
          <label className='form-label'>Description</label>
          <QuillNoSSRWrapper name='description' theme='snow' formats={formats} modules={modules} placeholder='Enter description ...' value={imgDescription} onChange={(data) => setImgDescription(data)} />
        </div>
        <div className='container-action d-flex justify-content-end'>
          <button type='button' className='btn btn-light btn-md waves-effect waves-light action_btn' onClick={onCancelImageContent}>
            Cancel
          </button>

          <button type='button' onClick={onSubmitImageContent} disabled={CreateContentMediaIsLoading} className='btn btn-primary btn-md waves-effect waves-light action_btn ml-2'>
            Save
          </button>
        </div>
      </Container>
    </>
  );
};

export default ImageConfig;
