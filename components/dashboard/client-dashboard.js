import React, { useEffect } from "react";
import { Badge, Button, Card, CardBody, Col, Progress, Row, Table } from "reactstrap";
import { selectUserData } from "../../store/slice/auth.slice";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectDashboardData } from "../../store/slice/common.slice";
import { useDispatch } from "react-redux";
import { getClient, selectClient } from "../../store/slice/client.slice";

function SubscriptionCard({ data }) {
  const planName = data?.PlanName;
  const status = data?.SubscriptionPlanStatus;
  const startDate = data?.SubscriptionPlanActivatedDate;
  const endDate = data?.SubcriptionPlanEndDate;

  const now = Date.now();
  const start = startDate ? new Date(startDate).getTime() : null;
  const end = endDate ? new Date(endDate).getTime() : null;
  const daysLeft = end ? Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24))) : null;
  const totalDays = start && end ? Math.ceil((end - start) / (1000 * 60 * 60 * 24)) : null;
  const progress = totalDays && start ? Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100))) : 0;
  const isExpired = end && now > end;
  const isActive = status === "Payment Success" && !isExpired;

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const statusBadge = !planName ? (
    <Badge color="secondary">Not Assigned</Badge>
  ) : isExpired ? (
    <Badge color="danger">Expired</Badge>
  ) : isActive ? (
    <Badge color="success">Active</Badge>
  ) : (
    <Badge color="warning">{status || "Pending"}</Badge>
  );

  return (
    <Card className="mb-3">
      <CardBody>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="card-title mb-0" style={{ fontSize: 16 }}>
            <i className="ri-shield-check-line me-2" style={{ color: "#3b5bdb" }} />
            Subscription Plan
          </h5>
          {statusBadge}
        </div>

        {!planName ? (
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>
            No subscription plan has been assigned yet. Please contact your administrator.
          </p>
        ) : (
          <Row className="align-items-center">
            <Col md={3}>
              <div style={{ fontSize: 12, color: "#868e96", marginBottom: 2 }}>Plan</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1e1e2d" }}>{planName}</div>
            </Col>
            <Col md={3}>
              <div style={{ fontSize: 12, color: "#868e96", marginBottom: 2 }}>Start Date</div>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{fmt(startDate)}</div>
            </Col>
            <Col md={3}>
              <div style={{ fontSize: 12, color: "#868e96", marginBottom: 2 }}>Expiry Date</div>
              <div style={{ fontWeight: 500, fontSize: 14, color: isExpired ? "#c92a2a" : "inherit" }}>
                {fmt(endDate)}
              </div>
            </Col>
            <Col md={3}>
              <div style={{ fontSize: 12, color: "#868e96", marginBottom: 2 }}>
                {isExpired ? "Expired" : "Days Remaining"}
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: isExpired ? "#c92a2a" : daysLeft <= 30 ? "#e67700" : "#2f9e44" }}>
                {isExpired ? "Expired" : daysLeft !== null ? `${daysLeft} days` : "—"}
              </div>
            </Col>
            {totalDays && (
              <Col md={12} className="mt-3">
                <div className="d-flex justify-content-between mb-1" style={{ fontSize: 11, color: "#868e96" }}>
                  <span>Plan usage</span>
                  <span>{progress}% elapsed</span>
                </div>
                <Progress
                  value={progress}
                  color={isExpired ? "danger" : progress > 80 ? "warning" : "success"}
                  style={{ height: 6, borderRadius: 3 }}
                />
              </Col>
            )}
          </Row>
        )}
      </CardBody>
    </Card>
  );
}

const ClientDashboardComponent = () => {
  const dashboardAnalyticsData = useSelector(selectDashboardData);
  const UserData = useSelector(selectUserData);
  const count = dashboardAnalyticsData?.userCounts;
  const recentPatients = dashboardAnalyticsData?.recentPatientList;
  const dispatch = useDispatch();

  const clientData = useSelector(selectClient);
  const data = clientData[0];

  useEffect(() => {
    if (UserData?.UserID) {
      dispatch(getClient(UserData.UserID));
    }
  }, [UserData]);

  return (
    <>
      <SubscriptionCard data={data} />

      <Row>
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
      </Row>

      <Row>
        <Col lg={4}>
          <Card color='primary' className='text-white-50' style={{ background: "linear-gradient(230deg, rgba(75,90,197,1) 10%, rgba(48,63,179,1) 60%)", height: "21%" }}>
            <CardBody>
              <Row>
                <Col md={9}>
                  <h3 className='text-white'>{count?.patientAppointments}</h3>
                  <p className='text-white'>Appointments</p>
                </Col>
                <Col md={3}>
                  <Button color='primary' className='active mt-2'>
                    <i className='fa fa-clock'></i>
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {recentPatients?.length === 0 ? (
            <Card style={{ height: "74%", paddingTop: "40%" }}>
              <CardBody>
                <h4 className='text-center'>No Recent {"Patients"}</h4>
              </CardBody>
            </Card>
          ) : (
            <Card>
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
                        {/* <th>Centers</th> */}
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
            </Card>
          )}
        </Col>

        <Col lg={8}>
          <Card className='h-100'>
            <CardBody>
              <div className='d-flex inline justify-content-between'>
                <h4 style={{ paddingTop: "0.8rem", fontSize: 18 }}>Profile</h4>

                <Link href={"/my-profile"}>
                  <i className='ri-edit-2-line' style={{ color: " #6271eb", fontSize: 25 }}></i>
                </Link>
              </div>
              <div className='user_pic mx-auto mb-4' style={{ width: "7.5rem" }}>
                <img src={data?.ClientLogo} alt='' />
              </div>
              <Row>
                <Col md={6}>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Client Name :</h5>
                    <p className='m-2'>{data?.ClientName}</p>
                  </div>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Phone :</h5>
                    <p className='m-2'>{data?.Phone}</p>
                  </div>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Contact Person Name :</h5>
                    <p className='m-2'>{data?.ContactPersonName}</p>
                  </div>
                  <div>
                    <h5 className='font-size-14 mt-1'>Contact Person Email :</h5>
                    <p className='m-2'> {data?.ContactEmailId}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Email :</h5>
                    <p className='m-2'>{data?.EmailId}</p>
                  </div>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>Address :</h5>
                    <p className='mt-3 mb-1'>{data?.AddressLine1}</p>
                    <p className='mb-2'>{data?.AddressLine2}</p>
                  </div>
                  <div className='mb-4'>
                    <h5 className='font-size-14 mt-1'>GST Number :</h5>
                    <div className='m-2'>{data?.GSTNumber}</div>
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

export default ClientDashboardComponent;
