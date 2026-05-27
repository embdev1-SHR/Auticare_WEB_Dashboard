import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { setContentFilterData } from "../../store/slice/content.slice";
import { selectSkillList } from "../../store/slice/skills.slice";

function ContentFilterModal() {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [contentType, setContenttype] = useState("");
  const [skillarea, setSkillArea] = useState("");
  const selectskills = useSelector(selectSkillList);
  let SelectSkillBystatus = selectskills.filter((skill) => skill.Status == 1);

  const onHandleSkill = (e) => (isNaN(parseInt(e.target.value)) ? setSkillArea(parseInt("")) : setSkillArea(parseInt(e.target.value)));
  const onHandleType = (e) => setContenttype(e.target.value);

  const onFilterSubmit = () => {
    const ValuestoFilter = { ContentCategory: contentType, SkillID: skillarea };
    const filteredObject = Object.keys(ValuestoFilter).reduce((acc, key) => {
      if (ValuestoFilter[key] !== "") {
        acc[key] = ValuestoFilter[key];
      }
      return acc;
    }, {});
    dispatch(setContentFilterData(filteredObject));
    setModalOpen(false);
  };
  const onFilterCancel = () => {
    setContenttype("");
    setSkillArea("");
    dispatch(setContentFilterData({}));
    setModalOpen(false);
  };

  const tog_standard = () => {
    setModalOpen(!modalOpen);
    removeBodyCss();
  };
  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };
  return (
    <>
      <Button type='button' onClick={tog_standard} color='light' className='waves-effect waves-light'>
        <i className='ri-filter-3-line align-middle mr-2'></i> Filter
      </Button>
      <Modal isOpen={modalOpen} toggle={tog_standard}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>Filter</ModalHeader>
        <ModalBody>
          <div className='row'>
            <div className='col-md-6'>
              <div className='mb-4'>
                <label className='form-label required'>Content Category</label>
                <select className='form-control' value={contentType} onChange={onHandleType}>
                  <option value=''>Select</option>
                  <option>Audio</option>
                  <option>Image</option>
                  <option>Text</option>
                  <option>Video</option>
                  <option>VR</option>
                </select>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='mb-4'>
                <label className='form-label required'>Skill Areas</label>
                <select className='form-control' value={skillarea} onChange={onHandleSkill}>
                  <option value=''>Select</option>
                  {SelectSkillBystatus.map((skill) => (
                    <option key={skill.SkillID} value={skill.SkillID}>
                      {skill.SkillName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type='button' onClick={onFilterCancel} color='light' className='waves-effect'>
            Cancel
          </Button>
          <Button type='button' onClick={onFilterSubmit} color='primary' className='waves-effect waves-light'>
            Apply
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
export default ContentFilterModal;
