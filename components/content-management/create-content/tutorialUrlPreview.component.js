import { useRef,  useEffect } from "react";
import videojs from "video.js";

export const VideoPreviewPlayer = (props) => {
  const TYPE = props.file_type;
  const videoPlayerRef = useRef(null);
  const videoSrc = props.file_src;

  const videoJSOptions = {
    type: TYPE,

    controls: true,
  };

  // useEffect(() => {
  //   if (videoPlayerRef) {
  //     const player = videojs(videoPlayerRef.current, videoJSOptions, () => {
  //       player.src({ src: videoSrc, type: videoJSOptions.type });
  //       player.on("ended", () => {
  //       });
  //     });
  //   }

  //   return () => {};
  // }, [props]);

  return (
    <div>
      {/* <video src={videoSrc} autoPlay controls  className='video-js' /> */}
      <iframe src={videoSrc} title="tutorial"></iframe>
    </div>
  );
};
