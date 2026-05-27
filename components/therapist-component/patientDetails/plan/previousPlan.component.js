import { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const PreviousPlan = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Button type='button' onClick={() => setModalOpen(!modalOpen)} color='secondary' className='waves-effect waves-light '>
        Previous Plan
      </Button>
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} scrollable={true} className='modal right app_modal'>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}> Previous Plan</ModalHeader>
        <ModalBody>
          <table className='table table-bordered dt-responsive nowrap hide_length' style={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}>
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Duration</th>
                <th>Completion %</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Primary Plan</td>
                <td>1 Week</td>
                <td>70 %</td>
                <td>
                  <Button size='sm' color='primary'>
                    View Details
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <Button type='button' color='light' className='btn-md m-1 waves-effect waves-light action_btn'>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default PreviousPlan;
