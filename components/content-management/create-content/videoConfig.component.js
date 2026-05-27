import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "reactstrap";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectUploadImageData } from "../../../store/slice/common.slice";
import { GetContentMediaData, createContentMediaData, selectContentMediaList, selectIsContentMediaLoading, selectIsPostContentMediaLoading } from "../../../store/slice/content.slice";
import Loader from "../../shared/loader";
import { VideoPlayer } from "./VideoJS2";
import VideoConfigItem from "./videoConfigItem.component";
import VideoJS from "./videoJs";

const VideoConfigurations = ({ uploadedFile, setContentConfiguration }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { ContentID } = router.query;
  const file_url = useSelector(selectUploadImageData);
  const file_uploaded_url = file_url ? file_url : uploadedFile;
  const CreateContentMediaIsLoading = useSelector(selectIsPostContentMediaLoading);
  const ContentMediaData = useSelector(selectContentMediaList);
  const ContentMediaDataList = ContentMediaData?.filter((media) => media.Status == 1);
  const ContentMediaListIsLoading = useSelector(selectIsContentMediaLoading);

  useEffect(() => {
    dispatch(GetContentMediaData(ContentID));
  }, [ContentID, dispatch]);

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

  function getFileExtension(url) {
    const parts = url.split(".");
    return parts[parts.length - 1];
  }

  const file_src = file_uploaded_url;
  const TYPE = getVideoTypeFromS3Url(file_uploaded_url);

  const playerRef = useRef(null);
  const [overlayList, setOverlayList] = useState([]);
  const [currentTime, setCurrentTime] = useState({ start: 0, end: 0 });
  useEffect(() => {
    if (ContentMediaDataList.length > 0) {
      const newOverlayList = ContentMediaDataList.map((obj, key) => ({
        orderId: key,
        class: "overlaycss",
        MediaID: obj.MediaID,
        start: obj.StartPosition,
        end: obj.EndPosition,
        description: obj.Description,
        align: "right",
        content: `<div><div><div ><p class="card-text mt-3">${obj.Description}</p></div></div></div>`,
      }));
      setOverlayList(newOverlayList);
    }
  }, [ContentMediaData]);

  useEffect(() => {
    const largestId = overlayList.reduce((acc, obj) => {
      return obj.orderId > acc ? obj.orderId : acc;
    }, 0);

    if (currentTime.end !== 0) {
      setOverlayList((prev) => [...prev, { ...currentTime, description: "", orderId: largestId + 1 }]);
    }
  }, [currentTime.end]);

  const handleInputChange = (value, index, name) => {
    if (value !== "<p><br></p>") {

      const list = [...overlayList];
      list[index][name] = value;
      // list[index]["content"] = `<div class=" card overlay-video-card"><div class="card-body"><div class="mb-4 card-title"><p class="card-text mt-3">${value}</p></div></div></div>`;
      list[index]["content"] = `<div><div><div ><p class="card-text mt-3">${value}</p></div></div></div>`;
      list[index]["align"] = "right";
      list[index]["class"] = "overlaycss";
      setOverlayList(list);
    }
  };

  const videoJsOptions = {
    controls: true,
    responsive: true,
    autoplay: "muted",
    width: 500,
    height: 400,
    sources: [
      {
        src: file_src,
        type: TYPE,
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;
  };

  const handleDeleteDescription = (e, index) => {
    const values = [...overlayList];
    values.splice(index, 1);
    setOverlayList(values); // set the new state
  };

  const onSubmitVideoContent = async () => {
    const filteredArray = overlayList.filter((item) => !item.hasOwnProperty("MediaID"));
    const newArrayData = filteredArray.map((obj) => ({
      StartPosition: obj.start,
      EndPosition: obj.end,
      Description: obj.description,
    }));
    const objToSend = { ContentID, data: { MediaDatas: newArrayData } };
    await dispatch(createContentMediaData(objToSend));
    //await setContentConfiguration(false);
  };

  return (
    <>
      {ContentMediaListIsLoading ? (
        <Loader />
      ) : (
        <>
          <Container fluid>
            <Row>
              <Col sm={12} md={6}>
                <div className='d-flex justify-content-center'>
                  <VideoJS options={videoJsOptions} onReady={handlePlayerReady} setState={setCurrentTime} />
                </div>
              </Col>
              <Col sm={12} md={6}>
                <h6 className='align-middle text-center'>Preview</h6>
                <div className='m-auto d-flex justify-content-center pt-2' >
                  {(currentTime.start && currentTime.end) || overlayList.length > 0 ? <VideoPlayer overlays={overlayList} file_src={file_src} file_type={TYPE} /> : null}
                </div>
              </Col>
            </Row>
          </Container>

          <div>
            <Container fluid>
              {overlayList
                .sort((a, b) => b.orderId - a.orderId)
                .map((item, i) => {
                  return (
                    <VideoConfigItem key={i} item={item} i={i} handleDeleteDescription={handleDeleteDescription} handleInputChange={handleInputChange} onSubmitVideoContent={onSubmitVideoContent} />
                  );
                })}
            </Container>
          </div>
        </>
      )}
    </>
  );
};

export default VideoConfigurations;
