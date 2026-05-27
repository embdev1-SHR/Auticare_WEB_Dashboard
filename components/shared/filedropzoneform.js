import { useState } from "react";
import { Row, Col, Card, Spinner } from "reactstrap";
import { useDropzone } from "react-dropzone";
import ViewImage from "./viewImage.component";

function FileDropZoneForm({
  multiFiles,
  fileData,
  isUploading,
  displayName,
  setFieldValue
}) {
  const { getRootProps, getInputProps } = useDropzone({
    multiple: multiFiles,
    accept: [".jpeg", ".jpg", ".png", ".gif", ".pdf"],
    onDrop: (acceptedFiles) => handleAcceptedFiles(acceptedFiles),
  });
  const [fileEdit, setFileEdit] = useState(true);

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleAcceptedFiles = (files) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    fileData(files, setFieldValue);
    setFileEdit(false);

    if (multiFiles) {
      selectedFiles.length > 0 ? setSelectedFiles(selectedFiles.concat(files)) : setSelectedFiles(files);
    } else {
      setSelectedFiles(files);
    }
  };

  /**
   * Formats the size
   */
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className='dropzone'>
      {isUploading ? (
        <div className='text-center  p-5'>
          <Spinner className='mt-3' color='primary' />
        </div>
      ) : (
        <section>
          <div className='dz-message needsclick' style={{ textAlign: "center" }} {...getRootProps()}>
            <input {...getInputProps()} />
            <div className='mb-2'>
              <i className='display-4 text-muted ri-upload-cloud-2-line' />
            </div>
            <h6 className='mb-2'>Drop files here or click to upload.</h6>
          </div>
          {fileEdit && displayName && (
            <Card className='mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete'>
              <div className='p-2'>
                <Row className='align-items-center'>
                  <Col>
                    {/* <a href={displayName} target='_blank' rel='noreferrer' className='d-flex justify-content-center font-weight-bold'>
                      View File
                    </a> */}
                    <ViewImage
                    displayName={displayName}
                    ></ViewImage>
                  </Col>
                </Row>
              </div>
            </Card>
          )}
        </section>
      )}

      <div className='dropzone-previews mt-3' id='file-previews'>
        {selectedFiles.map((f, i) => {
          return (
            <Card className='mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete' key={i + "-file"}>
              <div className='p-2'>
                <Row className='align-items-center'>
                  <Col>
                    <a className='text-muted font-weight-bold'>{f.name}</a>
                    <p className='mb-0'>
                      <strong>{f.formattedSize}</strong>
                    </p>
                  </Col>
                </Row>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
export default FileDropZoneForm;
