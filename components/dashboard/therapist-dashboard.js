import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import { selectDashboardData } from "../../store/slice/common.slice";
import { selectUserData } from "../../store/slice/auth.slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getTherapist, selectTherapist } from "../../store/slice/therapist.slice";

const TherapistDashboardComponent = () => {
  const dispatch = useDispatch();
  const dashboardAnalyticsData = useSelector(selectDashboardData);
  const count = dashboardAnalyticsData?.userCounts;
  const UserData = useSelector(selectUserData);
  const data = useSelector(selectTherapist)
  data = data[0]
  useEffect(() => {
    dispatch(getTherapist(UserData.UserID));
  }, [UserData]);

  return (
    <>
      <Row>
        <Col lg={4}>
          <Link href={"/patients"}>
            <Card color='warning' className='text-white-50' style={{ background: "linear-gradient(230deg, rgba(251,201,123,1) 10%, rgba(195,135,6,1) 50%)", height: "35vh" }}>
              <CardBody className='d-flex align-items-center justify-content-between px-5'>
                <div>
                  <h3 className='text-white'>{count?.patients}</h3>
                  <p className='text-white'>Patients</p>
                </div>
                <div>
                  <Button color='warning' className='active' style={{ background: "#c38706" }}>
                    <i className='ri-user-heart-line'></i>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Link>
          <Link href={"/appointments"}>
            <Card color='primary' className='text-white-50' style={{ background: "linear-gradient(230deg, rgba(75,90,197,1) 10%, rgba(48,63,179,1) 60%)", height: "35vh" }}>
              <CardBody className='d-flex align-items-center justify-content-between px-5'>
                <div>
                  <h3 className='text-white'>{count?.patientAppointments}</h3>
                  <p className='text-white'>Appointments</p>
                </div>
                <div>
                  <Button color='primary' className='active'>
                    <i className='fa fa-clock'></i>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Link>
        </Col>
        <Col lg={8}>
          <Card>
            <CardBody>
              <div className='d-flex inline justify-content-between'>
                <h4 style={{ paddingTop: "0.5rem", fontSize: 18 }}>Profile</h4>
                <Link href={"/my-profile"}>
                  <i className='ri-edit-2-line' style={{ color: "#6271eb", fontSize: 25 }}></i>
                </Link>
              </div>
              <div className='user_pic mx-auto mb-4' style={{ backgroundColor: "#74788d" }}>
                <img src={data?.Photo} alt='' />
              </div>
              <Row>
                <Col md={4} className='px-5'>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Name :</h5>
                    <p className=''> {data?.Name}</p>
                  </div>
                  <div className='mb-4'>
                    <h5 className='font-size-14'>Address :</h5>
                    <p className='mt-3 mb-0'> {data?.AddressLine1}</p>
                    <p className='mt-3 mb-0'> {data?.AddressLine2}</p>
                  </div>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>UserName :</h5>
                    <p className=''>{data?.UserName}</p>
                  </div>
                  <div>
                    <h5 className='font-size-14 mt-1'>TherapistType :</h5>
                    <p className=' mb-0'>{data?.TherapistType}</p>
                  </div>
                </Col>
                <Col md={4} className='px-5'>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Email :</h5>
                    <p className=''> {data?.EmailId}</p>
                  </div>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Designation :</h5>
                    <p className=''>{data?.Designation}</p>
                  </div>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Qualification :</h5>
                    <div className=''>{data?.Qualification}</div>
                  </div>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Center :</h5>
                    <div className=''>{data?.CenterName}</div>
                  </div>
                </Col>
                <Col md={4} className='px-5'>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Phone :</h5>
                    <p className=''>{data?.Phone}</p>
                  </div>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Language :</h5>
                    <p className=''>{data?.Language}</p>
                  </div>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Experience :</h5>
                    <div className=''>{data?.Experience}</div>
                  </div>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Department :</h5>
                    <div className=''>{data?.DepartmentName}</div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TherapistDashboardComponent;
