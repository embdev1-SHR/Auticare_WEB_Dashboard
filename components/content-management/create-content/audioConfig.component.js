import { useFormikContext } from "formik";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { Button, Col, Container, Row } from "reactstrap";
import { selectUploadImageData } from "../../../store/slice/common.slice";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const AudioConfig = ({ uploadedFile, setContentConfiguration }) => {
  const file_uploaded_url = useSelector(selectUploadImageData);
  const file_url = file_uploaded_url ? file_uploaded_url : uploadedFile;
  const { values, setFieldValue } = useFormikContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioDescription, setAudioDescription] = useState(values.ContentDescription ? values.ContentDescription : "");
  const [isEditAudioDesc, setIsEditAudioDesc] = useState(false);
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

  const onSubmitAudioContent = async () => {
    await setFieldValue("ContentDescription", audioDescription);
    await setContentConfiguration(false);
  };

  const onCancelContent = async () => {
    await setContentConfiguration(false);
  };
  const handleInputChange = (values) => setAudioDescription(values);
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "align",
  ];
  const modules = {
    toolbar: [
      // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ 'font': [] }],
      [{ 'align': [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
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
            <audio ref={audioRef} src={file_url} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onTimeUpdate={handleTimeUpdate} onLoadedData={handleLoadedData} />
          </div>
        </Row>
        <div className='my-1 ml-1 me-3'>
          <label className='form-label'>Description</label>
          <QuillNoSSRWrapper
            name='description'
            theme='snow'
            placeholder='Enter description ...'
            readOnly={values.ContentDescription ? !isEditAudioDesc : false}
            value={audioDescription}
            formats={formats}
            modules={modules}
            onChange={(data) => handleInputChange(data)}
          />
        </div>
        <div className='container-action d-flex justify-content-end mt-3'>
          <button type='button' className='btn btn-light btn-md waves-effect waves-light action_btn' onClick={onCancelContent}>
            Cancel
          </button>

          {values.ContentDescription ? (
            isEditAudioDesc ? (
              <button type='button' onClick={onSubmitAudioContent} className='btn btn-primary btn-md waves-effect waves-light action_btn ml-2'>
                Update
              </button>
            ) : (
              <button type='button' onClick={() => setIsEditAudioDesc(true)} className='btn btn-warning btn-md waves-effect waves-light action_btn ml-2'>
                Edit
              </button>
            )
          ) : (
            <button type='button' onClick={onSubmitAudioContent} className='btn btn-primary btn-md waves-effect waves-light action_btn ml-2'>
              Save
            </button>
          )}
        </div>
      </Container>
    </>
  );
};

export default AudioConfig;
