import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { selectSetModalOpenState, setModalOpen } from "../../../store/slice/layout.slice";
import CenterValidation from "./center-validation";

import { Formik } from "formik";
import { useEffect, useState } from "react";
import { selectRoleBasedModules } from "../../../store/slice/auth.slice";
import { createCenter } from "../../../store/slice/center.slice";
import { getAllCountries } from "../../../store/slice/common.slice";
import CloseSweetAlert from "../../shared/close-sweetalert";
import CenterDetails from "./center-details.component";
import CenterHeadDetails from "./center-head-details.component";
function AddCenter() {
  const [activeTab, setActiveTab] = useState(1);

  const dispatch = useDispatch();
  const setModalOpenState = useSelector(selectSetModalOpenState);
  const roleBasedModules = useSelector(selectRoleBasedModules);
  const isClientManagementAvailable = roleBasedModules?.some((module) => module.ModuleName === "ClientManagement");
  useEffect(() => {
    dispatch(getAllCountries());
  }, []);

  const tog_standard = () => {
    dispatch(setModalOpen(!setModalOpenState));
  };
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 2) {
        setActiveTab(tab);
      }
    }
  };

  const onSubmit = async (values, actions) => {
    if (activeTab === 2) {
      await dispatch(
        createCenter({
          ...values,
          Phone: values.Phone.replace("+", ""),
          CenterHeadPhone: values.CenterHeadPhone.replace("+", ""),
          UserName: values.EmailId,
        })
      );
    } else {
      toggleTab(activeTab + 1);
      actions.setSubmitting(false);
    }
  };
  const NavArr = ["Center Details", "Center Head Details"];

  // close modal alert

  const [isAlertOpen, setIsAlertOpen] = useState(false);
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
        Add Center
      </Button>
      <Formik
        initialValues={{
          EmailId: "",
          UserName: "",
          Phone: "",
          AddressLine1: "",
          AddressLine2: "",
          City: "",
          District: "",
          Pincode: "",
          State: "",
          Country: "",
          Password: "",
          ConfirmPassword: "",
          ClientID: 0,
          CenterName: "",
          CenterType: "",
          CenterHeadSalutation: "",
          CenterHeadName: "",
          CenterHeadDesignation: "",
          CenterHeadEmailId: "",
          CenterHeadPhone: "",
        }}
        validationSchema={CenterValidation(activeTab, isClientManagementAvailable)}
        onSubmit={onSubmit}
        enableReinitialize={true}>
        {({ handleSubmit, isValid, touched, validateForm, resetForm, isSubmitting, dirty }) => (
          <Modal
            isOpen={setModalOpenState}
            toggle={() => {
              setIsAlertOpen(true);
            }}
            scrollable={true}
            className='modal right app_modal'
            onClosed={() => {
              setActiveTab(1);
              resetForm();
            }}>
            {isAlertOpen ? <CloseSweetAlert onConfirm={onHandleCloseConfirm} onClose={onCloseAlert} /> : null}

            <ModalHeader
              toggle={() => {
                setIsAlertOpen(true);
              }}>
              Create Center
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
                    <CenterDetails activeTab={activeTab} />
                  </TabPane>
                  <TabPane tabId={2}>
                    <CenterHeadDetails activeTab={activeTab} />
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
                ) : (
                  ""
                )}
                {activeTab === 2 ? (
                  <li className={"submit"}>
                    <Button type='button' color='primary' className='btn-md m-1 waves-effect waves-light action_btn' onClick={handleSubmit} disabled={isSubmitting}>
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

export default AddCenter;
