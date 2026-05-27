import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { Button, Card, CardBody, CardTitle, Col, Row, Table } from "reactstrap";
import { selectDashboardData } from "../../store/slice/common.slice";
import Dountchart from "./donut-chart.component";
import { RevenueChart } from "./revenue.component";

const DashboardComponent = () => {
  const dashboardAnalyticsData = useSelector(selectDashboardData);
  const count = dashboardAnalyticsData?.userCounts;
  const recentClients = dashboardAnalyticsData?.recentClientList;
  const dateLabel = dashboardAnalyticsData?.monthlyPaymentReport?.map((item) => {
    const dateParts = item.Date.split("/");
    const monthIndex = parseInt(dateParts[1]) - 1;
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[monthIndex];
    return monthName;
  });
  const amountData = dashboardAnalyticsData?.monthlyPaymentReport?.map((item) => item.Amount);

  return (
    <>
      <Row>
        <Col lg={4}>
          <Link href={"/clients"}>
            <Card
              color='success'
              className='text-white-50 h-80'
              style={{
                background: "linear-gradient(230deg,  rgba(61,192,154,1) 10%,  rgba(37,129,108,1) 50%)",
              }}>
              <CardBody className='d-flex align-items-center justify-content-between px-5'>
                <div>
                  <h3 className='text-white'>{count?.clients}</h3>
                  <p className='text-white'>Clients</p>
                </div>
                <div>
                  <Button color='success' className='active' style={{ background: "#106c51" }}>
                    <i className='ri-group-line'></i>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Link>
        </Col>

        <Col lg={4}>
          <Link href={"/centers"}>
            <Card color='info' className='text-white-50 h-80' style={{ background: " linear-gradient(230deg,  rgba(160,109,232,1) 10%,  rgba(104,29,210,1) 50%)" }}>
              <CardBody className='d-flex align-items-center justify-content-between px-5'>
                <div>
                  <h3 className='text-white'>{count?.centers}</h3>
                  <p className='text-white'>Centers</p>
                </div>
                <div>
                  <Button className='btn active' style={{ background: "#4e0dab", borderColor: "#4e0dab" }}>
                    <i className='ri-building-line'></i>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Link>
        </Col>
        <Col lg={4}>
          <Card style={{ position: "relative" }}>
            <CardBody>
              <CardTitle className='my-0'>Mobile App Downloads</CardTitle>
              <div id='overlay'>
                <div id='text'>Coming soon</div>
              </div>
              <Row>
                <Col md={6}>
                  <Row>
                    <Col md={4}>
                      <Button color='light' className='btn-rounded waves-effect mt-1'>
                        <i className='ri-android-line' style={{ color: "#5664d2" }}></i>
                      </Button>
                    </Col>
                    <Col md={8}>
                      <p className='mb-0'>
                        <small>Android</small>
                      </p>
                      <h4 className='mb-0'>1024</h4>
                    </Col>
                  </Row>
                </Col>
                <Col md={6}>
                  <Row>
                    <Col md={4}>
                      <Button color='light' className='btn-rounded waves-effect mt-1'>
                        <i className='ri-apple-line' style={{ color: "#d93452" }}></i>
                      </Button>
                    </Col>
                    <Col md={8}>
                      <p className='mb-0'>
                        <small>iOS</small>
                      </p>
                      <h4 className='mb-0'>921</h4>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
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
        <Col md={2}>
          <Card>
            <div id='overlay'>
              <div id='text'>Coming soon</div>
            </div>
            <CardBody className='p-2'>
              <Button color='success' size='sm' className='waves-effect my-1'>
                <i className='ri-shield-user-line'></i>
              </Button>
              <h4 className='my-1'>324</h4>
              <p className='mb-0'>
                <small>Total Vendors</small>
              </p>
            </CardBody>
          </Card>
        </Col>
        <Col md={2}>
          <Card>
            <CardBody className='p-2'>
              <Button color='primary' size='sm' className='my-1'>
                <i className='ri-user-settings-line'></i>
              </Button>
              <h4 className='my-1'>{count?.clients + count?.centers + count?.therapists + count?.patients}</h4>
              <p className='mb-0'>
                <small>Total Users</small>
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card className='h-100'>
            <CardBody>
              <div className='d-flex justify-content-between mb-1'>
                <h4 className='card-title' style={{ paddingTop: "0.75rem" }}>
                  Recent Clients
                </h4>
                <Link href={"/clients"} className='btn btn-link waves-effect me-1'>
                  View All
                </Link>
              </div>

              <div className='table-responsive'>
                <Table className='mb-0'>
                  <thead>
                    <tr>
                      <th>Client Name</th>
                      <th>Client ID</th>
                      <th>Centers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentClients &&
                      recentClients.map((clientItem, key) => {
                        return (
                          <tr key={key}>
                            <td className='d-flex'>
                              <h6>{clientItem.ClientName}</h6>
                            </td>
                            <td>{clientItem.ClientID}</td>
                            <td>{clientItem.CentersCount}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className='h-100'>
            <CardBody>
              <h4 className='card-title'>Payment Report</h4>
              <RevenueChart title='Amount' xAxis={dateLabel} yAxis={amountData} />
            </CardBody>
          </Card>
        </Col>
        <Col lg={4}>
          <Link href={"/appointments"}>
            <Card color='primary' className='text-white-50' style={{ background: "linear-gradient(230deg, rgba(75,90,197,1) 10%, rgba(48,63,179,1) 60%)" }}>
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
            </Card></Link>
          <Card style={{ height: "68%" }}>
            <CardBody>
              <CardTitle className='mb-4'>Patient Category</CardTitle>
              <Dountchart count={count} graphHeight={"225"} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardComponent;
