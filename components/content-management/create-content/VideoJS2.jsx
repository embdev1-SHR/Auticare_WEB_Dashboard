import { useRef, useEffect } from "react";
import videojs from "video.js";
import "videojs-overlay";

export const VideoPlayer = (props) => {
  const data = props.overlays.map(item => {
    if (item) {
      return {
        ...item,
        start: (Number(item.start) || Number(item.start) == 0) ? Number(item.start) : Number(item.StartPosition),
        end: (Number(item.end) || Number(item.end) == 0) ? Number(item.end) : Number(item.EndPosition),
      };
    }
    return item;
  });


  const TYPE = props.file_type;
  const videoPlayerRef = useRef(null); // Instead of ID
  const videoSrc = props.file_src;

  const videoJSOptions = {
    type: TYPE,
    autoplay: "muted",
    controls: true,
    width: 300,
    height: 300,
  };

  useEffect(() => {


    if (videoPlayerRef) {
      const player = videojs(videoPlayerRef.current, videoJSOptions, () => {
        player.src({ src: videoSrc, type: videoJSOptions.type });
        player.on("ended", () => {
        });
        player.on("timeupdate", () => {
          // setCurrentTime(player.currentTime());
        });
      });

      player.overlay({
        overlays: data,
      });
    }
  }, [props]);

  return (
    <div>
      <video ref={videoPlayerRef} className='video-js' />
    </div>
  );
};
