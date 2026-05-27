import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { updatePatientAssessmentSlice } from "../../../../store/slice/patient.slice";
import moment from "moment";
import Alert from "../../../shared/alert";

const AssessmentListActions = ({ PatientMetric }) => {
  const dispatch = useDispatch();
  const [data, setdata] = useState();
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    if (PatientMetric.CompletionStatus == null || PatientMetric.CompletionStatus == "Pending") {
      setdata(true);
    } else {
      setdata(false);
    }
  }, [PatientMetric]);

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  function handleViewDetails() {
    // if (PatientMetric.CompletionStatus == null) {
    router.push(`${PatientMetric.PatientID}/scales/${PatientMetric.ScaleID}/${PatientMetric.ScaleMetricType.toLowerCase()}/${PatientMetric.PatientMetricID}`);
    // } else {
    //   router.push(`${PatientMetric.PatientID}/scales/${PatientMetric.ScaleID}/${PatientMetric.ScaleMetricType.toLowerCase()}/${PatientMetric.PatientMetricID}/result`);
    // }
  }
  function handleViewResults() {
    router.push(`${PatientMetric.PatientID}/scales/${PatientMetric.ScaleID}/${PatientMetric.ScaleMetricType.toLowerCase()}/${PatientMetric.PatientMetricID}/result`)
  }
  function createFormatDate(date) {
    return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
  }


  const onHandleDelete = async () => {
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

  const onHandleSuspend = async () => {
    const data = {
      "ScheduleStartDate": PatientMetric.ScheduleStartDate ? createFormatDate(PatientMetric.ScheduleStartDate) : undefined,
      "ScheduleEndDate": moment.isDate(PatientMetric.ScheduleEndDate) ? createFormatDate(PatientMetric.ScheduleEndDate) : undefined,
      "ActualStartDate": moment.isDate(PatientMetric.ActualStartDate) ? createFormatDate(PatientMetric.ActualStartDate) : undefined,
      "ActualEndDate": moment.isDate(PatientMetric.ActualEndDate) ? createFormatDate(PatientMetric.ActualEndDate) : undefined,
      "CompletionStatus": "Cancelled",
      "Status": PatientMetric.Status,
    }
    const valueToSend = {
      data,
      "PatientID": PatientMetric.PatientID,
      "PatientMetricID": PatientMetric.PatientMetricID,
      "msg": "Suspended successfully"
    }
    dispatch(updatePatientAssessmentSlice(valueToSend));

  };

  const onHandleConfirm = async () => {
    setAlert(false);
  };

  const onDelete = () => {
    setAlert(true);
  };

  return (
    <>
      <Dropdown direction="right" isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <DropdownToggle color="light" className="btn-rounded more_vert_btn" caret>
          <i className="mdi mdi-dots-vertical"></i>
        </DropdownToggle>
        <DropdownMenu style={{ marginBottom: -50 }}>
          <DropdownItem onClick={handleViewResults}>View Result</DropdownItem>
          {data ? <DropdownItem onClick={handleViewDetails}>View Details</DropdownItem> : null}
          {PatientMetric.CompletionStatus === "Cancelled" ? <></> : <DropdownItem onClick={onHandleSuspend}>Cancel</DropdownItem>}
          <DropdownItem onClick={onDelete}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {alert ? <Alert onHandleConfirm={onHandleDelete} onDelete={onHandleConfirm} /> : null}

    </>
  );
};

export default AssessmentListActions;
