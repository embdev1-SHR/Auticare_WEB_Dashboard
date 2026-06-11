import AudioConfig from "./audioConfig.component";
import ImageConfig from "./imageConfig.component";
import { VideoPlayer } from "../patient-management/view-patient/home-session/vidoe-player";

const Configurations = ({ url, type }) => {
  if (!url || !type) return null;
  if (type === "Image") return <ImageConfig url={url} />;
  if (type === "Audio") return <AudioConfig url={url} />;
  if (type === "Video") return <VideoPlayer file_src={url} overlays={[]} />;
  return null;
};

export default Configurations;
