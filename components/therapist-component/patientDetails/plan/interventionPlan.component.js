import "@asseinfo/react-kanban/dist/styles.css";
import dynamic from "next/dynamic";
const Board = dynamic(() => import("@asseinfo/react-kanban"), {
  ssr: false,
});

import { useState } from "react";
import { Badge, Button, Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from "reactstrap";
import PreviousPlan from "./previousPlan.component";

const InterventionPlan = () => {
  const [isActive, setIsActive] = useState(false);
  const toggle_col = () => {
    setIsActive(!isActive);
  };
  const content = {
    columns: [
      {
        id: 1,
        title: "Todo",
        columnsubtitle: "2 Tasks",
        cards: [
          {
            id: 11,
            content: {
              id: "#NZ1220",
              title: "Admin layout design",
              subtitle: "Sed ut perspiciatis unde",
              date: "14 Oct, 2019",
              progressValue: 75,
              team: [
                { id: 1, name: "joseph", img: "Null" },
                { id: 2, name: "joseph", img: "Null" },
              ],
            },
          },
          {
            id: 12,
            content: {
              id: "#NZ1219",
              title: "Dashboard UI",
              subtitle: "Neque porro quisquam est",
              date: " 15 Apr, 2020",
              progressValue: 50,
              team: [{ id: 3, name: "Misty", img: "Null" }],
            },
          },
          {
            id: 13,
            content: {
              id: "#NZ1218",
              title: "Admin layout design",
              subtitle: "Itaque earum rerum hic",
              date: "12 Apr, 2020",
              progressValue: 65,
              team: [
                { id: 4, name: "joseph", img: "Null" },
                { id: 5, name: "Jenice Bliss", img: "Null" },
                { id: 6, name: "John", img: "Null" },
              ],
            },
          },
        ],
      },
      {
        id: 2,
        title: "In Progress",
        columnsubtitle: "3 Tasks",
        cards: [
          {
            id: 21,
            content: {
              id: "#NZ1217",
              title: "Dashboard UI",
              subtitle: "",
              date: "05 Apr, 2020",
              progressValue: 45,
              team: [
                { id: 7, name: "joseph", img: "Null" },
                { id: 8, name: "Edward", img: "Null" },
                { id: 9, name: "John", img: "Null" },
              ],
            },
          },
          {
            id: 22,
            content: {
              id: "#NZ1216",
              title: "Authentication pages",
              subtitle: "",
              date: "02 Apr, 2020",
              progressValue: 80,
              team: [
                { id: 10, name: "joseph", img: "Null" },
                { id: 11, name: "John", img: "Null" },
              ],
            },
          },
        ],
      },
      {
        id: 3,
        title: "In Review",
        columnsubtitle: "3 Tasks",
        cards: [
          {
            id: 23,
            content: {
              id: "#NZ1215",
              title: "UI Element Pages",
              subtitle: "Itaque earum rerum hic",
              date: "28 Mar, 2020",
              progressValue: 85,
              team: [{ id: 12, name: "Amver", img: "Null" }],
            },
          },
        ],
      },
      {
        id: 4,
        title: "Completed",
        columnsubtitle: "4 Tasks",
        cards: [
          {
            id: 31,
            content: {
              id: "#NZ1214",
              title: "Brand logo design",
              subtitle: "Aenean leo ligula, porttitor eu",
              date: "24 Mar, 2020",
              progressValue: 80,
              team: [{ id: 13, name: "Karen", img: "Null" }],
            },
          },
          {
            id: 32,
            content: {
              id: "#NZ1218",
              title: "Email pages",
              subtitle: "It will be as simple as Occidental",
              date: "20 Mar, 2020",
              progressValue: 77,
              team: [
                { id: 15, name: "Ricky", img: "Null" },
                { id: 16, name: "John", img: "Null" },
              ],
            },
          },
          {
            id: 33,
            content: {
              id: "#NZ1212",
              title: "Forms pages",
              subtitle: "Donec quam felis, ultricies nec",
              date: "14 Mar, 2020",
              progressValue: 40,
              team: [
                { id: 17, name: "joseph", img: "Null" },
                { id: 18, name: "John", img: "Null" },
              ],
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Row className='m-2'>
        <Col md='6'>
          <h5>Intervention Plan</h5>
        </Col>
        <Col md='6'>
          <div className='float-right'>
            <PreviousPlan />
            <Button color='primary' className='waves-effect waves-light ml-2'>
              End Plan
            </Button>
          </div>
        </Col>
      </Row>

      <Row className='mb-4'>
        <Col lg={12}>
          <Board
            initialBoard={content}
            renderColumnHeader={({ title, columnsubtitle }) => (
              <CardBody>
                <UncontrolledDropdown className='float-end'>
                  <DropdownToggle tag='i' style={{ cursor: "pointer" }} className='arrow-none'>
                    <i className='mdi mdi-dots-vertical m-0 text-muted font-size-20'></i>
                  </DropdownToggle>
                  <DropdownMenu className='dropdown-menu-end'>
                    <DropdownItem>Edit</DropdownItem>
                    <DropdownItem>Delete</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <h4 className='card-title'>{title}</h4>
                {/* <p className='mb-0'>{columnsubtitle}</p> */}
              </CardBody>
            )}
            renderCard={({ content }, { dragging }) => (
              <Card className='task-box'>
                <CardBody className='borad-width'>
                  <div>
                    <h5 className='font-size-16'>
                      <a onClick={toggle_col} id={`${content["title"]}`} className='text-dark'>
                        <span>{content["title"]}</span>
                      </a>
                    </h5>
                    {content["subtitle"] !== "" ? (
                      <CardBody>
                        <p className='mb-4'>{content["subtitle"]}</p>
                      </CardBody>
                    ) : null}
                  </div>

                  <div className='float-start'>
                    <div>
                      <span className='text-danger m-1 align-middle'>
                        <i className='ri ri-calendar-2-line '></i>
                      </span>
                      {content["date"]}
                    </div>
                  </div>
                  <div className='float-right'>
                    <Badge className='badge-soft-primary rounded-pill mr-1'>ABA</Badge>
                    <Badge className='badge-soft-secondary rounded-pill '>
                      <i className='ri  ri-chat-1-line m-1 align-middle'></i>3
                    </Badge>
                  </div>
                </CardBody>
              </Card>
            )}
          />
        </Col>
      </Row>
    </>
  );
};

export default InterventionPlan;
