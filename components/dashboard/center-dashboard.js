import Link from "next/link";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Card, CardBody, Col, Row, Table } from "reactstrap";
import { selectDashboardData } from "../../store/slice/common.slice";
import { useDispatch } from "react-redux";
import { selectUserData } from "../../store/slice/auth.slice";
import { CenterDetails, CenterDetailsLoading, SelectCenter } from "../../store/slice/center.slice";

const CenterDashboardComponent = () => {
  const dashboardAnalyticsData = useSelector(selectDashboardData);
  const count = dashboardAnalyticsData?.userCounts;
  const recentPatients = dashboardAnalyticsData?.recentPatientList;
  const UserData = useSelector(selectUserData);
  const dispatch = useDispatch();

  const data = useSelector(CenterDetails)

  useEffect(() => {
    dispatch(SelectCenter(UserData.UserID));
  }, [UserData, dispatch]);



  return (
    <>
      <Row>
        <Col lg={4}>
          <Link href={"/therapist"}>
            <Card color='danger' className='text-white-50 h-80' style={{ background: "linear-gradient(230deg, rgba(243,91,155,1) 10%,  rgba(209,31,88,1) 50%)" }}>
              <CardBody className='d-flex align-items-center justify-content-between px-5'>
                <div>
                  <h3 className='text-white'>{count?.therapists}</h3>
                  <p className='text-white'>Therapists</p>
                </div>
                <div>
                  <Button color='danger' className='active' style={{ background: "#a70e3f", borderColor: "#a70e3f" }}>
                    <i className='mdi mdi-doctor'></i>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Link>
        </Col>
        <Col lg={4}>
          <Link href={"/patients"}>
            <Card color='warning' className='text-white-50 h-80' style={{ background: "linear-gradient(230deg, rgba(251,201,123,1) 10%, rgba(195,135,6,1) 50%)" }}>
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
        </Col>
        <Col lg={4}>
          <Link href={"/appointments"}>
            <Card color='primary' className='text-white-50' style={{ background: "linear-gradient(230deg, rgba(75,90,197,1) 10%, rgba(48,63,179,1) 60%)" }}>
              <CardBody>
                <Row>
                  <Col md={9}>
                    <h3 className='text-white'>{count?.patientAppointments}</h3>
                    <p className='text-white'>Appointments</p>
                  </Col>
                  <Col md={3}>
                    <Button color='primary' className='active'>
                      <i className='fa fa-clock'></i>
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Link>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card className='h-100'>
            {recentPatients?.length === 0 ? (
              <CardBody>
                <h4 className='text-center' style={{ paddingTop: "55%" }}>
                  No Recent {"Patients"}
                </h4>
              </CardBody>
            ) : (
              <CardBody>
                <div className='d-flex justify-content-between mb-1'>
                  <h4 className='card-title' style={{ paddingTop: "0.75rem" }}>
                    Recent Patients
                  </h4>
                  <Link href={"/patients"} className='btn btn-link waves-effect me-1'>
                    View All
                  </Link>
                </div>

                <div className='table-responsive'>
                  <Table className='mb-0'>
                    <thead>
                      <tr>
                        <th>Patient Name</th>
                        <th>Patient ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPatients &&
                        recentPatients.map((Item, key) => {
                          return (
                            <tr key={key}>
                              <td className='d-flex'>
                                <h6>{Item.PatientName}</h6>
                              </td>
                              <td>{Item.PatientID}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            )}
          </Card>
        </Col>

        <Col lg={8}>
          <Card className='h-100'>
            <CardBody>
              <div className='d-flex inline justify-content-between'>
                <h4 style={{ paddingTop: "0.5rem", fontSize: 18 }}>Profile</h4>

                <Link href={"/my-profile"}>
                  <i className='ri-edit-2-line' style={{ color: " #6271eb", fontSize: 25 }}></i>
                </Link>
              </div>
              {/* <div className='user_pic mx-auto mb-4' style={{ width: "7.5rem" }}>
                <img src={"https://media.licdn.com/dms/image/C4E0BAQFkjzjZsC_iew/company-logo_200_200/0/1594828432617?e=2147483647&v=beta&t=P7d094XXh92_ipkBKLgM9_k2XBI8TE6qFBFaAbVOS28"} alt='' />
              </div> */}

              <Row>
                <Col md={4} className='px-5'>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Center Name :</h5>
                    <p className='m-2'>{data?.CenterName}</p>
                  </div>
                  <div className='mb-4'>
                    <h5 className='font-size-14'>Address :</h5>
                    <p className='mt-3 m-2 mb-0'> {data?.AddressLine1} </p>
                    <p className='mt-3 m-2 mb-0'> {data?.AddressLine2} </p>
                  </div>

                  <div>
                    <h5 className='font-size-14 mt-1'>Center Head Name :</h5>
                    <p className='m-2 mb-0'>{data?.CenterHeadName}</p>
                  </div>
                </Col>
                <Col md={4} className='px-5'>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Email :</h5>
                    <p className='m-2'>{data?.EmailId}</p>
                  </div>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Country :</h5>
                    <p className='m-2'>{data?.Country}</p>
                  </div>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>District :</h5>
                    <div className='m-2'>{data?.District}</div>
                  </div>
                </Col>
                <Col md={4} className='px-5'>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Phone :</h5>
                    <p className='m-2'>{data?.Phone}</p>
                  </div>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>State :</h5>
                    <p className='m-2'>{data?.State}</p>
                  </div>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Pincode :</h5>
                    <div className='m-2'>{data?.Pincode}</div>
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

export default CenterDashboardComponent;
