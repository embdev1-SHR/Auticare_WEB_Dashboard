import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Button, Card, CardBody, Col, Label, Row } from "reactstrap";
import { DetailsSessionListData } from "../../../../../store/slice/patient.slice";
import { GetContentMediaData, selectContentMediaList } from "../../../../../store/slice/content.slice";
import moment from "moment";
import Configurations from "../../../../../components/patient-management/view-patient/home-session/configurations.component";
import { useDispatch } from "react-redux";
import TextConfig from "../../../../patient-management/view-patient/session/textConfig.component";
import { MBDataCreator } from "./MBDataCreator";

const SessionDetails = () => {
  const dispatch = useDispatch();
  function createFormatDate(date) {
    return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
  }
  const data = useSelector(DetailsSessionListData);

  useEffect(() => {
    dispatch(GetContentMediaData(data[0]?.ContentID));
  }, [data]);

  const ContentMediaData = useSelector(selectContentMediaList);
  const ContentMediaDataList = ContentMediaData?.filter((media) => media.Status == 1);
  const childComponent1 = useMemo(() => <Configurations url={data[0]?.FileUploadURL} type={data[0]?.ContentCategory} list={ContentMediaDataList} />, [data, ContentMediaData]);
  const childComponent2 = useMemo(() => <MBDataCreator />, []);

  return (
    <>
      <Card color='light'>
        <CardBody>
          <Row>
            <Col md={6}>
              <Label className='form-label text-secondary'>Session Name</Label>
              <h6 className='mb-3'>{data[0]?.SessionName}</h6>
            </Col>
            <Col md={6}>
              <Label className='form-label text-secondary'>Session Date</Label>
              <h6 className='mb-3'>{createFormatDate(data[0]?.SessionDate)}</h6>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Label className='form-label text-secondary'>Session Type</Label>
              <h6 className='mb-3'>{data[0]?.ContentCategory}</h6>
            </Col>
            <Col md={6}>
              <Label className='form-label text-secondary'>Activity Name</Label>
              <h6 className='mb-3'>{data[0]?.ContentActivityName}</h6>
            </Col>
          </Row>
        </CardBody>
      </Card>
      {data[0]?.ContentCategory == "VR" ? <div className='text-center my-5'>
        <a href={`AuticareVRConsole:?param1=${data[0].SessionID}`}>
          <Button color='danger' size='lg' className='waves-effect waves-light' outline>
            <i className='ri-tape-line align-middle ms-2'></i> Start VR
          </Button></a>
      </div> : data[0]?.ContentCategory == "Text" ? <div className="mb-4" style={{ paddingTop: "1%", paddingLeft: "40%" }}>
        <TextConfig value={data[0]?.ContentDescription} label={"Content Description"} />
      </div> : <>
        <div className="row">
          <div className="col-8">
            {childComponent1}
          </div>
          {childComponent2}
        </div>
      </>
      }
    </>
  );
};

export default SessionDetails;
