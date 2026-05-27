import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Label, Badge } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { selectTherapy, selectTherapyView, setViewModalState } from "../../store/slice/therapies.slice";
import { selectTherapySkillGoal } from "../../store/slice/therapies.slice"

function ViewTherapyDetail() {
  const dispatch = useDispatch();
  let TherpyMethod = useSelector(selectTherapy);
  const modalViewState = useSelector(selectTherapyView);
  const TherapiesSkillGoal = useSelector(selectTherapySkillGoal);

  const toggle_modal = () => {
    dispatch(setViewModalState(!modalViewState));
    removeBodyCss();
  };
  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };
  const addMapData = (Contend, field) => {
    const data = TherapiesSkillGoal[field]?.filter((f) => f.TherapyID === Contend.TherapyID)
    return { ...Contend, [field]: data }
  }
  TherpyMethod = TherpyMethod.map(contend => addMapData(contend, "Goals"))
  TherpyMethod = TherpyMethod.map(contend => addMapData(contend, "TherapySkillMappings"))





  return (
    TherpyMethod.length > 0 && (
      <Modal isOpen={modalViewState} toggle={toggle_modal}>
        <ModalHeader toggle={toggle_modal}> Therapy Details</ModalHeader>
        <ModalBody>
          <div className='mb-4 form-group'>
            <Label className='form-label ' htmlFor='TherapyName'>
              Therapy Name
            </Label>
            <div id='TherapyName' className='border p-2'>
              {TherpyMethod[0]?.TherapyName}
            </div>
          </div>

          <div className='mb-4 form-group'>
            <Label className='form-label ' htmlFor='age-group'>
              Age Category
            </Label>
            <div id='AgeGroup' className='border p-2'>
              {TherpyMethod[0]?.AgeGroup}
            </div>
          </div>

          <div className='mb-4'>
            <Label className='form-label' htmlFor='therapy-id'>
              Therapy ID
            </Label>
            <div className='border p-2' id='TherapyID'>
              {TherpyMethod[0]?.TherapyID}
            </div>
          </div>
          <div className='mb-4 form-group'>
            <Label className='form-label ' htmlFor='Skills'>
              Skills
            </Label>

            <div type='text' id='Skills' className='border p-2'>
            {TherpyMethod[0]?.Goals?.map((Goal, key) => {
                return (<Badge key={key} className={"font-size-12 badge-soft-success me-1"} color={"info"} pill>
                  {Goal?.GoalName}
                </Badge>)
              })}
              </div>
          </div>
          <div className='mb-4 form-group'>
            <Label className='form-label ' htmlFor='Goals'>
              Goals
            </Label>

            <div type='text' id='Goals' className='border p-2'>
            {TherpyMethod[0]?.TherapySkillMappings?.map((Therapies, key) => {
                return (<Badge key={key} className={"font-size-12 badge-soft-info me-1"} color={"info"} pill>
                  {Therapies?.SkillName}
                </Badge>)
              })}
              </div>
          </div>
        </ModalBody>
      </Modal>
    )
  );
}
export default ViewTherapyDetail;
