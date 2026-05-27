import { ErrorMessage, Field, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { createAssessment } from "../../store/slice/assessment.slice";
import { getAllRegion, selectRegions } from "../../store/slice/common.slice";
import { fetchAllScales, selectScaleList } from "../../store/slice/scale.slice";
import { fetchAllSkills, selectSkillList } from "../../store/slice/skills.slice";

import Select from "react-select";
import { Button, Col, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectSetModalOpenState, setModalOpen } from "../../store/slice/layout.slice";
import CloseSweetAlert from "../shared/close-sweetalert";

function CreateAssessment() {
  const router = useRouter();
  const dispatch = useDispatch();
  const setModalOpenState = useSelector(selectSetModalOpenState);

  //setting skills
  useEffect(() => {
    dispatch(fetchAllSkills());
  }, []);
  const skillList = useSelector(selectSkillList);
  const [skillOptions, setSkillOptions] = useState([]);
  useEffect(() => {
    const option = [];
    skillList.map((skill) => {
      option.push({ label: skill.SkillName, value: skill.SkillID });
    });
    setSkillOptions(option);
  }, [skillList]);

  //setting scales
  // useEffect(() => {
  //   dispatch(fetchAllScales());
  // }, []);

  const scaleList = useSelector(selectScaleList);
  const [scaleOptions, setScaleOptions] = useState([]);
  useEffect(() => {
    const option = [];
    scaleList.map((scale) => {
      option.push({ label: scale.ScaleName, value: scale.ScaleID });
    });
    setScaleOptions(option);
  }, [scaleList]);

  //setting regions
  useEffect(() => {
    dispatch(getAllRegion());
  }, []);
  const regionList = useSelector(selectRegions);
  const [regionOptions, setRegionOptions] = useState([]);
  useEffect(() => {
    const option = [];
    regionList.map((region) => {
      option.push({ label: region.RegionName, value: region.RegionID });
    });
    setRegionOptions(option);
  }, [regionList]);

  const [selectedMultiSkill, setSelectedMultiSkill] = useState(null);
  const [selectedScale, setSelectedScale] = useState(null);
  const [selectedMultiRegion, setSelectedMultiRegion] = useState(null);

  const handleScale = (selectedScale, setFieldValue) => {
    setFieldValue("ScaleID", selectedScale.value);
    setSelectedScale(selectedScale);
  };
  const handleMultiSkill = (selectedMultiSkill, setFieldValue) => {
    setFieldValue(
      "SkillID",
      selectedMultiSkill.map((skill) => {
        return skill.value;
      })
    );
    setSelectedMultiSkill(selectedMultiSkill);
  };
  const handleMultiRegion = (selectedMultiRegion, setFieldValue) => {
    setFieldValue(
      "RegionIDs",
      selectedMultiRegion.map((region) => {
        return region.value;
      })
    );
    setSelectedMultiRegion(selectedMultiRegion);
  };

  const tog_standard = () => {
    dispatch(setModalOpen(!setModalOpenState));
  };

  const initialValues = {
    AssessmentName: "",
    Accreditation: "",
    AssessmentCategory: "",
    ScaleID: "",
    SkillID: [],
    RegionIDs: [],
  };

  const validationSchema = Yup.object().shape({
    AssessmentName: Yup.string().required("Please enter Assessment Name"),
    Accreditation: Yup.string().required("Please Enter Accreditation"),
    AssessmentCategory: Yup.string().required("Please select Assessment Category"),
    ScaleID: Yup.string().required("Please select Scale"),
    SkillID: Yup.array().min(1, "Please select Skills"),
    RegionIDs: Yup.array().min(1, "Please select Regions"),
  });

  const submitAssessment = async (values) => {

    await dispatch(createAssessment(values));

    router.push("/assessments/add-assessment");
  };

  // close modal alert

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const onHandleCloseConfirm = async () => {
    setSelectedMultiSkill(null);
    setSelectedScale(null);
    setSelectedMultiRegion(null);
    setIsAlertOpen(false);
    tog_standard();
  };
  const onCloseAlert = () => {
    setIsAlertOpen(false);
  };

  return (
    <>
      <Button type='button' onClick={tog_standard} color='primary' className='waves-effect waves-light'>
        Create assessment
      </Button>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitAssessment}>
        {({ touched, errors, handleSubmit, setFieldValue, isSubmitting, resetForm }) => (
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
              Create assessment
            </ModalHeader>
            <ModalBody>
              <Row>
                <Col lg='6'>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='assessment-name'>
                      Assessment Name
                    </Label>
                    <Field type='text' name='AssessmentName' className='form-control' id='assessment-name' placeholder='Enter assessment name' />
                    {errors.AssessmentName && touched.AssessmentName ? <ErrorMessage className='text-danger small' name='AssessmentName' component='div' /> : null}
                  </div>
                </Col>
                <Col lg='6'>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='accreditation'>
                      Accreditation
                    </Label>
                    <Field type='text' name='Accreditation' className='form-control' id='accreditation' placeholder='Enter accreditation' />
                    {errors.Accreditation && touched.Accreditation ? <ErrorMessage className='text-danger small' name='Accreditation' component='div' /> : null}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg='6'>
                  <Label className='form-label required mb-3'>Category</Label>
                  <div className='d-flex flex-wrap'>
                    <div className='custom-control custom-radio mb-2 mr-3'>
                      <Field type='radio' id='std' name='AssessmentCategory' value='Standardised' className='custom-control-Input form-check-input' />
                      <Label className='custom-control-Label' htmlFor='std'>
                        Standardised
                      </Label>
                    </div>
                    <div className='custom-control custom-radio mb-2 mr-3'>
                      <Field type='radio' id='nstd' name='AssessmentCategory' value='Non-Standardised' className='custom-control-Input form-check-input' />
                      <Label className='custom-control-Label' htmlFor='nstd'>
                        Non-Standardised
                      </Label>
                    </div>
                  </div>
                  {errors.AssessmentCategory && touched.AssessmentCategory ? <ErrorMessage className='text-danger small' name='AssessmentCategory' component='div' /> : null}
                </Col>
                <Col>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='skill'>
                      Skill
                    </Label>
                    <Field
                      as={Select}
                      name='SkillID'
                      value={selectedMultiSkill}
                      isMulti={true}
                      onChange={(selectedOption) => {
                        handleMultiSkill(selectedOption, setFieldValue);
                      }}
                      options={skillOptions}
                      classNamePrefix='select2-selection'
                    />
                    {errors.SkillID && touched.SkillID ? <ErrorMessage className='text-danger small' name='SkillID' component='div' /> : null}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='scale'>
                      Scale
                    </Label>
                    <Field
                      component={Select}
                      name='ScaleID'
                      value={selectedScale}
                      isMulti={false}
                      onChange={(selectedValue) => handleScale(selectedValue, setFieldValue)}
                      options={scaleOptions}
                      classNamePrefix='select2-selection'
                    />
                    {errors.ScaleID && touched.ScaleID ? <ErrorMessage className='text-danger small' name='ScaleID' component='div' /> : null}
                  </div>
                </Col>
                <Col>
                  <div className='mb-4'>
                    <Label className='form-label required' htmlFor='regions'>
                      Regions
                    </Label>
                    <Field
                      component={Select}
                      name='RegionIDs'
                      value={selectedMultiRegion}
                      isMulti={true}
                      onChange={(selectedOptions) => handleMultiRegion(selectedOptions, setFieldValue)}
                      options={regionOptions}
                      classNamePrefix='select2-selection'
                    />
                    {errors.RegionIDs && touched.RegionIDs ? <ErrorMessage className='text-danger small' name='RegionIDs' component='div' /> : null}
                  </div>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button type='button' color='primary' className='btn-md m-1 waves-effect waves-light action_btn' disabled={isSubmitting} onClick={handleSubmit}>
                Submit
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
}
export default CreateAssessment;
