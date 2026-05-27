import { ErrorMessage, Field, Formik } from "formik";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Button, Label } from "reactstrap";
import { ContentTypeoptions } from "../../content-management/common.content";

import { isEmpty } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectUploadImageData, uploadImage } from "../../../store/slice/common.slice";
import { ContentDetails, ContentMappingList, contentDetailsLoading, contentIsLoading, selectContentIsEdit, selectContentMapping, updateContent } from "../../../store/slice/content.slice";
import { fetchAllSkills, selectSkillList } from "../../../store/slice/skills.slice";
import { getAllTherapies, selectTherapiesList } from "../../../store/slice/therapies.slice";
import Loader from "../../shared/loader";
import Configurations from "./configurations.component";
import DropZoneComponent from "./content-dropzone.component";
import TextConfig from "./textConfig.component";

const ContentDetailsComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { ContentID } = router.query;
  const ContentIsEdit = useSelector(selectContentIsEdit);
  const loading = useSelector(contentIsLoading);
  const fileS3url = useSelector(selectUploadImageData);
  const contentLoading = useSelector(contentDetailsLoading);
  const content = useSelector(ContentDetails);
  const Mapping = useSelector(selectContentMapping);
  const AllSkills = useSelector(selectSkillList);
  const AllTherapies = useSelector(selectTherapiesList);
  const [contentInitials, setContentInitials] = useState([]);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [contentConfiguration, setContentConfiguration] = useState(false);

  useEffect(() => {
    dispatch(fetchAllSkills());
    dispatch(getAllTherapies());
    dispatch(ContentMappingList());
  }, [dispatch]);

  //setting skills
  const [selectedSkills, setSelectedSkills] = useState(null);
  const skills = AllSkills.filter((skill) => skill.Status == 1);
  const skillList = skills.map((skill) => {
    return { value: skill.SkillID, label: skill.SkillName };
  });

  const handleMultipleSkill = (selectedSkills, setFieldValue) => {
    setSelectedSkills(selectedSkills);
    setFieldValue(
      "SkillIDs",
      selectedSkills.map((ele) => ele)
    );
  };

  // Therapy
  const [selectedTherapy, setSelectedTherapy] = useState(null);
  const therapies = AllTherapies.filter((therapy) => therapy.Status == 1);
  const therapiesList = therapies.map((therapy) => {
    return { value: therapy.TherapyID, label: therapy.TherapyName };
  });

  const handleTherapy = (Therapy, setFieldValue) => {
    setSelectedTherapy(Therapy);
    setFieldValue(
      "TherapyIDs",
      Therapy.map((ele) => ele)
    );
  };

  const [selectedContentCategory, setSelectedContentCategory] = useState("");

  useEffect(() => {
    setSelectedContentCategory(ContentTypeoptions.find((option) => option.value === content?.ContentCategory));

    const contentTherapyMappings = Mapping?.ContentTherapyMappings ? Mapping?.ContentTherapyMappings?.filter((therapy) => therapy.ContentID == ContentID) : [];
    const contentSkillMappings = Mapping?.ContentSkillMappings ? Mapping?.ContentSkillMappings?.filter((skill) => skill.ContentID == ContentID) : [];

    const MappedTherapy = contentTherapyMappings.map((ele) => {
      return { label: ele.TherapyName, value: ele.TherapyID };
    });
    const MappedSkill = contentSkillMappings.map((ele) => {
      return { label: ele.SkillName, value: ele.SkillID };
    });
    setSelectedTherapy(MappedTherapy);
    setSelectedSkills(MappedSkill);

    setContentInitials({
      ContentID: content ? content.ContentID : "",
      ContentActivityDescription: content ? content.ContentActivityDescription : "",
      ContentActivityName: content ? content.ContentActivityName : "",
      ContentCategory: content ? content.ContentCategory : "",
      ContentDescription: content ? content.ContentDescription : "",
      TherapyIDs: MappedTherapy,
      FileUploadURL: content ? content.FileUploadURL : "",
      SkillIDs: MappedSkill,
    });
  }, [ContentID, Mapping, content]);

  const uploadFileUrl = async (uploadFiles) => {
    if (uploadFiles.length > 0) {
      setFileUploadLoading(true);
      let formData = new FormData();
      formData.append("imageFile", uploadFiles[0]);

      try {
        await dispatch(uploadImage(formData)).unwrap();
        setFileUploadLoading(false);
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        setFileUploadLoading(false);
      }
    }
  };

  const onSubmit = async (values) => {
    const forAdd = (a, b) => a.value === b.value;
    const forDelete = (a, b) => a.value === b.value;
    const onlyInArray1 = (array1, array2, checkFunction) => array1.filter((leftValue) => !array2.some((rightValue) => checkFunction(leftValue, rightValue)));

    const addedSkills = onlyInArray1(values.SkillIDs, contentInitials.SkillIDs, forAdd).map((ele) => ele.value);
    const removedSkills = onlyInArray1(contentInitials.SkillIDs, values.SkillIDs, forDelete).map((ele) => ele.value);
    const addedTherapy = onlyInArray1(values.TherapyIDs, contentInitials.TherapyIDs, forAdd).map((ele) => ele.value);
    const removedTherapy = onlyInArray1(contentInitials.TherapyIDs, values.TherapyIDs, forDelete).map((ele) => ele.value);

    const valuesToSend = {
      ContentID: values.ContentID,
      ContentActivityName: values.ContentActivityName,
      ContentActivityDescription: values.ContentActivityDescription,
      ContentCategory: values.ContentCategory,
      ActivityInstructionTitle: content.ActivityInstructionTitle,
      ActivityInstructionDescription: content.ActivityInstructionDescription,
      AddTherapyIDs: [...new Set(addedTherapy)].length == 0 ? undefined : [...new Set(addedTherapy)],
      AddSkillIDs: [...new Set(addedSkills)].length == 0 ? undefined : [...new Set(addedSkills)],
      RemoveTherapyIDs: [...new Set(removedTherapy)].length == 0 ? undefined : [...new Set(removedTherapy)],
      RemoveSkillIDs: [...new Set(removedSkills)].length == 0 ? undefined : [...new Set(removedSkills)],
      ContentDescription: values.ContentDescription,
      FileUploadURL: fileS3url ? fileS3url : content.FileUploadURL,
      Status: true,
    };
    const filteredObject = {};

    Object.keys(valuesToSend).forEach((key) => {
      const value = valuesToSend[key];
      if (Array.isArray(value)) {
        !isEmpty(value) ? (filteredObject[key] = value) : null;
      } else {
        filteredObject[key] = value;
      }
    });

    dispatch(updateContent(filteredObject));
  };

  return content && !contentLoading && Mapping ? (
    <Formik initialValues={contentInitials} onSubmit={onSubmit} enableReinitialize={true}>
      {({ touched, errors, handleSubmit, resetForm, setFieldValue, isSubmitting, values }) => (
        <>
          {contentConfiguration ? (
            <Configurations setContentConfiguration={setContentConfiguration} fileFormat={content ? content.FileUploadURL : ""} />
          ) : (
            <>
              <fieldset disabled={ContentIsEdit ? false : true}>
                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='activity-name'>
                    Content Activity Name
                  </Label>
                  <Field type='text' name='ContentActivityName' className='form-control' id='activity-name' placeholder='Enter Content activity name' />
                  {errors.ContentActivityName && touched.ContentActivityName ? <ErrorMessage className='text-danger small' name='ContentActivityName' component='div' /> : null}
                </div>

                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='activity-desc'>
                    Content Activity Description
                  </Label>
                  <Field as='textarea' rows={3} name='ContentActivityDescription' className='form-control' id='activity-desc' placeholder='Enter Content activity description' />
                  {errors.ContentActivityDescription && touched.ContentActivityDescription ? <ErrorMessage className='text-danger small' name='ContentActivityDescription' component='div' /> : null}

                </div>

                <div className='mb-4'>
                  <Label className='form-label required' htmlFor='Content-Type'>
                    Content Category
                  </Label>
                  <Field
                    component={Select}
                    id='Content-Type'
                    name='ContentCategory'
                    value={selectedContentCategory}
                    options={ContentTypeoptions}
                    isDisabled={true}
                    placeholder='Select'
                    className='basic-multi-select'
                    classNamePrefix='form-control'
                    onChange={(content) => {
                      setSelectedContentCategory(content);
                      setFieldValue("ContentCategory", content.value);
                    }}
                  />
                  {errors.ContentCategory && touched.ContentCategory ? <ErrorMessage className='text-danger small' name='ContentCategory' component='div' /> : null}
                </div>

                <div className='mb-4'>
                  <Label className='form-label ' htmlFor='Therapy-Method'>
                    Therapy Methods
                  </Label>
                  <Field
                    component={Select}
                    isMulti={true}
                    options={therapiesList}
                    id='Therapy-Method'
                    name='TherapyIDs'
                    placeholder='Select therapy methods'
                    value={selectedTherapy}
                    onChange={(Therapy) => handleTherapy(Therapy, setFieldValue)}
                    isDisabled={ContentIsEdit ? false : true}
                  />

                  {errors.TherapyIDs && touched.TherapyIDs ? <ErrorMessage className='text-danger small' name='TherapyIDs' component='div' /> : null}
                </div>

                <div className='mb-4'>
                  <Label className='form-label ' htmlFor='Skills'>
                    Skills
                  </Label>
                  <Field
                    component={Select}
                    name='SkillIDs'
                    value={selectedSkills}
                    isMulti={true}
                    onChange={(selectedOption) => handleMultipleSkill(selectedOption, setFieldValue)}
                    options={skillList}
                    classNamePrefix='select2-selection'
                    isDisabled={ContentIsEdit ? false : true}
                  />
                  {errors.SkillIDs && touched.SkillIDs ? <ErrorMessage className='text-danger small' name='SkillIDs' component='div' /> : null}
                </div>

                {values.ContentCategory
                  !== "VR" ? values.ContentCategory === "Text" ? (
                    <>
                      <Field
                        component={TextConfig}
                        label='Content Description'
                        name='Content Description'
                        value={values.ContentDescription}
                        setValue={(value) => setFieldValue("ContentDescription", value)}
                        placeholder='Enter text description ...'
                      />
                      <label className='form-label' style={{ display: "flex", justifyContent: "flex-end", marginTop: "-20px" }}>Characters ({values.ContentDescription?.length ? values.ContentDescription?.length : 0}/3000)</label>
                    </>
                  ) : (
                  <div className='mb-4'>
                    <Label className='form-label' htmlFor='vendor-logo'>
                      File Upload
                    </Label>

                    {ContentIsEdit ? (
                      <DropZoneComponent
                        setContentConfiguration={setContentConfiguration}
                        multiFiles={false}
                        name='FileUploadURL'
                        isUploading={fileUploadLoading}
                        fileData={uploadFileUrl}
                        displayName={values?.FileUploadURL}
                        content={content}
                      />
                    ) : values?.FileUploadURL ? (
                      <div>
                        <Link href={`${values?.FileUploadURL}`} passHref>
                          <a target='_blank' className='waves-effect waves-light m-2 ml-3 mt-3 btn-primary btn-sm'>
                            View Files
                          </a>
                        </Link>
                      </div>
                    ) : (
                      <div className='m-2'>-Nil-</div>
                    )}
                    {errors.FileUploadURL && touched.FileUploadURL ? <ErrorMessage className='text-danger small' name='FileUploadURL' component='div' /> : null}
                  </div>
                ) : null}
              </fieldset>
              {ContentIsEdit ? (
                <div className='container-action d-flex justify-content-end pb-1'>
                  <button type='button' onClick={() => router.back()} className='btn btn-light btn-md waves-effect waves-light action_btn'>
                    Cancel
                  </button>

                  <Button type='submit' onClick={handleSubmit} disabled={loading} className='btn btn-primary btn-md waves-effect waves-light action_btn ml-2'>
                    Save
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </>
      )}
    </Formik>
  ) : (
    <Loader />
  );
};

export default ContentDetailsComponent;
