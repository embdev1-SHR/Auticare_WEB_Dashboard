import { ErrorMessage, Field, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { selectSetModalOpenState, setModalOpen } from "../../store/slice/layout.slice";
import { fetchAllSkills, selectSkillList } from "../../store/slice/skills.slice";
import { selectIsTherapyEdit, selectTherapy, selectTherapySkillGoal, setTherapyEdit, therapyCreation, therapyUpdation } from "../../store/slice/therapies.slice";
import CloseSweetAlert from "../shared/close-sweetalert";
import MultiSelectTextInput from "../shared/multi-select-text.component";

function AddTherapy() {
  const dispatch = useDispatch();
  const router = useRouter();

  const setModalOpenState = useSelector(selectSetModalOpenState);
  let Therapy = useSelector(selectTherapy);
  const isEditState = useSelector(selectIsTherapyEdit);
  const initialValues = { TherapyID: "", TherapyName: "", AgeGroup: "", Skills: [], Goals: [] };
  const [therapyInitialValues, setTherapyInitialValues] = useState(initialValues);
  const TherapiesSkillGoal = useSelector(selectTherapySkillGoal);

  const [goals, setGoals] = useState([]);
  const [Skills, setSkills] = useState([]);
  //setting skills
  const [selectedSkills, setSelectedSkills] = useState(null);
  useEffect(() => {
    dispatch(fetchAllSkills());
  }, [dispatch]);
  const skillList = useSelector(selectSkillList);

  const [skillOptions, setSkillOptions] = useState([]);

  useEffect(() => {
    const option = [];
    skillList.map((skill) => {
      option.push({ label: skill.SkillName, value: skill.SkillID });
    });
    setSkillOptions(option);
  }, [skillList]);

  const handleSkill = (selectedSkills, setFieldValue) => {
    setFieldValue(
      "Skills",
      selectedSkills.map((item) => item)
    );
    setSkills(selectedSkills);
  };

  const selectAgeGroup = (selectedSkills, setFieldValue) => {
    console.log("selectedSkills",selectedSkills.value);
    setFieldValue("AgeGroup", selectedSkills.value );
  };

  const tog_standard = () => {
    dispatch(setModalOpen(!setModalOpenState));
    dispatch(setTherapyEdit(false));
  };

  const onSubmit = async (values) => {
    // const valuesToSend = { ...values, Status: true };
    const valuesToSend = {
      "TherapyName": values.TherapyName,
      "AgeGroup": values.AgeGroup,
      "Goals": values.Goals.length == 0 ? undefined : values.Goals,
      "SkillIDs": values.Skills.length == 0 ? undefined : values.Skills.map(item => item.value)
    }

    const updatedGoal = values.Goals.map((goal) => { return { value: goal } })
    const forAdd = (a, b) => a.value === b.value;
    const forDelete = (a, b) => a.value === b.value;
    const onlyInArray1 = (array1, array2, checkFunction) =>
      array1?.filter(leftValue =>
        !array2?.some(rightValue =>
          checkFunction(leftValue, rightValue)));

    const addedGoal = onlyInArray1(updatedGoal, therapyInitialValues.Goals, forAdd)?.map((ele) => ele.value);
    const removedGoal = onlyInArray1(therapyInitialValues.Goals, updatedGoal, forDelete)?.map((ele) => ele.ID);
    const addedSkill = onlyInArray1(values.Skills, therapyInitialValues.Skills, forAdd)?.map((ele) => ele.value);
    const removedSkill = onlyInArray1(therapyInitialValues.Skills, values.Skills, forDelete)?.map((ele) => ele.value);
    const UpdateValuesToSend = {
      "TherapyName": values.TherapyName,
      "AgeGroup": values.AgeGroup,
      "AddGoals": addedGoal.length ? addedGoal : undefined,
      "RemoveGoalIDs": removedGoal.length ? removedGoal : undefined,
      "AddSkillIDs": addedSkill.length ? addedSkill : undefined,
      "RemoveSkillIDs": removedSkill.length ? removedSkill : undefined,
      "Status": true,
      "TherapyID": values.TherapyID
    }
    !isEditState ? await dispatch(therapyCreation(valuesToSend)) : await dispatch(therapyUpdation(UpdateValuesToSend));
  };

  useEffect(() => {
    const GoalData = TherapiesSkillGoal?.Goals?.filter((f) => f.TherapyID == Therapy[0]?.TherapyID)
    const SkillData = Therapy[0]?.TherapyID ? TherapiesSkillGoal?.TherapySkillMappings?.filter((f) => f.TherapyID == Therapy[0]?.TherapyID) : []
    if (isEditState) {
      setSkills(SkillData?.map(therapy => ({ label: therapy.SkillName, value: therapy.SkillID })));
      setGoals(GoalData?.map(therapy => ({ label: therapy.GoalName, value: therapy.GoalName, ID: therapy.GoalID })));
    }
    if (Therapy.length > 0) {
      setTherapyInitialValues({
        TherapyID: isEditState && Therapy[0].TherapyID ? Therapy[0].TherapyID : "",
        TherapyName: isEditState && Therapy[0].TherapyName ? Therapy[0].TherapyName : "",
        AgeGroup: isEditState && Therapy[0].AgeGroup ? Therapy[0].AgeGroup : "",
        Skills: isEditState ? SkillData?.map(therapy => ({ label: therapy.SkillName, value: therapy.SkillID })) : [],
        Goals: isEditState ? GoalData?.map(therapy => ({ label: therapy.GoalName, value: therapy.GoalName, ID: therapy.GoalID })) : [],
      });
    }

  }, [isEditState, Therapy, TherapiesSkillGoal]);

  const validationSchema = Yup.object().shape({
    TherapyName: Yup.string().max(200, "Too Long!").required("Please enter Therapy Name"),
    AgeGroup: Yup.string().required("Please enter Age Group"),
    // Skills: Yup.array().required("Please enter Skills"),
    // Goals: Yup.array().required("Please enter Goals"),
  });


  // close modal alert
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const onHandleCloseConfirm = async () => {
    setGoals([]);
    setSelectedSkills(null);

    setIsAlertOpen(false);
    tog_standard();
  };
  const onCloseAlert = () => {
    setIsAlertOpen(false);
  };


  const option = [
    { value: '', label: 'Select' },
    { value: 'Birth to 1 month', label: 'Birth to 1 month' },
    { value: '1 month to 1 year', label: '1 month to 1 year' },
    { value: '1 year through 12 years', label: '1 year through 12 years' },
    { value: '13 years through 17 years', label: '13 years through 17 years' },
    { value: '18 years or older', label: '18 years or older' },
    { value: '65 and older', label: '65 and older' }
  ]



  return (
    <>
      <Button type='button' onClick={tog_standard} color='primary' className='waves-effect waves-light'>
        Add Therapy
      </Button>
      <Formik initialValues={therapyInitialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit} enableReinitialize={true}>
        {({ touched, errors, setFieldValue, handleSubmit, resetForm, isSubmitting }) => (
          <Modal
            isOpen={setModalOpenState}
            toggle={() => {
              setIsAlertOpen(true);
            }}
            scrollable={true}
            className='modal right app_modal width-60'
            onClosed={() => {
              resetForm();
            }}>
            {isAlertOpen ? <CloseSweetAlert onConfirm={onHandleCloseConfirm} onClose={onCloseAlert} /> : null}

            <ModalHeader
              toggle={() => {
                setIsAlertOpen(true);
              }}>
              {isEditState ? "Edit Therapy" : "Add Therapy"}
            </ModalHeader>

            <ModalBody>
              <div className='mb-4 form-group'>
                <Label className='form-label required' htmlFor='therapy-name'>
                  Therapy Name
                </Label>
                <Field
                  type='text'
                  name='TherapyName'
                  id='therapy-name'
                  placeholder='Enter Therapy Name'
                  className='form-control' />
                {errors.TherapyName && touched.TherapyName ? <ErrorMessage className='text-danger small' name='TherapyName' component='div' /> : null}
              </div>

              {isEditState ? (
                <div className='mb-4'>
                  <Label className='form-label' htmlFor='therapy-id'>
                    Therapy ID
                  </Label>
                  <Field type='text' name='TherapyID' className='form-control' id='therapy-id' disabled />
                </div>
              ) : null}
              <div className='mb-4 form-group'>
                <Label className='form-label required' htmlFor='age-group'>
                  Age Category
                </Label>
                <Field
                  component={Select}
                  name='AgeGroup'
                  options={option}
                  onChange={(selectedOption) => selectAgeGroup(selectedOption, setFieldValue)}
                  classNamePrefix='select2-selection'
                />
                {errors.AgeGroup && touched.AgeGroup ? <ErrorMessage className='text-danger small' name='AgeGroup' component='div' /> : null}
              </div>
              <div className='mb-4'>
                <Label className='form-label ' htmlFor='Skills'>
                  Skills
                </Label>
                <Field
                  component={Select}
                  name='Skills'
                  value={Skills}
                  isMulti={true}
                  onChange={(selectedOption) => handleSkill(selectedOption, setFieldValue)}
                  options={skillOptions}
                  classNamePrefix='select2-selection'
                />
                {errors.Skills && touched.Skills ? <ErrorMessage className='text-danger small' name='Skills' component='div' /> : null}
              </div>

              <div className='mb-4'>
                <Label className='form-label ' htmlFor='goals'>
                  Goals
                </Label>
                <Field component={MultiSelectTextInput}
                  value={goals}
                  setValue={setGoals}
                  placeholder='Type goal and press enter...' nameAttribute='Goals' />
                {errors.Goals && touched.Goals ? <ErrorMessage className='text-danger small' name='Goals' component='div' /> : null}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={() => {
                  resetForm(), tog_standard();
                }}
                color='light'
                type='reset'
                className='btn-md m-1 waves-effect waves-light action_btn'>
                Cancel
              </Button>

              <Button type='submit' color='primary' className='btn-md m-1 waves-effect waves-light action_btn' disabled={isSubmitting} onClick={handleSubmit}>
                {isEditState ? "Update" : "Submit"}
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
}
export default AddTherapy;
