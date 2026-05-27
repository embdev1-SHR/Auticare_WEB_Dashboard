import AudioConfig from "./audioConfig.component";
import ImageConfig from "./imageConfig.component";
import { VideoPlayer } from "./vidoe-player";

const Configurations = ({ url, type, list }) => {

  function getFileExtension(url) {
    const parts = url.split(".");
    return parts[parts.length - 1];
  }

  function getVideoTypeFromS3Url(s3Url) {
    const fileExtension = getFileExtension(s3Url);
    const extensionToTypeMap = {
      mp4: "video/mp4",
      mpeg: "video/mpeg",
      mov: "video/quicktime",
      avi: "video/x-msvideo",
      wmv: "video/x-ms-wmv",
      flv: "video/x-flv",
      mkv: "video/x-matroska",
    };
    return extensionToTypeMap[fileExtension];
  }

  if (type == "Image") {
    return (<>
      <div className='d-flex justify-content-between '>
      </div>
      <ImageConfig url={url} />
    </>);
  }
  else if (type == "Audio") {
    return (<>
      <div className='d-flex justify-content-between '>
      </div>
      <AudioConfig url={url} />
    </>);
  }
  else if (type == "Video") {
    return (<>
      <div className='d-flex justify-content-between '>
        {/* <video ref={videoPlayerRef}className='video-js' style={{ marginBottom: "5%", marginLeft: "25%", maxHeight: "400px", width: '500px', margin: 'auto', display: 'flex' }} ></video> */}
        <VideoPlayer overlays={list} file_src={url} file_type={getVideoTypeFromS3Url(url)} />
      </div>
    </>);
  }
  else {
    return null
  }
};

export default Configurations;
