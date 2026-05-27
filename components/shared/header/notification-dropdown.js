import { Fragment, useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";
// import Image from "next/image";

function NotificationDropdown() {
  const [menu, setMenu] = useState(false);

  const toggle = () => {
    setMenu(!menu);
  };

  return (
    <Fragment>
      <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block">
        <DropdownToggle
          tag="button"
          className="btn header-item noti-icon waves-effect"
          id="page-header-notifications-dropdown"
        >
          <i className="ri-notification-3-line"></i>
          <span className="noti-dot"></span>
        </DropdownToggle>
        <DropdownMenu
          className="dropdown-menu-end dropdown-menu-lg dropdown-menu-right p-0"
          aria-labelledby="page-header-notifications-dropdown"
        >
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0">Notifications </h6>
              </Col>
              <div className="col-auto">
                <a href="#" className="small">
                  View All
                </a>
              </div>
            </Row>
          </div>
          <SimpleBar style={{ maxHeight: "230px" }}>
            <a href="#" className="text-reset notification-item">
              <div className="media">
                <div className="avatar-xs me-3">
                  <span className="avatar-title bg-primary rounded-circle font-size-16">
                    <i className="ri-shopping-cart-line"></i>
                  </span>
                </div>
                <div className="media-body">
                  <h6 className="mt-0 mb-1">Notification Title One</h6>
                  <div className="font-size-12 text-muted">
                    <p className="mb-1">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                    <p className="mb-0">
                      <i className="mdi mdi-clock-outline"></i> 3 min ago
                    </p>
                  </div>
                </div>
              </div>
            </a>
            <a href="#" className="text-reset notification-item">
              <div className="media">
                <img
                  src="/images/users/avatar-3.jpg"
                  className="me-3 rounded-circle avatar-xs"
                  alt="user-pic"
                />
                {/* <Image
                  src="/images/users/avatar-3.jpg"
                  className="me-3 rounded-circle avatar-xs"
                  alt="user-pic"
                  width={32}
                  height={32}
                /> */}
                <div className="media-body">
                  <h6 className="mt-0 mb-1">Notification Title Two</h6>
                  <div className="font-size-12 text-muted">
                    <p className="mb-1">Lorem ipsum dolor sit amet.</p>
                    <p className="mb-0">
                      <i className="mdi mdi-clock-outline"></i> 1 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </a>
            <a href="#" className="text-reset notification-item">
              <div className="media">
                <div className="avatar-xs me-3">
                  <span className="avatar-title bg-success rounded-circle font-size-16">
                    <i className="ri-checkbox-circle-line"></i>
                  </span>
                </div>
                <div className="media-body">
                  <h6 className="mt-0 mb-1">Notification Title Three</h6>
                  <div className="font-size-12 text-muted">
                    <p className="mb-1">
                      Lorem ipsum dolor sit amet, consectetur.
                    </p>
                    <p className="mb-0">
                      <i className="mdi mdi-clock-outline"></i> 3 min ago
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </SimpleBar>
          <div className="p-2 border-top">
            <a
              href="#"
              className="btn btn-sm btn-link font-size-14 btn-block text-center"
            >
              <i className="mdi mdi-arrow-right-circle me-1"></i>
              View More
            </a>
          </div>
        </DropdownMenu>
      </Dropdown>
    </Fragment>
  );
}
export default NotificationDropdown;
