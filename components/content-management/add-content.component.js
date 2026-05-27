import { useState } from "react";
import Select from "react-select";

import { ErrorMessage, Field, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { contentIsLoading, createContent } from "../../store/slice/content.slice";
import { selectSetModalOpenState, setModalOpen } from "../../store/slice/layout.slice";
import { selectSkillList } from "../../store/slice/skills.slice";
import { selectTherapiesList } from "../../store/slice/therapies.slice";

import { selectUploadImageData, uploadImage } from "../../store/slice/common.slice";
import CloseSweetAlert from "../shared/close-sweetalert";
import { ContentTypeoptions, contentSchema } from "./common.content";
import { selectUserData } from "../../store/slice/auth.slice";
import { ToastNotification } from "../shared/toast";

function AddContent() {
  const dispatch = useDispatch();
  const setModalOpenState = useSelector(selectSetModalOpenState);
  const loading = useSelector(contentIsLoading);
  const UserData = useSelector(selectUserData);
  const uploadImageData = useSelector(selectUploadImageData);
  const selectskills = useSelector(selectSkillList);

  const setModalOpenStte = useSelector(selectTherapiesList);

  const TherapiesList = setModalOpenStte.map((Therapies) => {
    return { value: Therapies.TherapyID, label: Therapies.TherapyName };
  });
  const contentListState = useSelector((state) => state.content.contents);
  let SelectContentBystatus = contentListState.filter((content) => content.Status == 1);
  let SelectContentByType = SelectContentBystatus.filter((skill) => skill.ContentType === "Custom");




  const skills = selectskills.filter((skill) => skill.Status == 1);

  const skilllist = skills.map((skill) => {
    return { value: skill.SkillID, label: skill.SkillName };
  });

  const [fileLoading, setFileLoading] = useState(false);
  const tog_standard = () => {
    if (UserData.RoleName != "SuperAdmin") {
      if (SelectContentByType.length >= UserData.SubscriptionPlan[0].NumberofCustomContents) {
        ToastNotification("error", "The number of contents allowed in the subscription plan is already created");
      }
      else {
        dispatch(setModalOpen(!setModalOpenState));
      }
    }
    else {
      dispatch(setModalOpen(!setModalOpenState));
    }  };

  const selectStyles = {
    control: (styles) => ({ ...styles, borderColor: " #e8eaed;" }),
  };

  const onSubmit = async (values) => {
    const valuesToSend = {
      ContentActivityName: values.ContentActivityName,
      ContentActivityDescription: values.ContentActivityDescription,
      ContentCategory: values.ContentType,
      TherapyIDs: values.TherapyIDs.length == 0 ? undefined : values.TherapyIDs,
      SkillIDs: values.SkillsIds.length == 0 ? undefined : values.SkillsIds,
    };
    dispatch(createContent(valuesToSend));
  };

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
        Add Content
      </Button>
      <Formik
        initialValues={{
          ContentActivityName: "",
          ContentActivityDescription: "",
          ContentType: "",
          TherapyIDs: [],
          SkillsIds: [],
        }}
        validationSchema={contentSchema}
        onSubmit={onSubmit}>
        {({ touched, errors, handleSubmit, resetForm, setFieldValue, isSubmitting }) => (
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
              Create Content
            </ModalHeader>

            <ModalBody>
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
                  name='ContentType'
                  options={ContentTypeoptions}
                  placeholder='Select'
                  // className="form-control"
                  className='basic-multi-select'
                  classNamePrefix='form-control'
                  onChange={(content) => {
                    setFieldValue("ContentType", content.value);
                  }}
                  styles={selectStyles}
                />
                {errors.ContentType && touched.ContentType ? <ErrorMessage className='text-danger small' name='ContentType' component='div' /> : null}
              </div>

              <div className='mb-4'>
                <Label className='form-label ' htmlFor='Therapy-Method'>
                  Therapy Methods
                </Label>
                <Field
                  component={Select}
                  isMulti={true}
                  options={TherapiesList}
                  id='Therapy-Method'
                  name='TherapyIDs'
                  placeholder='Select therapy methods'
                  // className="form-control"
                  onChange={(Therapy) => {
                    setFieldValue(
                      "TherapyIDs",
                      Therapy.map((Therapy) => Therapy.value)
                    );
                  }}
                  styles={selectStyles}
                />

                {errors.TherapyIDs && touched.TherapyIDs ? <ErrorMessage className='text-danger small' name='TherapyIDs' component='div' /> : null}
              </div>

              <div className='mb-4'>
                <Label className='form-label ' htmlFor='skillareas'>
                  Skill Areas
                </Label>
                <Field
                  name='SkillsIds'
                  component={Select}
                  options={skilllist}
                  isMulti
                  onChange={(skills) => {
                    setFieldValue(
                      "SkillsIds",
                      skills.map((skill) => skill.value)
                    );
                  }}
                  placeholder='Select a skill'
                  id='skillareas'
                  className='basic-multi-select'
                  classNamePrefix='form-control'
                  styles={selectStyles}
                />

                {errors.SkillsIds && touched.SkillsIds ? <ErrorMessage className='text-danger small' name='SkillsIds' component='div' /> : null}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type='submit' color='primary' className='btn-md m-1 waves-effect waves-light action_btn' onClick={handleSubmit} disabled={loading}>
                Submit
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Formik>
    </>
  );
}
export default AddContent;
