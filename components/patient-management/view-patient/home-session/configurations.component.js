import AudioConfig from "./audioConfig.component";
import ImageConfig from "./imageConfig.component";
import { VideoPlayer } from "./vidoe-player";

const Configurations = ({ url, type, overlays }) => {
  if (!url || !type) return null;

  if (type === "Image") return <ImageConfig url={url} />;
  if (type === "Audio") return <AudioConfig url={url} />;
  if (type === "Video") return <VideoPlayer file_src={url} overlays={overlays || []} />;
  return null;
};

export default Configurations;
