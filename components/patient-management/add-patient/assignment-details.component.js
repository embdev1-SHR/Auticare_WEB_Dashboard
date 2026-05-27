import { ErrorMessage, Field, useFormikContext } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Col, Label, Row } from "reactstrap";
import {
  fetchAllCenters,
  selectCenterList,
} from "../../../store/slice/center.slice";
import {
  getAllDepartments,
  selectDepartmentList,
} from "../../../store/slice/department.slice";
import {
  getAllTherapists,
  selectTherapistList,
} from "../../../store/slice/therapist.slice";

function AssignmentDetails({ access }) {
  const { errors, touched, setFieldValue } = useFormikContext();
  const { isTherapistManagementAccess, isCenterManagementAccess } = access;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllDepartments());
    if (isCenterManagementAccess) {
      dispatch(fetchAllCenters());
    }

    if (isTherapistManagementAccess) {
      dispatch(getAllTherapists());
    }
  }, []);
  const departments = useSelector(selectDepartmentList);
  const departmentList = departments?.map((department) => {
    return { value: department.DepartmentID, label: department.DepartmentName };
  });
  const centers = useSelector(selectCenterList);
  const centerList = centers?.map((center) => {
    return { value: center.CenterID, label: center.CenterName };
  });
  const therapists = useSelector(selectTherapistList);
  const therapistList = therapists?.map((therapist) => {
    return { value: therapist.TherapistID, label: therapist.Name };
  });

  return (
    <>
      <Row>
        {isCenterManagementAccess ? (
          <Col lg="6">
            <div className="mb-4">
              <Label className="form-label required" htmlFor="center">
                Center
              </Label>
              <Field
                component={Select}
                options={centerList}
                id="Center"
                name="Center"
                placeholder="Select"
                isSearchable={true}
                onChange={(center) => {
                  setFieldValue("Center", center.value);
                }}
                styles={{
                  control: (styles) => ({
                    ...styles,
                    borderColor: " #e8eaed;",
                    borderRadius: "0.375rem",
                  }),
                }}
              />
              {errors.Center && touched.Center ? (
                <ErrorMessage
                  className="text-danger small"
                  name="Center"
                  component="div"
                />
              ) : null}
            </div>
          </Col>
        ) : null}
        {isTherapistManagementAccess ? (
          <Col lg="6">
            <div className="mb-4">
              <Label className="form-label required" htmlFor="Therapist">
                Therapist
              </Label>
              <Field
                component={Select}
                options={therapistList}
                id="Therapist"
                name="Therapist"
                placeholder="Select"
                isSearchable={true}
                isMulti={false}
                onChange={(therapist) => {
                  setFieldValue("Therapist", therapist.value);
                }}
                styles={{
                  control: (styles) => ({
                    ...styles,
                    borderColor: " #e8eaed;",
                    borderRadius: "0.375rem",
                  }),
                }}
              />
              {errors.Therapist && touched.Therapist ? (
                <ErrorMessage
                  className="text-danger small"
                  name="Therapist"
                  component="div"
                />
              ) : null}
            </div>
          </Col>
        ) : null}
      </Row>
      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="Departments">
              Departments
            </Label>
            <Field
              component={Select}
              options={departmentList}
              id="Departments"
              name="Departments"
              placeholder="Select"
              isSearchable={true}
              isMulti={false}
              onChange={(dept) => {
                setFieldValue("Departments", dept.value);
              }}
              styles={{
                control: (styles) => ({
                  ...styles,
                  borderColor: " #e8eaed;",
                  borderRadius: "0.375rem",
                }),
              }}
            />
            {errors.Departments && touched.Departments ? (
              <ErrorMessage
                className="text-danger small"
                name="Departments"
                component="div"
              />
            ) : null}
          </div>
        </Col>
      </Row>
    </>
  );
}

export default AssignmentDetails;
