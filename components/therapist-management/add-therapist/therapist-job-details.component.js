import { ErrorMessage, Field, useFormikContext } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Col, Label, Row } from "reactstrap";
import { selectRole, selectRoleBasedModules, selectUserData } from "../../../store/slice/auth.slice";
import {
  getAllDepartments,
  selectDepartmentList,
} from "../../../store/slice/department.slice";
import FACILITATORS from "../../../constants/facilitators.constant";

function TherapistJobDetails() {
  const { errors, values, touched, setFieldValue } = useFormikContext();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllDepartments());
  }, []);
  const departments = useSelector(selectDepartmentList);
  const roleBasedModules = useSelector(selectRoleBasedModules);
  const role = useSelector(selectRole);
  const userData = useSelector(selectUserData);
  const departmentList = departments?.map((department) => {
    return { value: department.DepartmentID, label: department.DepartmentName };
  });
  const centers = useSelector((state) => state.center.centers);
  const centerList = centers?.map((center) => {
    return { value: center.CenterID, label: center.CenterName };
  });

  useEffect(() => {
    if (values.TherapistType !== "")
      setFieldValue("FacilitatorType", values.TherapistType);
  }, [values.TherapistType]);

  useEffect(() => {
    if (role === "Center" && centers?.length > 0) {
      const myCenter = centers.find((c) => c.UserID === userData?.UserID);
      if (myCenter) setFieldValue("CenterID", myCenter.CenterID);
    }
  }, [role, centers, userData?.UserID]);

  return (
    <>
      <Row>
        {role === "Center" ? (
          <Col lg="6">
            <div className="mb-4">
              <Label className="form-label" htmlFor="CenterID">Center</Label>
              <input
                type="text"
                className="form-control bg-light"
                readOnly
                value={centers?.find((c) => c.UserID === userData?.UserID)?.CenterName || "Your Center"}
              />
            </div>
          </Col>
        ) : roleBasedModules.some((module) => module.ModuleName === "CenterManagement") ? (
          <Col lg="6">
            <div className="mb-4">
              <Label className="form-label required" htmlFor="CenterID">
                Center
              </Label>
              <Field
                component={Select}
                options={centerList}
                id="CenterID"
                name="CenterID"
                placeholder="Select"
                isSearchable={true}
                onChange={(center) => {
                  setFieldValue("CenterID", center.value);
                }}
                styles={{
                  control: (styles) => ({
                    ...styles,
                    borderColor: " #e8eaed;",
                    borderRadius: "0.375rem",
                  }),
                }}
              />
              {errors.CenterID && touched.CenterID ? (
                <ErrorMessage
                  className="text-danger small"
                  name="CenterID"
                  component="div"
                />
              ) : null}
            </div>
          </Col>
        ) : null}
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="DepartmentID">
              Department
            </Label>

            <Field
              component={Select}
              options={departmentList}
              id="DepartmentID"
              name="DepartmentID"
              placeholder="Select"
              isSearchable={true}
              onChange={(dept) => {
                setFieldValue("DepartmentID", dept.value);
              }}
              styles={{
                control: (styles) => ({
                  ...styles,
                  borderColor: " #e8eaed;",
                  borderRadius: "0.375rem",
                }),
              }}
            />
            {errors.DepartmentID && touched.DepartmentID ? (
              <ErrorMessage
                className="text-danger small"
                name="DepartmentID"
                component="div"
              />
            ) : null}
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="designation">
              Designation
            </Label>
            <Field
              type="text"
              className="form-control"
              id="designation"
              name="Designation"
              placeholder="Enter designation"
            />
            {errors.Designation && touched.Designation ? (
              <ErrorMessage
                className="text-danger small"
                name="Designation"
                component="div"
              />
            ) : null}
          </div>
        </Col>
        <Col lg="6">
          <div className="mb-4">
            <Label className="form-label required" htmlFor="language">
              Language
            </Label>
            <Field
              type="text"
              className="form-control"
              id="language"
              name="Language"
              placeholder="Enter language"
            />
            {errors.Language && touched.Language ? (
              <ErrorMessage
                className="text-danger small"
                name="Language"
                component="div"
              />
            ) : null}
          </div>
        </Col>
      </Row>

      <div className="mb-4">
        <Label className="form-label required" htmlFor="TherapistType">
          Facilitator
        </Label>

        <Field
          component={Select}
          options={FACILITATORS}
          id="TherapistType"
          name="TherapistType"
          placeholder="Select"
          isSearchable={true}
          onChange={(therapist) => {
            setFieldValue("TherapistType", therapist.value);
          }}
          styles={{
            control: (styles) => ({
              ...styles,
              borderColor: " #e8eaed;",
              borderRadius: "0.375rem",
            }),
          }}
        />
        {errors.TherapistType && touched.TherapistType ? (
          <ErrorMessage
            className="text-danger small"
            name="TherapistType"
            component="div"
          />
        ) : null}
      </div>
    </>
  );
}
export default TherapistJobDetails;
