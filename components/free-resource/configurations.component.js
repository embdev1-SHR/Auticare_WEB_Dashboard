import AudioConfig from "./audioConfig.component";
import ImageConfig from "./imageConfig.component";

const Configurations = ({ url, type, setContentConfiguration }) => {

  if (type == "Image") {
    return (<>
      <div className='d-flex justify-content-between '>
      </div>
      <ImageConfig url={url} />
    </>);
  }
  if (type == "Audio") {
    return (<>
      <div className='d-flex justify-content-between '>
      </div>
      <AudioConfig url={url} />
    </>);
  }
  if (type == "Video") {
    return (<>
      <div className='d-flex justify-content-between '>
      </div>
      <video src={url} autoPlay controls style={{marginBottom:"5%", marginLeft:"25%", maxHeight:"300px" }}></video>
    </>);
  }
  return (
    <>
    </>
  );
};

export default Configurations;
