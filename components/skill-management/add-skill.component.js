import { useEffect, useState } from "react";
import { fetchAllContents, selectContentList } from "../../store/slice/content.slice";
import { getAllDepartments, selectDepartmentList } from "../../store/slice/department.slice";
import { fetchAllGoals, selectGoalList } from "../../store/slice/goal.slice";
import { fetchAllScales, selectScaleList } from "../../store/slice/scale.slice";

import { ErrorMessage, Field, Formik } from "formik";
import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { selectSetModalOpenState, setModalOpen } from "../../store/slice/layout.slice";
import { createSkill, selectSkillIsEdit, selectSkillList, selectSkillMappingByID, selectSkillState, skillIsEditForm, updateSkill } from "../../store/slice/skills.slice";
import { getAllTherapies, selectTherapiesList } from "../../store/slice/therapies.slice";
import CloseSweetAlert from "../shared/close-sweetalert";
import MultiSelectTextInput from "../shared/multi-select-text.component";
import { selectUserData } from "../../store/slice/auth.slice";
import { ToastNotification } from "../shared/toast";

function AddSkill() {
  const dispatch = useDispatch();
  const UserData = useSelector(selectUserData);
  const setModalOpenState = useSelector(selectSetModalOpenState);
  const isEdit = useSelector(selectSkillIsEdit);
  const selectSkill = useSelector(selectSkillState);
  const skillByMapping = useSelector(selectSkillMappingByID)
  const initialValues = {
    SkillID: "",
    SkillName: "",
    SubSkills: [],
    DepartmentIDs: [],
    ScaleIDs: [],
    GoalIDs: [],
    ActivityIDs: [],
    ReferenceVideoURL: "",
    TherapyIDs: [],
  };
  const [skillInitials, setSkillInitials] = useState(initialValues);
  const [subSkills, setSubSkills] = useState([]);
  const [selectedDepts, setSelectedDepts] = useState(null);
  const [selectedScales, setSelectedScales] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [Therapy, setTherapy] = useState(null);

  const skillsListState = useSelector(selectSkillList);
  let SelectSkillBystatus = skillsListState.filter((skill) => skill.Status == 1);
  let SelectSkillByType = SelectSkillBystatus.filter((skill) => skill.Type === "Custom");



  const [selectedActivity, setSelectedActivity] = useState(null);
  //setting scales
  useEffect(() => {
    dispatch(fetchAllScales());
  }, []);
  const scaleList = useSelector(selectScaleList);
  const [scaleOptions, setScaleOptions] = useState([]);
  useEffect(() => {
    const option = [];
    scaleList.map((scale) => {
      option.push({ label: scale.ScaleName, value: scale.ScaleID });
    });
    setScaleOptions(option);
  }, [scaleList]);

  //setting department
  useEffect(() => {
    dispatch(getAllDepartments());
  }, []);
  const departmentList = useSelector(selectDepartmentList);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  useEffect(() => {
    const option = [];
    departmentList.map((dept) => {
      option.push({ label: dept.DepartmentName, value: dept.DepartmentID });
    });
    setDepartmentOptions(option);
  }, [departmentList]);

  //setting Activity
  useEffect(() => {
    dispatch(fetchAllContents());
  }, []);
  const contentList = useSelector(selectContentList);
  const [contentOptions, setContentOptions] = useState([]);
  useEffect(() => {
    const option = [];
    contentList.map((content) => {
      option.push({
        label: content.ContentActivityName,
        value: content.ContentID,
      });
    });
    setContentOptions(option);
  }, [contentList]);

  //setting Goals
  useEffect(() => {
    dispatch(fetchAllGoals());
    dispatch(getAllTherapies());
  }, []);
  const goalList = useSelector(selectGoalList);
  const [goalOptions, setGoalOptions] = useState([]);
  useEffect(() => {
    const option = [];
    goalList.map((goal) => {
      option.push({ label: goal.GoalName, value: goal.GoalID });
    });
    setGoalOptions(option);
  }, [goalList]);

  const handleDept = (SelectedVal, setFieldValue) => {
    setSelectedDepts(SelectedVal);
    setFieldValue(
      "DepartmentIDs",
      SelectedVal.map((ele) => ele)
    );
  };
  const handleScales = (selectedScales, setFieldValue) => {
    setSelectedScales(selectedScales);
    setFieldValue(
      "ScaleIDs",
      selectedScales.map((ele) => ele)
    );
  };
  const handleGoal = (selectedGoal, setFieldValue) => {
    setSelectedGoal(selectedGoal);
    setFieldValue(
      "GoalIDs",
      selectedGoal.map((ele) => ele)
    );
  };
  const handleTherapies = (Therapy, setFieldValue) => {
    setTherapy(Therapy);
    setFieldValue(
      "TherapyIDs",
      Therapy.map((ele) => ele)
    );
  };
  const handleActivity = (selectedActivity, setFieldValue) => {
    setSelectedActivity(selectedActivity);
    setFieldValue(
      "ActivityIDs",
      selectedActivity.map((ele) => ele)
    );
  };

  const tog_standard = () => {
    if (UserData.RoleName != "SuperAdmin") {
      if (SelectSkillByType.length >= UserData.SubscriptionPlan[0].NumberofCustomSkills) {
        ToastNotification("error", "The number of skills allowed in the subscription plan is already created");
      }
      else {
        dispatch(setModalOpen(!setModalOpenState));
      }
    }
    else {
      dispatch(setModalOpen(!setModalOpenState));
    }
  };

  const validationSchema = Yup.object().shape({
    SkillName: Yup.string().min(2, "Too Short!").max(100, "Too Long!").required("Please enter skill name"),
    // SubSkills: Yup.array().min(1, "Please enter subskills"),
    // DepartmentIDs: Yup.array().min(1, "Please select departments"),
    // ScaleIDs: Yup.array().min(1, "Please select scales"),
    // GoalIDs: Yup.array().min(1, "Please select goals"),
    // ActivityIDs: Yup.array().min(1, "Please select activities"),
    ReferenceVideoURL: Yup.string()
      .max(256, "Too Long!")
      .nullable(),
  });

  const onSubmit = async (values, { resetForm }) => {
    if (!isEdit) {
      const valuesToSend = {
        SkillName: values.SkillName,
        ReferenceVideoURL: values.ReferenceVideoURL,
        SubSkills: values.SubSkills.length ? values.SubSkills : undefined,
        DepartmentIDs: values.DepartmentIDs.length ? values.DepartmentIDs.map(item => item.value) : undefined,
        ScaleIDs: values.ScaleIDs.length ? values.ScaleIDs.map(item => item.value) : undefined,
        GoalIDs: values.GoalIDs.length ? values.GoalIDs.map(item => item.value) : undefined,
        ActivityIDs: values.ActivityIDs.length ? values.ActivityIDs.map(item => item.value) : undefined,
        TherapyIDs: values.TherapyIDs.length ? values.TherapyIDs.map(item => item.value) : undefined,
      }
      await dispatch(createSkill(valuesToSend))
    }
    else {

      const mappings = skillByMapping.filter((skill) => skill.SkillID === values.SkillID)[0]
      const skillMapping = mappings?.SubSkills.map((ele) => {
        return { label: ele.SubSkillName, value: ele.SubSkillName, ID: ele.SubSkillID }
      })

      const forAdd = (a, b) => a.value === b.value;
      const forDelete = (a, b) => a.value === b.value;
      const onlyInArray1 = (array1, array2, checkFunction) =>
        array1.filter(leftValue => !array2.some(rightValue => checkFunction(leftValue, rightValue)));
      const updatedSubSkill = values.SubSkills.map(ele => { return { value: ele } })
      const addedDepartments = onlyInArray1(values.DepartmentIDs, skillInitials.DepartmentIDs, forAdd).map((ele) => ele.value);
      const removedDepartments = onlyInArray1(skillInitials.DepartmentIDs, values.DepartmentIDs, forDelete).map((ele) => ele.value);
      const addedScales = onlyInArray1(values.ScaleIDs, skillInitials.ScaleIDs, forAdd).map((ele) => ele.value);
      const removedScales = onlyInArray1(skillInitials.ScaleIDs, values.ScaleIDs, forDelete).map((ele) => ele.value);
      const addedActivity = onlyInArray1(values.ActivityIDs, skillInitials.ActivityIDs, forAdd).map((ele) => ele.value);
      const removedActivity = onlyInArray1(skillInitials.ActivityIDs, values.ActivityIDs, forDelete).map((ele) => ele.value);
      const addedGoal = onlyInArray1(values.GoalIDs, skillInitials.GoalIDs, forAdd).map((ele) => ele.value);
      const removedGoal = onlyInArray1(skillInitials.GoalIDs, values.GoalIDs, forDelete).map((ele) => ele.value);
      const addedSubSkill = onlyInArray1(updatedSubSkill, skillInitials.SubSkills, forAdd).map((ele) => ele.value);
      const removedSubSkill = onlyInArray1(skillMapping, updatedSubSkill, forDelete).map((ele) => ele.ID);
      const addedTherapy = onlyInArray1(values.TherapyIDs, skillInitials.TherapyIDs, forAdd).map((ele) => ele.value);
      const removedTherapy = onlyInArray1(skillInitials.TherapyIDs, values.TherapyIDs, forDelete).map((ele) => ele.value);


      const valuesToSend = {
        "SkillName": values.SkillName,
        "ReferenceVideoURL": values.ReferenceVideoURL,
        "AddSubSkills": addedSubSkill.length === 0 ? undefined : addedSubSkill,
        "AddScaleIDs": addedScales.length == 0 ? undefined : addedScales,
        "AddDepartmentIDs": addedDepartments.length == 0 ? undefined : addedDepartments,
        "AddGoalIDs": addedGoal.length == 0 ? undefined : addedGoal,
        "AddActivityIDs": addedActivity.length == 0 ? undefined : addedActivity,
        "RemoveSubSkills": removedSubSkill.length === 0 ? undefined : removedSubSkill,
        "RemoveScaleIDs": removedScales.length == 0 ? undefined : removedScales,
        "RemoveDepartmentIDs": removedDepartments.length == 0 ? undefined : removedDepartments,
        "RemoveGoalIDs": removedGoal.length == 0 ? undefined : removedGoal,
        "RemoveActivityIDs": removedActivity.length == 0 ? undefined : removedActivity,
        "AddTherapyIDs": addedTherapy.length == 0 ? undefined : addedTherapy,
        "RemoveTherapyIDs": removedTherapy.length == 0 ? undefined : removedTherapy,
        "Status": true
      }
      await dispatch(updateSkill({ skillID: values.SkillID, body: valuesToSend }));
    }
    resetForm();
  };


  useEffect(() => {
    const mappings = skillByMapping.filter((skill) => skill.SkillID === selectSkill.SkillID)[0]

    if (isEdit) {
      setSelectedDepts(mappings?.SkillDepartmentMappings.map((ele) => {
        return { label: ele.DepartmentName, value: ele.DepartmentID }
      }))
      setSelectedActivity(mappings?.SkillContentMappings.map((ele) => {
        return { label: ele.ContentActivityName, value: ele.ContentID }
      }))
      setSelectedGoal(mappings?.SkillGoalMappings.map((ele) => {
        return { label: ele.GoalName, value: ele.GoalID }
      }))
      setSelectedScales(mappings?.SkillScaleMappings.map((ele) => {
        return { label: ele.ScaleName, value: ele.ScaleID }
      }))
      setSubSkills(mappings?.SubSkills.map((ele) => {
        return { label: ele.SubSkillName, value: ele.SubSkillName, ID: ele.SubSkillID }
      }))
      setTherapy(mappings?.SkillTherapyMappings.map((ele) => {
        return { label: ele.TherapyName, value: ele.TherapyID }
      }))
    }

    setSkillInitials({
      SkillID: isEdit && mappings?.SkillID ? mappings.SkillID : "",
      SkillName: isEdit && mappings?.SkillName ? mappings?.SkillName : "",
      SubSkills: isEdit ? mappings?.SubSkills.map((ele) => {
        return { label: ele.SubSkillName, value: ele.SubSkillName, ID: ele.SubSkillID }
      }) : [],
      DepartmentIDs: isEdit ? mappings?.SkillDepartmentMappings.map((ele) => {
        return { label: ele.DepartmentName, value: ele.DepartmentID }
      }) : [],
      ScaleIDs: isEdit ? mappings?.SkillScaleMappings.map((ele) => {
        return { label: ele.ScaleName, value: ele.ScaleID }
      }) : [],
      GoalIDs: isEdit ? mappings?.SkillGoalMappings.map((ele) => {
        return { label: ele.GoalName, value: ele.GoalID }
      }) : [],
      ActivityIDs: isEdit ? mappings?.SkillContentMappings.map((ele) => {
        return { label: ele.ContentActivityName, value: ele.ContentID }
      }) : [],
      ReferenceVideoURL: isEdit && mappings?.ReferenceVideoURL ? mappings?.ReferenceVideoURL : "",
      TherapyIDs: isEdit ? mappings?.SkillTherapyMappings.map((ele) => {
        return { label: ele.TherapyName, value: ele.TherapyID }
      }) : [],
    });

  }, [isEdit, selectSkill, skillByMapping]);

  // close modal alert
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const onHandleCloseConfirm = async () => {
    setSubSkills([]);
    setSelectedDepts(null);
    setSelectedScales(null);
    setSelectedGoal(null);
    setSelectedActivity(null);

    setIsAlertOpen(false);
    tog_standard();
  };
  const onCloseAlert = () => {
    setIsAlertOpen(false);
  };
  const setModalOpenStte = useSelector(selectTherapiesList);
  const TherapiesList = setModalOpenStte.map((Therapies) => {
    return { value: Therapies.TherapyID, label: Therapies.TherapyName };
  });



  return (
    <>
      <Button type='button' onClick={tog_standard} color='primary' className='waves-effect waves-light'>
        Add Skill
      </Button>
      <Formik initialValues={skillInitials} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
        {({ touched, errors, handleSubmit, resetForm, isSubmitting, setFieldValue }) => (
          <Modal
            isOpen={setModalOpenState}
            toggle={() => {
              setIsAlertOpen(true);
            }}
            scrollable={true}
            className='modal right app_modal width-60'
            onClosed={() => {
              setSkillInitials(initialValues);
              dispatch(skillIsEditForm(false));
              resetForm();
            }}>
            {isAlertOpen ? <CloseSweetAlert onConfirm={onHandleCloseConfirm} onClose={onCloseAlert} /> : null}
            <ModalHeader
              toggle={() => {
                setIsAlertOpen(true);
              }}>
              {isEdit ? "Edit Skill" : "Add Skill"}
            </ModalHeader>
            <ModalBody>
              <div className='mb-4 form-group'>
                <Label className='form-label required' htmlFor='skill-name'>
                  Skill Name
                </Label>
                <Field
                  type='text'
                  name='SkillName'
                  id='skill-name'
                  placeholder='Enter skill name'
                  className='form-control'
                // validate={!isEdit && checkSkillName}
                />
                {errors.SkillName && touched.SkillName ? <ErrorMessage className='text-danger small' name='SkillName' component='div' /> : null}
              </div>
              {isEdit && (
                <div className='mb-4'>
                  <Label className='form-label' htmlFor='skill-id'>
                    Skill ID
                  </Label>
                  <Field type='text' name='SkillID' className='form-control' id='skill-id' disabled />
                </div>
              )}
              <div className='mb-4'>
                <Label className='form-label' htmlFor='Department'>
                  Department
                </Label>
                <Field
                  component={Select}
                  name='DepartmentIDs'
                  id='Department'
                  value={selectedDepts}
                  isMulti={true}
                  on
                  onChange={(SelectedVal) => handleDept(SelectedVal, setFieldValue)}
                  options={departmentOptions}
                  classNamePrefix='select2-selection'
                />
                {errors.DepartmentIDs && touched.DepartmentIDs ? <ErrorMessage className='text-danger small' name='DepartmentIDs' component='div' /> : null}
              </div>
              <div className='mb-4'>
                <Label className='form-label' htmlFor='Scale'>
                  Scale
                </Label>
                <Field
                  component={Select}
                  name='ScaleIDs'
                  id='Scale'
                  value={selectedScales}
                  isMulti={true}
                  onChange={(SelectedVal) => handleScales(SelectedVal, setFieldValue)}
                  options={scaleOptions}
                  classNamePrefix='select2-selection'
                />
                {errors.ScaleIDs && touched.ScaleIDs ? <ErrorMessage className='text-danger small' name='ScaleIDs' component='div' /> : null}
              </div>
              <div className='mb-4'>
                <Label className='form-label' htmlFor='Goal'>
                  Goal
                </Label>
                <Field
                  component={Select}
                  name='GoalIDs'
                  id='Goal'
                  value={selectedGoal}
                  isMulti={true}
                  onChange={(SelectedVal) => handleGoal(SelectedVal, setFieldValue)}
                  options={goalOptions}
                  classNamePrefix='select2-selection'
                />
                {errors.GoalIDs && touched.GoalIDs ? <ErrorMessage className='text-danger small' name='GoalIDs' component='div' /> : null}
              </div>
              <div className='mb-4'>
                <Label className='form-label' htmlFor='Therapy-Method'>
                  Therapy Methods
                </Label>
                <Field
                  component={Select}
                  isMulti={true}
                  options={TherapiesList}
                  value={Therapy}
                  id='Therapy-Method'
                  name='TherapyIDs'
                  placeholder='Select therapy methods'
                  onChange={(Therapy) => { handleTherapies(Therapy, setFieldValue) }}
                  classNamePrefix='select2-selection'
                />
                {errors.TherapyIDs && touched.TherapyIDs ? <ErrorMessage className='text-danger small' name='TherapyIDs' component='div' /> : null}
              </div>
              <div className='mb-4'>
                <Label className='form-label' htmlFor='Activity'>
                  Content Activity
                </Label>
                <Field
                  component={Select}
                  name='ActivityIDs'
                  id='Activity'
                  value={selectedActivity}
                  isMulti={true}
                  onChange={(SelectedVal) => handleActivity(SelectedVal, setFieldValue)}
                  options={contentOptions}
                  classNamePrefix='select2-selection'
                />
                {errors.ActivityIDs && touched.ActivityIDs ? <ErrorMessage className='text-danger small' name='ActivityIDs' component='div' /> : null}
              </div>
              <div className='mb-4 form-group'>
                <Label className='form-label' htmlFor='sub-skill'>
                  Subskills
                </Label>
                {/* <MultiSelectTextInput value={subSkills} setValue={setSubSkills} placeholder='Type sub skill and press enter...' /> */}
                <Field component={MultiSelectTextInput} value={subSkills} setValue={setSubSkills} placeholder='Type sub skill and press enter...' nameAttribute='SubSkills' />

                {errors.SubSkills && touched.SubSkills ? <ErrorMessage className='text-danger small' name='SubSkills' component='div' /> : null}
              </div>
              <div className='mb-4'>
                <Label className='form-label' htmlFor='VideoURL'>
                  Reference Video URL
                </Label>
                <Field type='text' name='ReferenceVideoURL' id='VideoURL' className='form-control' placeholder='Enter video url' />
                {errors.ReferenceVideoURL && touched.ReferenceVideoURL ? <ErrorMessage className='text-danger small' name='ReferenceVideoURL' component='div' /> : null}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={() => {
                  resetForm();
                  dispatch(setModalOpen(false));
                }}
                color='light'
                className='btn-md m-1 waves-effect waves-light action_btn'>
                Cancel
              </Button>

              <Button type='submit' color='primary' className='btn-md m-1 waves-effect waves-light action_btn' onClick={handleSubmit} disabled={isSubmitting}>
                {isEdit ? "Update Skill" : "Add Skill"}
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
}
export default AddSkill;
