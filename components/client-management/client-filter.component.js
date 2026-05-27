import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { setFilterData } from "../../store/slice/client.slice";
import { getAllSubscriptionPlans, selectSubscriptionPlans } from "../../store/slice/subscription.slice";

function FilterModal() {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [orgType, setOrgType] = useState("");
  const [clientType, setClientType] = useState("");
  const [plan, setPlan] = useState("");
  const SubscriptionPlans = useSelector(selectSubscriptionPlans);

  useEffect(() => {
    dispatch(getAllSubscriptionPlans());
  }, [dispatch]);

  const tog_standard = () => {
    setModalOpen(!modalOpen);
    removeBodyCss();
  };

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const onHandleOrganizationType = (e) => setOrgType(e.target.value);
  const onHandleClientType = (e) => setClientType(e.target.value);
  const onHandlePlan = (e) => (isNaN(parseInt(e.target.value)) ? setPlan(parseInt("")) : setPlan(parseInt(e.target.value)));

  const onFilterSubmit = () => {
    const ValuestoFilter = { OrganizationType: orgType, ClientType: clientType, SubscriptionPlanId: plan };
    const filteredObject = Object.keys(ValuestoFilter).reduce((acc, key) => {
      if (ValuestoFilter[key] !== "") {
        acc[key] = ValuestoFilter[key];
      }
      return acc;
    }, {});
    dispatch(setFilterData(filteredObject));
    setModalOpen(false);
  };
  const onFilterCancel = () => {
    setOrgType("");
    setClientType("");
    setPlan("");
    dispatch(setFilterData({}));
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
          <Row>
            <Col md={6}>
              <div className='mb-4'>
                <label className='form-label required'>Organization Type</label>
                <select className='form-select' value={orgType} onChange={onHandleOrganizationType}>
                  <option value=''>Select</option>
                  <option>Government</option>
                  <option>Private</option>
                  <option>NGO</option>
                </select>
              </div>
            </Col>
            <Col md={6}>
              <div className='mb-4'>
                <label className='form-label required'>Client Type</label>
                <select className='form-select' value={clientType} onChange={onHandleClientType}>
                  <option value=''>Select</option>
                  <option>Clinics</option>
                  <option>Hospitals</option>
                  <option>Special Education Centers</option>
                  <option>Special Schools</option>
                  <option>Bud School</option>
                  <option>Autism Schools</option>
                </select>
              </div>
            </Col>
          </Row>
          <div className='mb-4'>
            <label className='form-label required'>Subscription Plan</label>
            <select className='form-select' value={plan} onChange={onHandlePlan}>
              <option value=''>Select</option>
              {SubscriptionPlans.map((plan) => (
                <option key={plan.SubscriptionPlanID} value={plan.SubscriptionPlanID}>
                  {plan.PlanName}
                </option>
              ))}
            </select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type='button' onClick={onFilterCancel} color='light' className='waves-effect'>
            Cancel
          </Button>
          <Button type='button' color='primary' className='waves-effect waves-light' onClick={onFilterSubmit}>
            Apply
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
export default FilterModal;
