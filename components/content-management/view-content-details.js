import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Button, Label } from "reactstrap";
import {
  ContentDetails,
  ContentMappingList,
  contentDetailsLoading,
  selectContentIsEdit,
  selectContentMapping,
  setContentEdit,
  updateContent
} from "../../store/slice/content.slice";
import {
  fetchAllSkills,
  selectSkillList,
} from "../../store/slice/skills.slice";
import { getAllTherapies, selectTherapiesList } from "../../store/slice/therapies.slice";
import Loader from "../shared/loader";
import {
  ContentCategoryOptions,
  ContentTypeoptions
} from "./common.content";

function ViewContentDetails() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { ContentID } = router.query;
  const content = useSelector(ContentDetails);
  const isEdit = useSelector(selectContentIsEdit);
  const contentDetailsIsLoadingState = useSelector(contentDetailsLoading);
  const Mapping = useSelector(selectContentMapping);
  const selectTherapies = useSelector(selectTherapiesList);
  const selectSkills = useSelector(selectSkillList);

  const ContentCategoryDefaultValue = ContentTypeoptions.find(
    (option) => option.value === content?.ContentCategory
  );
  const [contentInitials, setContentInitials] = useState([]);
  const [selectedTherapy, setSelectedTherapy] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);


  useEffect(() => {
    const contentTherapyMappings = Mapping?.ContentTherapyMappings ? Mapping?.ContentTherapyMappings?.filter(therapy => therapy.ContentID == ContentID) : []
    const contentSkillMappings = Mapping?.ContentSkillMappings ? Mapping?.ContentSkillMappings?.filter(skill => skill.ContentID == ContentID) : []
    setSelectedTherapy(contentTherapyMappings.map((ele) => {
      return { label: ele.TherapyName, value: ele.TherapyID }
    }))
    setSelectedSkill(contentSkillMappings.map((ele) => {
      return { label: ele.SkillName, value: ele.SkillID }
    }))



    setContentInitials({
      ContentID: content?.ContentID,
      ContentActivityDescription: content?.ContentActivityDescription,
      ContentActivityName: content?.ContentActivityName,
      ContentCategory: content?.ContentCategory,
      TherapyIDs: selectedTherapy,
      SkillIDs: selectedSkill,
    });

  }, [Mapping, content]);


  const selectStyles = {
    control: (styles, { isDisabled }) => ({
      ...styles,
      borderColor: " #e8eaed;",
      color: isDisabled && "#292c39",
      backgroundColor: isDisabled ? "#f9fbff" : "white",
    }),
    singleValue: (styles, { isDisabled }) => ({
      ...styles,
      color: isDisabled && "#292c39",
    }),
  };
  const onCancel = async () => {
    // await dispatch(SelectContent(ContentID));

    await dispatch(setContentEdit(false));
    await router.back();
  };


  const therapies = selectTherapies.filter((therapy) => therapy.Status == 1);

  const therapiesList = therapies.map((therapy) => {
    return { value: therapy.TherapyID, label: therapy.TherapyName };
  });

  const skills = selectSkills.filter((skill) => skill.Status == 1);

  const skillList = skills.map((skill) => {
    return { value: skill.SkillID, label: skill.SkillName };
  });

  const onSubmit = async (values) => {
    // if (Array.isArray(values.SkillsIds)) {
    //   await dispatch(
    //     updateContent({
    //       ...values,
    //       SkillsIds: values.SkillsIds.join(","),
    //       Status: true,
    //     })
    //   );
    // } else {
    //   await dispatch(
    //     updateContent({
    //       ...values,
    //       Status: true,
    //     })
    //   );
    // }
    // await dispatch(SelectContent(ContentID));
    const forAdd = (a, b) => a.value === b.value;
    const forDelete = (a, b) => a.value === b.value;
    const onlyInArray1 = (array1, array2, checkFunction) =>
      array1.filter(leftValue => !array2.some(rightValue => checkFunction(leftValue, rightValue)));

    const addedSkills = onlyInArray1(values.SkillIDs, contentInitials.SkillIDs, forAdd).map((ele) => ele.value);
    const removedSkills = onlyInArray1(contentInitials.SkillIDs, values.SkillIDs, forDelete).map((ele) => ele.value);
    const addedTherapy = onlyInArray1(values.TherapyIDs, contentInitials.TherapyIDs, forAdd).map((ele) => ele.value);
    const removedTherapy = onlyInArray1(contentInitials.TherapyIDs, values.TherapyIDs, forDelete).map((ele) => ele.value);


    const valuesToSend = {
      ContentActivityName: values.ContentActivityName,
      ContentActivityDescription: values.ContentActivityDescription,
      ContentCategory: values.ContentCategory,
      AddTherapyIDs: addedTherapy,
      AddSkillIDs: addedSkills,
      RemoveTherapyIDs: removedTherapy,
      RemoveSkillIDs: removedSkills,
      Status: true,
    };

    dispatch(updateContent(valuesToSend))
  };

  useEffect(() => {
    dispatch(getAllTherapies());
    dispatch(fetchAllSkills());
    dispatch(ContentMappingList());
  }, [dispatch]);


  const handleTherapy = (Therapy, setFieldValue) => {
    setSelectedTherapy(Therapy);
    setFieldValue(
      "TherapyIDs",
      Therapy.map((ele) => ele)
    );
  };

  const handleSkill = (Skill, setFieldValue) => {
    setSelectedSkill(Skill);
    setFieldValue(
      "SkillIDs",
      Skill.map((ele) => ele)
    );
  };

  return content === undefined || contentDetailsIsLoadingState ? (
    // return content === null || contentDetailsIsLoadingState || Object.keys(content).length === 0 ? (
    <Loader />
  ) : (
    <div>
      <Formik
        initialValues={contentInitials}
        // validationSchema={contentSchema}
        onSubmit={onSubmit}
      >
        {({
          touched,
          values,
          errors,
          setFieldValue,
          handleSubmit,
          isSubmitting,
        }) => (
          <>
            <Form>
              <div className="mb-4">
                <div className="container-action d-flex justify-content-between">
                  <h3 className="mb-3">
                    {isEdit ? "Edit Details" : "Content Details"}
                  </h3>
                </div>
                <Label
                  className={isEdit ? "form-label required" : "form-label"}
                  htmlFor="activity-name"
                >
                  Content Activity Name
                </Label>
                <Field
                  type="text"
                  name="ContentActivityName"
                  className="form-control"
                  id="activity-name"
                  placeholder="Enter activity name"
                  disabled={isEdit === true ? false : true}
                />
                {errors.ContentActivityName && touched.ContentActivityName ? (
                  <ErrorMessage
                    className="text-danger small"
                    name="ContentActivityName"
                    component="div"
                  />
                ) : null}
              </div>

              <div className="mb-4">
                <Label className="form-label required" htmlFor="activity-desc">
                  Content Activity Description
                </Label>
                <Field
                  as="textarea"
                  rows={3}
                  name="ContentActivityDescription"
                  className="form-control"
                  id="activity-desc"
                  placeholder="Enter Content activity description"
                />
                {errors.ContentActivityDescription &&
                  touched.ContentActivityDescription ? (
                  <ErrorMessage
                    className="text-danger small"
                    name="ContentActivityDescription"
                    component="div"
                  />
                ) : null}
              </div>
              {/* <Row>
                <Col lg='6'>
                  <div className='mb-4'>
                    <Label className='form-label ' htmlFor='conten-id'>
                      Content ID
                    </Label>
                    <Field type='number' name='ContentID' className='form-control' id='content-id' disabled />
                  </div>
                </Col>
                <Col lg='6'>
                </Col>
              </Row> */}
              <div className="mb-4">
                <Label
                  className={isEdit ? "form-label required" : "form-label"}
                  htmlFor="Content-Type"
                >
                  Content Category
                </Label>
                <Field
                  component={Select}
                  id="Content-Type"
                  name="ContentCategory"
                  defaultValue={ContentCategoryDefaultValue}
                  options={ContentCategoryOptions}
                  placeholder="Select"
                  className="basic-multi-select"
                  classNamePrefix="form-control"
                  onChange={(content) => {
                    setFieldValue("ContentType", content.value);
                  }}
                  styles={selectStyles}
                  isDisabled={isEdit === true ? false : true}
                />
                {errors.ContentCategory && touched.ContentCategory ? (
                  <ErrorMessage
                    className="text-danger small"
                    name="ContentCategory"
                    component="div"
                  />
                ) : null}
              </div>
              <div className="mb-4">
                <Label className="form-label required" htmlFor="Therapy-Method">
                  Therapy Methods
                </Label>
                <Field
                  component={Select}
                  isMulti={true}
                  options={therapiesList}
                  value={selectedTherapy}
                  id="Therapy-Method"
                  name="Therapy"
                  placeholder="Select therapy methods"
                  // className="form-control"
                  onChange={(Therapy) => handleTherapy(Therapy, setFieldValue)}
                  styles={selectStyles}
                />
                {errors.Therapy && touched.Therapy ? (
                  <ErrorMessage
                    className="text-danger small"
                    name="Therapy"
                    component="div"
                  />
                ) : null}
              </div>
              <div className="mb-4">
                <Label className="form-label " htmlFor="skillareas">
                  Skill Areas
                </Label>
                <Field
                  name="SkillsIds"
                  component={Select}
                  options={skillList}
                  isMulti
                  value={selectedSkill}
                  onChange={(Skill) => handleSkill(Skill, setFieldValue)}
                  id="skillareas"
                  className="basic-multi-select"
                  // classNamePrefix="react-select"
                  styles={selectStyles}
                  isDisabled={isEdit === true ? false : true}
                />
                {errors.SkillsIds && touched.SkillsIds ? (
                  <ErrorMessage
                    className="text-danger small"
                    name="SkillsIds"
                    component="div"
                  />
                ) : null}
              </div>
              <ul
                className="pager wizard twitter-bs-wizard-pager-link w-100"
                style={{ listStyle: "none" }}
              >
                <li className={"submit"}>
                  {isEdit ? (
                    <>
                      <Button
                        onClick={onCancel}
                        color="primary"
                        className="btn-md m-1 waves-effect waves-light action_btn"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        color="primary"
                        className="btn-md m-1 waves-effect waves-light action_btn"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      color="secondary"
                      className="btn-md waves-effect waves-light action_btn"
                      onClick={() => router.back()}
                    >
                      Back
                    </Button>
                  )}
                </li>
              </ul>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default ViewContentDetails;
