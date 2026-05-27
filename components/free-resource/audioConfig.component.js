import { useRef, useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";

const AudioConfig = ({ url }) => {

  const fileSrc = url;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(14, 5);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedData = () => {
    setDuration(audioRef.current.duration);
  };

  return (
    <>
      <Container fluid>
        <Row>
          <div className='audio-player d-flex'>
            <Button className='audio-player__play-pause m-2' onClick={toggleAudio}>
              {isPlaying ? <i className='fas fa-pause'></i> : <i className='fas fa-play'></i>}
            </Button>
            <Col md={8} className='m-2'>
              <input
                type='range'
                className='form-range audio-player__progress m-2'
                min={0}
                max={duration}
                value={currentTime}
                onChange={(e) => {
                  audioRef.current.currentTime = e.target.value;
                  setCurrentTime(e.target.value);
                }}
              />{" "}
            </Col>
            <div className='audio-player__info  m-2'>
              <div className='audio-player__time mt-2'>
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            <audio ref={audioRef} src={fileSrc} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onTimeUpdate={handleTimeUpdate} onLoadedData={handleLoadedData} />
          </div>
        </Row>
      </Container>
    </>
  );
};

export default AudioConfig;
