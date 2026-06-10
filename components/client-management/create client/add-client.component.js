import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { clientCreation } from "../../../store/slice/client.slice";
import { getAllCountries } from "../../../store/slice/common.slice";
import { selectSetModalOpenState, setModalOpen } from "../../../store/slice/layout.slice";
import { getAllSubscriptionPlans } from "../../../store/slice/subscription.slice";
import { renderValidation } from "../client-validation.component";
import BasicDetails from "./basic-details.component";
import BillingDetails from "./billing-details.component";
import ContactPersonDetails from "./contact-person-details.component";
import Documents from "./documents.component";

import CloseSweetAlert from "../../shared/close-sweetalert";

/**
 * Component for add a new client.
 */

function AddClient() {
  const InitValues = {
    ClientName: "",
    EmailId: "",
    UserName: "",
    Phone: "",
    Password: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    Pincode: "",
    State: "",
    Country: "",
    ClientLogo: "",
    WebsiteURL: "",
    ClientType: "",
    OrganizationType: "",
    ContactPersonName: "",
    ContactPersonDesignation: "",
    ContactEmailId: "",
    IncorporationCertificateURL: "",
    RegistrationCertificateURL: "",
    SubscriptionPlanId: "",
    SubscriptionPlanStatus: "",
    PaymentId: "",
    BillingAddressLine1: "",
    BillingAddressLine2: "",
    BillingCity: "",
    BillingDistrict: "",
    BillingPincode: "",
    BillingState: "",
    BillingCountry: "",
    GSTNumber: "",
    Bank: "",
    BankAccountNumber: "",
    Branch: "",
    IFSCCode: "",
  };

  const [activeTab, setActiveTab] = useState(1);
  const dispatch = useDispatch();
  const setModalOpenState = useSelector(selectSetModalOpenState);
  const NavArr = ["Basic Details", "Contact Person Details", "Documents", "Billing Details"];

  useEffect(() => {
    dispatch(getAllCountries());
    dispatch(getAllSubscriptionPlans());
  }, []);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const tog_standard = () => {
    dispatch(setModalOpen(!setModalOpenState));
    setActiveTab(1);
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 4) {
        setActiveTab(tab);
      }
    }
  };

  /**
   * add a new client
   * @param   {object} values client details
   */

  const onSubmit = async (values) => {
    if (activeTab === 4) {
      const payload = { ...values };
      if (!payload.IncorporationCertificateURL) delete payload.IncorporationCertificateURL;
      if (!payload.RegistrationCertificateURL) delete payload.RegistrationCertificateURL;
      await dispatch(clientCreation(payload));
    } else {
      toggleTab(activeTab + 1);
    }
  };

  const onHandleCloseConfirm = async () => {
    setIsAlertOpen(false);
    tog_standard();
  };
  const onCloseAlert = () => {
    setIsAlertOpen(false);
  };

  return (
    <>
      <Button type='button' onClick={tog_standard} color='primary' className='waves-effect waves-light'>
        Add Client
      </Button>
      <Formik initialValues={InitValues} validationSchema={renderValidation(activeTab)} onSubmit={onSubmit}>
        {({ handleSubmit, isSubmitting, validateForm, resetForm }) => (
          <Modal
            isOpen={setModalOpenState}
            toggle={() => {
              setIsAlertOpen(true);
            }}
            scrollable={true}
            className='modal right app_modal'
            onClosed={() => {
              resetForm();
            }}>
            {isAlertOpen ? <CloseSweetAlert onConfirm={onHandleCloseConfirm} onClose={onCloseAlert} /> : null}

            <ModalHeader
              toggle={() => {
                setIsAlertOpen(true);
              }}>
              Add Client
            </ModalHeader>
            <ModalBody>
              <div id='basic-pills-wizard' className='twitter-bs-wizard'>
                <ul className='twitter-bs-wizard-nav nav nav-pills nav-justified'>
                  {NavArr.map((element, key) => {
                    return (
                      <NavItem key={key}>
                        <NavLink
                          className={activeTab === key + 1 ? "active" : ""}
                          onClick={() => {
                            key + 1 < activeTab
                              ? toggleTab(key + 1)
                              : validateForm().then((result) => {
                                  Object.keys(result).length === 0 && activeTab + 1 === key + 1 ? toggleTab(key + 1) : null;
                                });
                          }}>
                          <span className='step-number'>0{key + 1}</span>
                          <span className='step-title'>{element}</span>
                        </NavLink>
                      </NavItem>
                    );
                  })}
                </ul>

                <TabContent activeTab={activeTab} className='twitter-bs-wizard-tab-content'>
                  <TabPane tabId={1}>
                    <BasicDetails />
                  </TabPane>
                  <TabPane tabId={2}>
                    <ContactPersonDetails />
                  </TabPane>
                  <TabPane tabId={3}>
                    <Documents />
                  </TabPane>
                  <TabPane tabId={4}>
                    <BillingDetails />
                  </TabPane>
                </TabContent>
              </div>
            </ModalBody>
            <ModalFooter>
              <ul className='pager wizard twitter-bs-wizard-pager-link w-100' style={{ listStyle: "none" }}>
                {activeTab !== 1 ? (
                  <li className={"previous"}>
                    <Button
                      type='button'
                      color='light'
                      className='btn-md m-1 waves-effect waves-light action_btn'
                      onClick={() => {
                        toggleTab(activeTab - 1);
                      }}>
                      Previous
                    </Button>
                  </li>
                ) : null}
                {activeTab === 4 ? (
                  <li className={"submit"}>
                    <Button type='button' color='primary' className='btn-md m-1 waves-effect waves-light action_btn' disabled={isSubmitting} onClick={handleSubmit}>
                      Submit
                    </Button>
                  </li>
                ) : (
                  <li className={"next"}>
                    <Button type='button' color='primary' className='btn-md m-1 waves-effect waves-light action_btn' onClick={handleSubmit}>
                      Next
                    </Button>
                  </li>
                )}
              </ul>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
}
export default AddClient;
