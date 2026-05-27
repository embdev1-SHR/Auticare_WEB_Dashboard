import { useState } from "react";
import { Row, Col, Card, Spinner } from "reactstrap";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectUploadImageData } from "../../store/slice/common.slice";

function DropZoneForm({ multiFiles, fileData, isUploading, displayName, accept=[".jpeg", ".jpg", ".png", ".gif"], setFieldValue=null }) {
  const imageuploaded = useSelector(selectUploadImageData);

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    multiple: multiFiles,
    onDrop: (acceptedFiles) =>{ handleAcceptedFiles(acceptedFiles)
    },
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageEdit, setImageEdit] = useState(true);
  const handleAcceptedFiles = (files) => {

    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    try {
      fileData(files, setFieldValue);
    } catch (error) {
      console.log(error);
    }
    setImageEdit(false);
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
            <h6>Drop files here or click to upload.</h6>
          </div>
          {imageEdit && displayName && (
            <Card className='mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete'>
              <div className='p-2'>
                <Row className='align-items-center'>
                  <Col className='col-auto'>
                    <img className='avatar-sm rounded bg-light' alt={selectedFiles} 
                    src={`${displayName}`} 
                    //src={`https://pngimg.com/uploads/github/github_PNG28.png`} 
                    height={50} width={50} />
                  </Col>
                  <Col>
                    <a className='text-muted font-weight-bold' 
                    href={`${displayName}`} 
                    //href={`https://pngimg.com/uploads/github/github_PNG28.png`} 
                    target='_blank' rel='noreferrer'>
                      {displayName?.substring(13).replace(/-/g, " ")}
                    </a>
                  </Col>
                </Row>
              </div>
            </Card>
          )}
        </section>
      )}

      <div className='dropzone-previews mt-3' id='file-previews'>
        {imageuploaded !== null &&
          selectedFiles.map((f, i) => {
            return (
              <Card className='mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete' key={i + "-file"}>
                <div className='p-2'>
                  <Row className='align-items-center'>
                    <Col className='col-auto'>
                      {/* <img
                      data-dz-thumbnail=""
                      height="80"
                      className="avatar-sm rounded bg-light"
                      alt={f.name}
                      src={f.preview}
                    /> */}
                    { ["image/jpeg", "image/jpg" , "image/png" , "image/gif"].includes(f.type) ? <Image className='avatar-sm rounded bg-light' alt={f.name} src={f.preview} height={50} width={50} />: <></>  }
                    </Col>
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
export default DropZoneForm;
