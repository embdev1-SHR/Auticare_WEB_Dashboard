import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { fetchAllCenters, selectCenterList } from "../../store/slice/center.slice";
import { getAllDepartments, selectDepartmentList } from "../../store/slice/department.slice";
import { setTherapistFilterData } from "../../store/slice/therapist.slice";
import FACILITATORS from "../../constants/facilitators.constant";

function TherapistFilterModal() {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [center, setCenter] = useState("");
  const [dept, setDept] = useState("");
  const [therapistType, setTherapistType] = useState("");

  useEffect(() => {
    dispatch(fetchAllCenters());
    dispatch(getAllDepartments());
  }, [dispatch]);

  const centerListState = useSelector(selectCenterList);
  const CentersBystatus = centerListState.filter((center) => center.Status == 1);
  const departmentList = useSelector(selectDepartmentList);

  const onHandleCenter = (e) => (isNaN(parseInt(e.target.value)) ? setCenter(parseInt("")) : setCenter(parseInt(e.target.value)));
  const onHandleDepartment = (e) => (isNaN(parseInt(e.target.value)) ? setDept(parseInt("")) : setDept(parseInt(e.target.value)));
  const onHandleTherapistType = (e) => setTherapistType(e.target.value);

  const onFilterSubmit = () => {
    const ValuestoFilter = { CenterID: center, DepartmentID: dept, TherapistType: therapistType };
    const filteredObject = Object.keys(ValuestoFilter).reduce((acc, key) => {
      if (ValuestoFilter[key] !== "") {
        acc[key] = ValuestoFilter[key];
      }
      return acc;
    }, {});
    // console.log(filteredObject);
    dispatch(setTherapistFilterData(filteredObject));
    setModalOpen(false);
  };
  const onFilterCancel = () => {
    setCenter("");
    setDept("");
    setTherapistType("");
    dispatch(setTherapistFilterData({}));
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
                <label className='form-label required'>Center</label>
                <select className='form-select' value={center} onChange={onHandleCenter}>
                  <option value=''>Select</option>
                  {CentersBystatus.map((cent) => (
                    <option key={cent.CenterID} value={cent.CenterID}>
                      {cent.CenterName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='mb-4'>
                <label className='form-label required'>Department</label>
                <select className='form-select' value={dept} onChange={onHandleDepartment}>
                  <option value=''>Select</option>
                  {departmentList.map((depts) => (
                    <option key={depts.DepartmentID} value={depts.DepartmentID}>
                      {depts.DepartmentName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className='mb-4'>
            <label className='form-label required'>Facilitator</label>
            <select className='form-control' value={therapistType} onChange={onHandleTherapistType}>
              <option value=''>Select</option>
              {FACILITATORS.map((item, key) => <option key={key}>{item.label}</option>)}
            </select>
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
export default TherapistFilterModal;
