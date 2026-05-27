import { useState } from "react";
import { Row, Col, Card, Spinner, Button } from "reactstrap";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectUploadImageData } from "../../../store/slice/common.slice";
import { useFormikContext } from "formik";
const path = require("path");

function DropZoneComponent({ setContentConfiguration, multiFiles, fileData, isUploading, displayName, content }) {
  const { values } = useFormikContext();
  const Type = values.ContentCategory?.toLowerCase()
  let acceptedFileTypes;
  switch (Type) {
    case "video":
      acceptedFileTypes = 'video/*';
      break;
    case "audio":
      acceptedFileTypes = 'audio/*';
      break;
    case "image":
      acceptedFileTypes = 'image/*';
      break;
    default:
      acceptedFileTypes = ''
  }

  const file_uploaded = useSelector(selectUploadImageData);
  const filename = file_uploaded ? path.basename(file_uploaded) : "";
  const displayfile = displayName ? path.basename(displayName) : "";
  const { getRootProps, getInputProps } = useDropzone({
    multiple: multiFiles,
    accept: acceptedFileTypes,
    onDrop: (acceptedFiles) => handleAcceptedFiles(acceptedFiles),
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleAcceptedFiles = (files) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    fileData(files);

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
      <div className='dropzone-previews mt-3' id='file-previews'>
        <>
          {file_uploaded === null && displayName ? (
            <Card className='mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete'>
              {/* <Card className='mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete' key={i + "-file"}> */}
              <div className='p-2'>
                <Row className='align-items-center'>
                  <Col>
                    <a className='text-muted font-weight-bold'>{displayfile}</a>
                  </Col>
                  <Col>
                    {content.FileUploadURL == null ? <></> : <Button color='info' outline className='btn-rounded waves-effect waves-light me-1 float-end' onClick={() => setContentConfiguration(true)}>
                      Content configuration
                    </Button>}
                  </Col>
                </Row>{" "}
              </div>
            </Card>
          ) : file_uploaded ? (
            <Card className='mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete'>
              {/* <Card className='mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete' key={i + "-file"}> */}
              <div className='p-2'>
                <Row className='align-items-center'>
                  <Col>
                    <a className='text-muted font-weight-bold'>{filename}</a>
                  </Col>
                  <Col>
                    {content.FileUploadURL == null ? <></> :
                      <Button color='info' outline className='btn-rounded waves-effect waves-light me-1 float-end' onClick={() => setContentConfiguration(true)}>
                        Content configuration
                      </Button>
                    }
                  </Col>
                </Row>{" "}
              </div>
            </Card>
          ) : null}
        </>
      </div>

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
            <h6>Drop files here or click to upload.</h6>
          </div>
          {/* {fileEdit && displayName && (
            <Card className='mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete'>
              <div className='p-2'>
                <Row className='align-items-center'>
                  <Col className='col-auto'>
                    <img className='avatar-sm rounded bg-light' alt={selectedFiles} src={file} height={50} width={50} />
                  </Col>

                  <Col>
                    <a className='text-muted font-weight-bold' href={file} target='_blank' rel='noreferrer'>
                      {displayName?.substring(13).replace(/-/g, " ")}
                    </a>
                  </Col>
                </Row>
              </div>
            </Card>
          )} */}
        </section>
      )}
    </div>
  );
}
export default DropZoneComponent;
