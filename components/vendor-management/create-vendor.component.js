import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import {
  selectSetModalOpenState,
  setModalOpen,
} from "../../store/slice/layout.slice";

import VendorBasicDetails from "./vendor-basic-details.component";
import VendorBillingDetails from "./vendor-billing-details.components";
import VendorContactDetails from "./vendor-contact-details.component";
import VendorDocuments from "./vendor-documents.component";

function CreateVendor() {
  const [activeTab, setActiveTab] = useState(1);

  const dispatch = useDispatch();
  const setModalOpenState = useSelector(selectSetModalOpenState);

  const tog_standard = () => {
    dispatch(setModalOpen(!setModalOpenState));
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 4) {
        setActiveTab(tab);
      }
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={tog_standard}
        color="primary"
        className="waves-effect waves-light"
      >
        Create vendor
      </Button>
      <Modal
        isOpen={setModalOpenState}
        toggle={tog_standard}
        scrollable={true}
        className="modal right app_modal"
      >
        <ModalHeader toggle={() => dispatch(setModalOpen(!setModalOpenState))}>
          Create vendor
        </ModalHeader>
        <ModalBody>
          <div id="basic-pills-wizard" className="twitter-bs-wizard">
            <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified">
              <NavItem>
                <NavLink
                  className={activeTab === 1 ? "active" : ""}
                  onClick={() => {
                    toggleTab(1);
                  }}
                >
                  <span className="step-number">01</span>
                  <span className="step-title">Basic Details</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === 2 ? "active" : ""}
                  onClick={() => {
                    toggleTab(2);
                  }}
                >
                  <span className="step-number">02</span>
                  <span className="step-title">Contact Person Details</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === 3 ? "active" : ""}
                  onClick={() => {
                    toggleTab(3);
                  }}
                >
                  <span className="step-number">03</span>
                  <span className="step-title">Documents</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === 4 ? "active" : ""}
                  onClick={() => {
                    toggleTab(4);
                  }}
                >
                  <span className="step-number">04</span>
                  <span className="step-title">Billing Details</span>
                </NavLink>
              </NavItem>
            </ul>

            <TabContent
              activeTab={activeTab}
              className="twitter-bs-wizard-tab-content"
            >
              <TabPane tabId={1}>
                <VendorBasicDetails />
              </TabPane>
              <TabPane tabId={2}>
                <VendorContactDetails />
              </TabPane>
              <TabPane tabId={3}>
                <VendorDocuments />
              </TabPane>
              <TabPane tabId={4}>
                <VendorBillingDetails />
              </TabPane>
            </TabContent>
          </div>
        </ModalBody>
        <ModalFooter>
          <ul
            className="pager wizard twitter-bs-wizard-pager-link w-100"
            style={{ listStyle: "none" }}
          >
            {activeTab !== 1 ? (
              <li className={"previous"}>
                <Button
                  type="button"
                  color="light"
                  className="btn-md m-1 waves-effect waves-light action_btn"
                  onClick={() => {
                    toggleTab(activeTab - 1);
                  }}
                >
                  Previous
                </Button>
              </li>
            ) : (
              ""
            )}
            {activeTab === 4 ? (
              <li className={"submit"}>
                <Button
                  type="button"
                  color="primary"
                  className="btn-md m-1 waves-effect waves-light action_btn"
                >
                  Submit
                </Button>
              </li>
            ) : (
              <li className={"next"}>
                <Button
                  type="button"
                  color="primary"
                  className="btn-md m-1 waves-effect waves-light action_btn"
                  onClick={() => {
                    toggleTab(activeTab + 1);
                  }}
                >
                  Next
                </Button>
              </li>
            )}
          </ul>
        </ModalFooter>
      </Modal>
    </>
  );
}
export default CreateVendor;
