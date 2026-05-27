
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from "reactstrap";
import {
  selectSetModalOpenState,
  setModalOpen,
} from "../../store/slice/layout.slice";

function AddRole() {
  const dispatch = useDispatch();
  const setModalOpenState = useSelector(selectSetModalOpenState);

  const tog_standard = () => {
    dispatch(setModalOpen(!setModalOpenState));
  };

  return (
    <>
      <Button
        type="button"
        onClick={tog_standard}
        color="primary"
        className="waves-effect waves-light"
      >
        Create Roles
      </Button>
      <Modal
        isOpen={setModalOpenState}
        toggle={tog_standard}
        scrollable={true}
        className="modal right app_modal"
      >
        <ModalHeader toggle={() => dispatch(setModalOpen(!setModalOpenState))}>
          Create Roles
        </ModalHeader>
        <ModalBody>
          <div className="mb-4">
            <Label className="form-label required" htmlFor="role-name">
              Role Name
            </Label>
            <Input
              type="text"
              className="form-control"
              id="role-name"
              placeholder="Enter role name"
            />
          </div>
          <div className="mb-4">
            <Label className="form-label required" htmlFor="permissions">
              Permissions
            </Label>

            <div className="table-responsive">
              <Table className="table align-middle mb-0 table-nowrap permission-list">
                <thead className="bg-light" style={{ fontSize: "0.7rem" }}>
                  <tr>
                    <th style={{ width: "120px" }}>Module name</th>
                    <th className="text-center">permission</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Scale Module</td>
                    <td style={{ width: "90px" }} className="text-center">
                      <div className="form-check form-check-right mr-3">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="check1"
                        />
                        <Label className="form-check-label" htmlFor="check1">
                          Read
                        </Label>
                      </div>
                      <div className="form-check form-check-right mr-3">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="check2"
                        />
                        <Label className="form-check-label" htmlFor="check2">
                          Write
                        </Label>
                      </div>
                      <div className="form-check form-check-right mr-3">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="check3"
                        />
                        <Label className="form-check-label" htmlFor="check3">
                          Delete
                        </Label>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>Assessment Module</td>
                    <td style={{ width: "90px" }} className="text-center">
                      <div className="form-check form-check-right mr-3">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="checkB1"
                        />
                        <Label className="form-check-label" htmlFor="checkB1">
                          Read
                        </Label>
                      </div>
                      <div className="form-check form-check-right mr-3">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="checkB2"
                        />
                        <Label className="form-check-label" htmlFor="checkB2">
                          Write
                        </Label>
                      </div>
                      <div className="form-check form-check-right mr-3">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="checkB3"
                        />
                        <Label className="form-check-label" htmlFor="checkB3">
                          Delete
                        </Label>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            color="primary"
            className="btn-md m-1 waves-effect waves-light action_btn"
          >
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
export default AddRole;
