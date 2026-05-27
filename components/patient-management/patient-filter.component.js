import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { getAllDepartments, selectDepartmentList } from "../../store/slice/department.slice";
import { setPatientFilterData } from "../../store/slice/patient.slice";
import { getAllTherapists, selectTherapistList } from "../../store/slice/therapist.slice";

function PatientFilterModal() {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [department, setDepartment] = useState("");
  const [therapist, setTherapist] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const departmentList = useSelector(selectDepartmentList);
  const TherapistList = useSelector(selectTherapistList);

  useEffect(() => {
    dispatch(getAllDepartments());
    dispatch(getAllTherapists());
  }, [dispatch]);

  const tog_standard = () => {
    setModalOpen(!modalOpen);

    removeBodyCss();
  };
  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const onHandleDepartment = (e) => (isNaN(parseInt(e.target.value)) ? setDepartment("") : setDepartment(parseInt(e.target.value)));
  const onHandleTherapist = (e) => (isNaN(parseInt(e.target.value)) ? setTherapist("") : setTherapist(parseInt(e.target.value)));
  const onHandleGender = (e) => setGender(e.target.value);
  const onHandleAge = (e) => (isNaN(parseInt(e.target.value)) ? setAge("") : setAge(parseInt(e.target.value)));
  const onFilterSubmit = () => {
    const ValuestoFilter = { DepartmentID: department, TherapistID: therapist, Age: age, Gender: gender };
    const filteredObject = Object.keys(ValuestoFilter).reduce((acc, key) => {
      if (ValuestoFilter[key] !== "") {
        acc[key] = ValuestoFilter[key];
      }
      return acc;
    }, {});
    dispatch(setPatientFilterData(filteredObject));
    setModalOpen(false);
  };
  const onFilterCancel = () => {
    setDepartment("");
    setTherapist("");
    setAge("");
    setGender("");
    dispatch(setPatientFilterData({}));
    setModalOpen(false);
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
                <label className='form-label '>Department</label>
                <select className='form-control' value={department} onChange={onHandleDepartment}>
                  <option value=''>Select</option>
                  {departmentList.map((depts) => (
                    <option key={depts.DepartmentID} value={depts.DepartmentID}>
                      {depts.DepartmentName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='mb-4'>
                <label className='form-label '>Therapist</label>
                <select className='form-control' value={therapist} onChange={onHandleTherapist}>
                  <option value=''>Select</option>
                  {TherapistList.map((ele) => (
                    <option key={ele.TherapistID} value={ele.TherapistID}>
                      {ele.Salutation + " " + ele.Name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <div className='mb-4'>
                <label className='form-label '>Age</label>
                <input type='number' value={age} onChange={onHandleAge} name='Age' placeholder='Age' className='form-control' />
              </div>
            </div>
            <div className='col-md-6'>
              <div className='mb-4'>
                <label className='form-label '>Gender</label>
                <select className='form-control' value={gender} onChange={onHandleGender}>
                  <option value=''>Select</option>
                  <option>Female</option>
                  <option>Male</option>
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
export default PatientFilterModal;
