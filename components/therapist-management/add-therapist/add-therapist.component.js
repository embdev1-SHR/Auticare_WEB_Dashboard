import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { selectRoleBasedModules, selectUserData } from "../../../store/slice/auth.slice";
import { fetchAllCenters } from "../../../store/slice/center.slice";
import { getAllCountries } from "../../../store/slice/common.slice";
import { selectSetModalOpenState, setModalOpen } from "../../../store/slice/layout.slice";
import { selectLoading, selectTherapistList, therapistCreation } from "../../../store/slice/therapist.slice";
import CloseSweetAlert from "../../shared/close-sweetalert";
import { therapistValidation } from "../therapist-validation";
import TherapistBasicDetails from "./therapist-basic-details.component";
import TherapistDocuments from "./therapist-documents.component";
import TherapistJobDetails from "./therapist-job-details.component";
import { ToastNotification } from "../../shared/toast";

function AddTherapist() {
  const [activeTab, setActiveTab] = useState(1);
  const dispatch = useDispatch();
  const setModalOpenState = useSelector(selectSetModalOpenState);
  const TherapistList = useSelector(selectTherapistList);
  const TherapistStatus = TherapistList.filter((e) => e.Status == 1);
  const UserData = useSelector(selectUserData);

  console.log("TherapistList", TherapistList);
  const roleBasedModules = useSelector(selectRoleBasedModules);
  const IsLoading = useSelector(selectLoading);
  useEffect(() => {
    dispatch(getAllCountries());
    dispatch(fetchAllCenters());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const initValues = {
    EmailId: "",
    Phone: "",
    UserName: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    District: "",
    Pincode: "",
    State: "",
    Country: "",
    Password: "",
    ConfirmPassword: "",
    CenterID: 0,
    DepartmentID: "",
    Salutation: "",
    Name: "",
    Designation: "",
    Language: "",
    Photo: "",
    // Photo: "1671538695892hospital.jpg",
    Qualification: "",
    Experience: "",
    Profile: "",
    // DocumentsURL: "1671539003607dummy.pdf",
    DocumentsURL: "",
    TherapistType: "",
    FacilitatorType: "",
  };
  const isCenterManagementAvailable = roleBasedModules?.some((module) => module.ModuleName === "CenterManagement");
  const tog_standard = () => {
    const plan = UserData.SubscriptionPlan?.[0];
    if (UserData.RoleName !== "SuperAdmin" && plan?.NumberofTherapists != null) {
      if (TherapistStatus.length >= plan.NumberofTherapists) {
        ToastNotification("error", "The number of therapists allowed in the subscription plan is already created");
        return;
      }
    }
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

  const onSubmit = (values, actions) => {

    if (activeTab === 3) {
      dispatch(therapistCreation(values));
      actions.setSubmitting(false);
    } else {
      toggleTab(activeTab + 1);
      actions.setSubmitting(false);
    }
  };
  const NavigationArray = ["Basic Details", "Profile & Documents", "Job Details"];

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
        Add Therapist
      </Button>

      <Formik initialValues={initValues} validationSchema={therapistValidation(activeTab, isCenterManagementAvailable)} onSubmit={onSubmit}>
        {({ handleSubmit, validateForm, resetForm, isSubmitting }) => (
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
              Add Therapist
            </ModalHeader>
            <ModalBody>
              <div id='basic-pills-wizard' className='twitter-bs-wizard'>
                <ul className='twitter-bs-wizard-nav nav nav-pills nav-justified'>
                  {NavigationArray.map((element, key) => {
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
                    <TherapistBasicDetails />
                  </TabPane>
                  <TabPane tabId={2}>
                    <TherapistDocuments />
                  </TabPane>
                  <TabPane tabId={3}>
                    <TherapistJobDetails />
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
                {activeTab === 3 ? (
                  <li className={"submit"}>
                    <Button type='button' color='primary' className='btn-md m-1 waves-effect waves-light action_btn' disabled={IsLoading} onClick={handleSubmit}>
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
export default AddTherapist;
