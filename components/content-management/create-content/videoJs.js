import { useEffect, useRef, useState } from "react";
import { Button } from "reactstrap";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import SpinnerComponent from "./videoOverlayLoader.component";

export const VideoJS = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady, setState } = props;

  const [currentTime, setCurrentTime] = useState(null);
  const [startBtnColor, setStartBtnColor] = useState("success");
  const [endBtnColor, setEndBtnColor] = useState("secondary");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));

      player.on("timeupdate", () => {
        setCurrentTime(player.currentTime());
      });
    }

  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  function getCurrentTime(type) {
    const player = playerRef.current;
    if (type === "start") {
      setLoading(true);
      setState((prev) => ({ ...prev, start: currentTime }));
      setStartBtnColor("secondary");
      setEndBtnColor("danger");
    } else if (type === "end") {
      setLoading(false);
      setState((prev) => ({ ...prev, end: currentTime }));
      player.pause();
      setStartBtnColor("success");
      setEndBtnColor("secondary");
    }
  }

  return (
    <div data-vjs-player>
      <div ref={videoRef} />

      <div className='d-flex justify-content-center mt-3 align-middle'>
        <Button className='me-2 btn-rounded' color={startBtnColor} onClick={() => getCurrentTime("start")}>
          Start
        </Button>
        {loading ? <SpinnerComponent /> : null}
        <Button className='ml-2 btn-rounded' color={endBtnColor} onClick={() => getCurrentTime("end")}>
          Stop{" "}
        </Button>
      </div>
    </div>
  );
};

export default VideoJS;
