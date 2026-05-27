import { useSelector } from "react-redux";
import { Button } from "reactstrap";
import { selectUploadImageData } from "../../../store/slice/common.slice";
import AudioConfig from "./audioConfig.component";
import ImageConfig from "./imageConfig.component";
import VideoConfigurations from "./videoConfig.component";

const Configurations = ({ setContentConfiguration, fileFormat }) => {
  const file_uploaded_url = useSelector(selectUploadImageData);
  const extension = getFileExtension(file_uploaded_url ? file_uploaded_url : fileFormat);
  function getFileExtension(url) {
    const parts = url.split(".");
    return parts[parts.length - 1];
  }


  if (extension === "jpg" || "jpeg" || "png" || "pdf") {
    console.log("1");
  }

  if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "pdf"].includes(extension)) {
    return (
      <>
        {" "}
        <div className='d-flex justify-content-between '>
          <h5 className='align-middle'>Configure content</h5>
          <Button color='light' className='btn btn-rounded waves-effect waves-light' onClick={() => setContentConfiguration(false)}>
            <i className='mdi mdi-close-thick align-middle'></i>
          </Button>
        </div>
        <ImageConfig uploadedFile={fileFormat} setContentConfiguration={setContentConfiguration} />
      </>
    );
  }
  if (["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm", "m4v", "mpeg"].includes(extension)) {
    return (
      <>
        {" "}
        <div className='d-flex justify-content-between '>
          <h5 className='align-middle'>Configure content</h5>
          <Button color='light' className='btn btn-rounded waves-effect waves-light' onClick={() => setContentConfiguration(false)}>
            <i className='mdi mdi-close-thick align-middle'></i>
          </Button>
        </div>
        <VideoConfigurations uploadedFile={fileFormat} setContentConfiguration={setContentConfiguration} />
      </>
    );
  }
  if (["mp3", "wav", "ogg", "flac", "aac", "m4a"].includes(extension)) {
    return (
      <>
        {" "}
        <div className='d-flex justify-content-between '>
          <h5 className='align-middle'>Configure content</h5>
          <Button color='light' className='btn btn-rounded waves-effect waves-light' onClick={() => setContentConfiguration(false)}>
            <i className='mdi mdi-close-thick align-middle'></i>
          </Button>
        </div>
        <AudioConfig uploadedFile={fileFormat} setContentConfiguration={setContentConfiguration} />
      </>
    );
  }
};

export default Configurations;
