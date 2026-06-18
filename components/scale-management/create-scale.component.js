import { useState, useEffect } from "react";

import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Row, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { setModalOpen, selectSetModalOpenState } from "../../store/slice/layout.slice";
import Select from "react-select";
import { fetchAllSkills, selectSkillList } from "../../store/slice/skills.slice";
import { getAllCountries, getAllRegion, selectCountries, selectRegions } from "../../store/slice/common.slice";
import { createScale, selectScaleEdit, selectScaleList, isEditScale, ScaleDetails, selectCurrentScaleId, selectScaleDetail, ScaleSkill, selectScaleData, ScaleUpdate, selectScaleIsLoading, selectScaleCreating } from "../../store/slice/scale.slice";

import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import CloseSweetAlert from "../shared/close-sweetalert";
import { selectUserData } from "../../store/slice/auth.slice";
import { ToastNotification } from "../shared/toast";
function CreateScale() {
  const dispatch = useDispatch();
  const setModalOpenState = useSelector(selectSetModalOpenState);
  const ScaleID = useSelector(selectCurrentScaleId);
  const UserData = useSelector(selectUserData);
  const isEdit = useSelector(selectScaleEdit);
  const loading = useSelector(selectScaleCreating);
  const InitialScaleDetails = useSelector(selectScaleDetail)[0];
  // const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState(null);
  const [creatingFor, setCreatingFor] = useState("");
  const [scaleType, setScaleType] = useState("");
  const [trivandrumMode, setTrivandrumMode] = useState(false);

  const initials = {
    ScaleName: "",
    Accreditation: "",
    ScaleCategory: "",
    ScaleMetric: "",
    Skills: [],
    ScaleMetricType: "",
    // Regions: [],
  };

  const [scaleInitial, setScaleInitial] = useState(initials);
  const scaleList = useSelector(selectScaleList);
  const SkillDAta = useSelector(selectScaleData);
  const skillData = scaleList?.find(e => e.ScaleID === ScaleID)
  const ScaleStatus = scaleList.filter(
    (e) => e.Status == 1
  );


  let SelectScaleByType = ScaleStatus.filter((e) => e.ScaleType != "Default");

  useEffect(() => {
    dispatch(ScaleDetails(ScaleID));
    dispatch(ScaleSkill(ScaleID));
  }, [ScaleID, dispatch, setModalOpenState]);

  // Reset trivandrumMode whenever the modal closes (including thunk-triggered closes)
  useEffect(() => {
    if (!setModalOpenState) {
      setTrivandrumMode(false);
      setCreatingFor("");
    }
  }, [setModalOpenState]);

  useEffect(() => {
    dispatch(fetchAllSkills());
    if (isEdit) {
      setScaleInitial(
        {
          ScaleName: InitialScaleDetails?.ScaleName,
          Accreditation: InitialScaleDetails?.Accreditation,
          ScaleCategory: InitialScaleDetails?.ScaleCategory,
          ScaleMetric: InitialScaleDetails?.ScaleMetric,
          Skills: [],
          ScaleMetricType: InitialScaleDetails?.ScaleMetricType,
        }
      )
      setScaleType({ label: InitialScaleDetails?.ScaleMetricType, value: InitialScaleDetails?.ScaleMetricType });
    }
    else {
      setScaleInitial(
        {
          ScaleName: "",
          Accreditation: "",
          ScaleCategory: "",
          ScaleMetric: "",
          Skills: [],
          ScaleMetricType: "",
        }
      )
    }
  }, [ScaleID, isEdit, InitialScaleDetails]);

  const skillList = useSelector(selectSkillList);
  const [skillOptions, setSkillOptions] = useState([]);
  const [skillIntialOptions, setInitialSkillOptions] = useState([]);

  useEffect(() => {
    const option = [];
    skillList.map((skill) => {
      option.push({ label: skill.SkillName, value: skill.SkillID });
    });
    setSkillOptions(option);
  }, [skillList]);


  useEffect(() => {
    const option = [];
    SkillDAta.map((skill) => {
      option.push({ label: skill.SkillName, value: skill.SkillID });
    });
    setInitialSkillOptions(option);
  }, [SkillDAta]);





  useEffect(() => {
    dispatch(getAllCountries());
  }, []);
  //setting regions
  useEffect(() => {
    dispatch(getAllRegion());
  }, []);
  const regionList = useSelector(selectCountries);
  const [regionOptions, setRegionOptions] = useState([]);
  useEffect(() => {
    const option = [];
    regionList.map((region) => {
      option.push({ label: region.CountryName, value: region.CountryID });
    });
    setRegionOptions(option);
  }, [regionList]);

  const typeOptions = {
    Screening: [
      { label: "ISSA", value: "ISSA" },
      { label: "Trivandrum", value: "Trivandrum" },
      { label: "CARS-ST", value: "disabled" },
      { label: "CARS-HT", value: "disabled" },
    ],

    Assessment: [
      { label: "ABLLS", value: "ABLLS" },
      { label: "ABLLS-2", value: "disabled" },
      { label: "ABLLS-3", value: "disabled" },
    ],
  };
  const tog_standard = () => {
    dispatch(isEditScale(false));
    setTrivandrumMode(false);
    setCreatingFor("");
    setScaleType(null);
    setScaleInitial(initials);
    if (UserData.RoleName != "SuperAdmin") {
      if (SelectScaleByType.length >= UserData.SubscriptionPlan[0].NumberofCustomScales) {
        ToastNotification("error", "The number of scales allowed in the subscription plan is already created");
      } else {
        dispatch(setModalOpen(!setModalOpenState));
      }
    } else {
      dispatch(setModalOpen(!setModalOpenState));
    }
  };

  const tog_trivandrum = () => {
    dispatch(isEditScale(false));
    setTrivandrumMode(true);
    setCreatingFor("Screening");
    setScaleType({ label: "Trivandrum", value: "Trivandrum" });
    setScaleInitial({
      ScaleName: "",
      Accreditation: "",
      ScaleCategory: "",
      ScaleMetric: "Screening",
      Skills: [],
      ScaleMetricType: "Trivandrum",
    });
    dispatch(setModalOpen(true));
  };

  // const handleRegion = (selectedRegion, setFieldValue) => {
  //   setFieldValue("Regions", selectedRegion);
  //   setSelectedRegion(selectedRegion);
  // };

  const handleCreatingFor = (setFieldValue) => {
    const choice = document.getElementById("Screening").checked ? "Screening" : "Assessment";
    setFieldValue("ScaleMetricType", "");
    setFieldValue("ScaleMetric", choice);
    setCreatingFor(choice);
    setScaleType("");
  };

  const handleType = (scaleType, setFieldValue) => {
    setFieldValue("ScaleMetricType", scaleType.label);
    setScaleType(scaleType);
  };

  const handleMultiple = (selectedSkills, setFieldValue) => {
    setFieldValue("Skills", selectedSkills);
    setSelectedSkills(selectedSkills);
  };
  const validationSchema = Yup.object().shape({
    ScaleName: Yup.string().max(200, "Too Long!").required("Please enter a scale name"),
    Accreditation: Yup.string().max(200, "Too Long!").required("Please enter a accreditation"),
    ScaleCategory: Yup.string().required("Please select a scale category"),
    ScaleMetric: Yup.string().required("Please select a scale metric"),
    Skills: Yup.array().min(1, "Please select skills"),
    ScaleMetricType: Yup.string().matches("").required("Please select a scale type"),
    // Regions: Yup.array().min(1, "Please select a regions"),
  });

  const validationSchemaWithOutSkill = Yup.object().shape({
    ScaleName: Yup.string().max(200, "Too Long!").required("Please enter a scale name"),
    Accreditation: Yup.string().max(200, "Too Long!").required("Please enter a accreditation"),
    ScaleCategory: Yup.string().required("Please select a scale category"),
    ScaleMetric: Yup.string().required("Please select a scale metric"),
    ScaleMetricType: Yup.string().matches("").required("Please select a scale type"),
    // Regions: Yup.array().min(1, "Please select a regions"),
  });

  const submit = async (values,{resetForm}) => {
    if (isEdit) {
      const data = {
        "ScaleName": values.ScaleName,
        "Accreditation": values.Accreditation,
        "ScaleCategory": values.ScaleCategory,
        "ScaleMetric": values.ScaleMetric,
        "ScaleMetricType": values.ScaleMetricType,
        "Status": true
      }
      const valueToSend = {
        data,
        ScaleID
      }
      dispatch(ScaleUpdate(valueToSend));
      await setScaleInitial(
        {
          ScaleName: "",
          Accreditation: "",
          ScaleCategory: "",
          ScaleMetric: "",
          Skills: [],
          ScaleMetricType: "",
        }
      );
      await setInitialSkillOptions([]);
    }
    else {
      const data = {
        "ScaleName": values.ScaleName,
        "Accreditation": values.Accreditation,
        "ScaleCategory": values.ScaleCategory,
        "ScaleMetric": values.ScaleMetric,
        "ScaleMetricType": values.ScaleMetricType,
        "SkillIDs": values.Skills.map(item => item.value)
      }
      console.log("data",data);
      dispatch(createScale(data));
    }
  };

  // close modal alert
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const onHandleCloseConfirm = async () => {
    dispatch(isEditScale(false));
    setSelectedSkills(null);
    setScaleType(null);
    setTrivandrumMode(false);
    setCreatingFor("");
    setIsAlertOpen(false);
    dispatch(setModalOpen(false));
  };
  const onCloseAlert = () => {
    setIsAlertOpen(false);
  };

  return (
    <>
      <Button type='button' onClick={tog_standard} color='primary' className='waves-effect waves-light me-2'>
        Create scale
      </Button>
      <Button type='button' onClick={tog_trivandrum} color='success' className='waves-effect waves-light'>
        Create Trivandrum Scale
      </Button>

      <Formik initialValues={scaleInitial} validationSchema={isEdit ? validationSchemaWithOutSkill : validationSchema} onSubmit={submit} enableReinitialize={true}>
        {({ touched, errors, handleSubmit, setFieldValue, isSubmitting, resetForm, values }) => (
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
              {isEdit ? "Edit Scale" : trivandrumMode ? "Create Trivandrum Scale" : "Create Scale"}
            </ModalHeader>
            <ModalBody>
              <div className='mb-4'>
                <Label className='form-label required' htmlFor='scale-name'>
                  Scale Name
                </Label>
                <Field type='text' name='ScaleName' className='form-control' id='scale-name' placeholder='Enter scale name' />
                {errors.ScaleName && touched.ScaleName ? <ErrorMessage className='text-danger small' name='ScaleName' component='div' /> : null}
              </div>
              {console.log("formik values", values)}
              <Row>
                <Col lg='6'>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='accreditation'>
                      Accreditation
                    </Label>
                    <Field type='text' name='Accreditation' className='form-control' id='accreditation' placeholder='Enter accreditation' />
                    {errors.Accreditation && touched.Accreditation ? <ErrorMessage className='text-danger small' name='Accreditation' component='div' /> : null}
                  </div>
                </Col>
                <Col lg='6'>
                  <Label className='form-label required mb-3'>Category</Label>
                  <div className='d-flex flex-wrap'>
                    <div className='custom-control custom-radio mb-2 mr-5'>
                      <Field type='radio' id='customRadio1' name='ScaleCategory' className='custom-control-Input form-check-input' value='Standardized' />
                      <Label className='custom-control-Label' htmlFor='customRadio1'>
                        Standardized
                      </Label>
                    </div>
                    <div className='custom-control custom-radio mb-2 mr-5'>
                      <Field type='radio' id='customRadio2' name='ScaleCategory' className='custom-control-Input form-check-input' value='Non-Standardised' />
                      <Label className='custom-control-Label' htmlFor='customRadio2'>
                        Non-Standardised
                      </Label>
                    </div>
                  </div>
                  {errors.ScaleCategory && touched.ScaleCategory ? <ErrorMessage className='text-danger small' name='ScaleCategory' component='div' /> : null}
                </Col>
              </Row>
              <Row>
                <Col lg='6'>
                  <div className='mb-4'>
                    <Label className='form-label required mb-2' htmlFor='scale-id'>
                      Scale Metric
                    </Label>
                    <div className='d-flex flex-wrap'>
                      <div className='custom-control custom-radio mr-5'>
                        <Field
                          type='radio'
                          id='Screening'
                          name='ScaleMetric'
                          disabled={isEdit || trivandrumMode}
                          className='custom-control-Input form-check-input'
                          onChange={() => {
                            handleCreatingFor(setFieldValue);
                          }}
                          value='Screening'
                        />
                        <Label className='custom-control-Label' htmlFor='Screening'>
                          Screening
                        </Label>
                      </div>
                      <div className='custom-control custom-radio ml-5'>
                        <Field
                          type='radio'
                          id='Assessment'
                          disabled={isEdit || trivandrumMode}
                          name='ScaleMetric'
                          className='custom-control-Input form-check-input'
                          onChange={() => {
                            handleCreatingFor(setFieldValue);
                          }}
                          value='Assessment'
                        />
                        <Label className='custom-control-Label' htmlFor='Assessment'>
                          Assessment
                        </Label>
                      </div>
                    </div>
                    {errors.ScaleMetric && touched.ScaleMetric ? <ErrorMessage className='text-danger small' name='ScaleMetric' component='div' /> : null}
                  </div>
                </Col>
                <Col>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='scaleType'>
                      Scale Metric Type
                    </Label>
                    <Field
                      component={Select}
                      name='ScaleMetricType'
                      value={scaleType}
                      onChange={(selectedOption) => {
                        handleType(selectedOption, setFieldValue);
                      }}
                      options={typeOptions[creatingFor]}
                      isDisabled={isEdit || trivandrumMode}
                      isOptionDisabled={(option) => option.value === "disabled"}
                      classNamePrefix='select2-selection'
                    />
                    {errors.ScaleMetricType && touched.ScaleMetricType ? <ErrorMessage className='text-danger small' name='ScaleMetricType' component='div' /> : null}
                  </div>
                </Col>
              </Row>
              <div className='mb-4'>
                <Label className='form-label required' htmlFor='regions'>
                  Skills
                </Label>
                <Field
                  component={Select}
                  name='Skills'
                  value={isEdit ? skillIntialOptions : selectedSkills}
                  isDisabled={isEdit}
                  isMulti={true}
                  onChange={(selectedOption) => handleMultiple(selectedOption, setFieldValue)}
                  options={skillOptions}
                  classNamePrefix='select2-selection'
                />
                {errors.Skills && touched.Skills ? <ErrorMessage className='text-danger small' name='Skills' component='div' /> : null}
              </div>

              {/* <div className='mb-4'>
                <Label className='form-label required' htmlFor='regions'>
                  Regions
                </Label>
                <Field
                  component={Select}
                  name='Regions'
                  value={selectedRegion}
                  isMulti={true}
                  onChange={(selectedOption) => {
                    handleRegion(selectedOption, setFieldValue);
                  }}
                  options={regionOptions}
                  className='basic-multi-select'
                  classNamePrefix='form-control'
                  id='regions'
                />
                {errors.Regions && touched.Regions ? <ErrorMessage className='text-danger small' name='Regions' component='div' /> : null}
              </div> */}
            </ModalBody>
            <ModalFooter>
              <Button type='button'  onClick={handleSubmit} disabled={loading} color='primary' className='btn-md m-1 waves-effect waves-light action_btn'>
                {isEdit ? "Update" : "Submit"}
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
}
export default CreateScale;
