import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { updatePatientAssessmentSlice } from "../../../../store/slice/patient.slice";
import Alert from "../../../shared/alert";

const ScreeningListActions = ({ PatientMetric }) => {
  const [data, setdata] = useState();
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    if (PatientMetric.CompletionStatus == null || PatientMetric.CompletionStatus == "Pending") {
      setdata(true);
    }
    else {
      setdata(false);
    }

  }, [PatientMetric]);

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter()
  function handleViewDetails() {
    if (PatientMetric.CompletionStatus == null) {
      router.push(`${PatientMetric.PatientID}/scales/${PatientMetric.ScaleID}/${PatientMetric.ScaleMetricType.toLowerCase()}/${PatientMetric.PatientMetricID}`)
    }
    else {
      router.push(`${PatientMetric.PatientID}/scales/${PatientMetric.ScaleID}/${PatientMetric.ScaleMetricType.toLowerCase()}/${PatientMetric.PatientMetricID}/result`)
    }
  }
  function createFormatDate(date) {
    return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
  }

  const onHandleDelete = async () => {
    setAlert(true);
  };

  const onDelete = (id) => {
    setAlert(false);
  };

  const onHandleConfirm = async () => {
    const data = {
      "ScheduleStartDate": PatientMetric.ScheduleStartDate ? createFormatDate(PatientMetric.ScheduleStartDate) : undefined,
      "ScheduleEndDate": moment.isDate(PatientMetric.ScheduleEndDate) ? createFormatDate(PatientMetric.ScheduleEndDate) : undefined,
      "ActualStartDate": moment.isDate(PatientMetric.ActualStartDate) ? createFormatDate(PatientMetric.ActualStartDate) : undefined,
      "ActualEndDate": moment.isDate(PatientMetric.ActualEndDate) ? createFormatDate(PatientMetric.ActualEndDate) : undefined,
      "CompletionStatus": PatientMetric.CompletionStatus,
      "Status": 0
    }
    const valueToSend = {
      data,
      "PatientID": PatientMetric.PatientID,
      "PatientMetricID": PatientMetric.PatientMetricID,
      setAlert
    }
    dispatch(updatePatientAssessmentSlice(valueToSend));
  };

  return (PatientMetric.CompletionStatus == "Cancelled" ||
    <>
      <Dropdown direction="right" isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle color="light" className="btn-rounded more_vert_btn" caret>
          <i className="mdi mdi-dots-vertical"></i>
        </DropdownToggle>
        <DropdownMenu style={{ marginBottom: -40 }}>
          <DropdownItem onClick={handleViewDetails}>{data ? "View Details" : "View Results"}</DropdownItem>
          <DropdownItem onClick={onHandleDelete}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {alert ? <Alert onHandleConfirm={onHandleConfirm} onDelete={onDelete} /> : null}
    </>
  );
};


export default ScreeningListActions;
