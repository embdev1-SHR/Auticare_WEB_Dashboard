import { Formik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
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
import { selectRoleBasedModules, selectUserData } from "../../../store/slice/auth.slice";
import { getAllCountries } from "../../../store/slice/common.slice";
import {
  selectSetModalOpenState,
  setModalOpen,
} from "../../../store/slice/layout.slice";
import { createPatient } from "../../../store/slice/patient.slice";
import CloseSweetAlert from "../../shared/close-sweetalert";
import AssignmentDetails from "./assignment-details.component";
import BasicDetails from "./basic-details.component";
import ParentDetails from "./parent-details.component";
import PatientValidation from "./patient-validation";
import ProblemDetails from "./problem-details.component";
import { ToastNotification } from "../../shared/toast";

function AddPatient() {
  const [activeTab, setActiveTab] = useState(1);
  const patientListState = useSelector((state) => state.patient.patients);
  const SelectPatientBystatus = patientListState.filter((patient) => patient.Status == 1);
  const UserData = useSelector(selectUserData);

  const dispatch = useDispatch();
  const setModalOpenState = useSelector(selectSetModalOpenState);
  const roleBasedModules = useSelector(selectRoleBasedModules);
  const isTherapistManagementAccess = roleBasedModules.some(
    (module) => module.ModuleName === "TherapistManagement"
  );
  const isCenterManagementAccess = roleBasedModules.some(
    (module) => module.ModuleName === "CenterManagement"
  );
  useEffect(() => {
    dispatch(getAllCountries());
  }, []);

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

  function createFormatDate(date) {
    return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
  }

  const onSubmit = async (values, actions) => {
    if (activeTab === 4) {
      const issueList = {}
      if (Array.isArray(values.IssueList) && values.IssueList.length > 0) {
        issueList.IssueList = values.IssueList
      }
      await dispatch(
        createPatient({
          ...values,
          ...issueList,
          ParentPhone: values.ParentPhone.replace("+", ""),
          DOB: createFormatDate(values.DOB),
          TherapistID: values.Therapist,
          DepartmentID: values.Departments,
          PreviousTreatmentHistoryDescription: values.Previoustreatmenthistory
        })
      );
    } else {
      toggleTab(activeTab + 1);
      await actions.setSubmitting(false);
    }
  };

  const NavArr = [
    "Basic Details",
    "Guardian Details",
    "Problem Details",
    "Assignment Details",
  ];

  // close alert
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
      <Button
        type="button"
        onClick={tog_standard}
        color="primary"
        className="waves-effect waves-light"
      >
        Add Patient
      </Button>
      <Formik
        initialValues={{
          PatientName: "",
          Age: "",
          DOB: "",
          Gender: "",
          AddressLine1: "",
          AddressLine2: "",
          City: "",
          District: "",
          Pincode: "",
          State: "",
          Country: "",
          ParentName: "",
          Salutation: "",
          ParentEmailID: "",
          ParentPhone: "",
          Relationship: "",
          IssueList1: [],
          Previoustreatmenthistory: "",
          DocumentsURL: "",
          ReportsURL: "",
          Remarks: "",
          Center: "",
          Departments: "",
          Therapist: "",
        }}
        validationSchema={PatientValidation(activeTab, {
          isTherapistManagementAccess,
          isCenterManagementAccess,
          isCenter: UserData?.RoleName === "Center",
        })}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, validateForm, resetForm, isSubmitting }) => (
          <Modal
            isOpen={setModalOpenState}
            toggle={() => {
              setIsAlertOpen(true);
            }}
            scrollable={true}
            className="modal right app_modal"
            onClosed={() => {
              setActiveTab(1);
              resetForm();
            }}
          >
            {isAlertOpen ? (
              <CloseSweetAlert
                onConfirm={onHandleCloseConfirm}
                onClose={onCloseAlert}
              />
            ) : null}

            <ModalHeader
              toggle={() => {
                setIsAlertOpen(true);
              }}
            >
              Create Patient
            </ModalHeader>

            <ModalBody>
              <div id="basic-pills-wizard" className="twitter-bs-wizard">
                <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified">
                  {NavArr.map((element, key) => {
                    return (
                      <NavItem key={key}>
                        <NavLink
                          className={activeTab === key + 1 ? "active" : ""}
                          onClick={() => {
                            key + 1 < activeTab
                              ? toggleTab(key + 1)
                              : validateForm().then((result) => {
                                Object.keys(result).length === 0 &&
                                  activeTab + 1 === key + 1
                                  ? toggleTab(key + 1)
                                  : null;
                              });
                          }}
                        >
                          <span className="step-number">0{key + 1}</span>
                          <span className="step-title">{element}</span>
                        </NavLink>
                      </NavItem>
                    );
                  })}
                </ul>
                <TabContent
                  activeTab={activeTab}
                  className="twitter-bs-wizard-tab-content"
                >
                  <TabPane tabId={1}>
                    <BasicDetails />
                  </TabPane>
                  <TabPane tabId={2}>
                    <ParentDetails activeTab={activeTab} />
                  </TabPane>
                  <TabPane tabId={3}>
                    <ProblemDetails />
                  </TabPane>
                  <TabPane tabId={4}>
                    <AssignmentDetails
                      access={{
                        isTherapistManagementAccess,
                        isCenterManagementAccess,
                      }}
                    />
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
                      onClick={handleSubmit}
                      disabled={isSubmitting}
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
                      onClick={handleSubmit}
                    >
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

export default AddPatient;
