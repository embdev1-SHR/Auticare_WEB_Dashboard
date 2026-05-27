import moment from "moment";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Button } from "reactstrap";
import { SessionReportSlice, selectPatientDetails, tableSearchDataSlice } from "../../../../store/slice/patient.slice";
import SessionListActions from "./sessionListActions.component";
import { useDispatch } from "react-redux";
import ReactTable from "../../../shared/react-table";

const SessionList = ({ report }) => {

  const value = useSelector(tableSearchDataSlice);
  const dispatch = useDispatch();
  const Patient = useSelector(selectPatientDetails)[0];

  let data = value?.filter((e) => e.Status == 1);

  function createFormatDate(date) {
    return moment(new Date(date)).locale("en-in").format("MM/DD/YYYY");
  }

  let date = moment(new Date()).locale("en-in").format("MM/DD/YYYY");

  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (row, index) => index + 1,
      },

      {
        Header: "Session Name",
        accessor: "SessionName",
        sortType: "string",
      },
      {
        Header: "Date",
        accessor: "SessionDate",
        accessor: (currentVal) => {
          return createFormatDate(currentVal.SessionDate)
        },
      },
      {
        Header: "Content Category",
        accessor: "ContentCategory",
      },
      {
        Header: "Schedule",
        accessor: "Status",
        accessor: (currentVal) => {
          return <span className='badge badge-pill badge-soft-warning'>{
            createFormatDate(currentVal.SessionDate) > date ? "Upcoming" : createFormatDate(currentVal.SessionDate) == date ? "Scheduled Today" : "Expired"
          }</span>
        },
      },
      {
        Header: "",
        id: "Actions",
        accessor: (curElement) => {
          const valueToSend = {
            PatientID: curElement.PatientID,
            SessionID: curElement.SessionID,
            PatientName: Patient.PatientName
          }
          return report ? <Button color='info' size='sm' onClick={(e) => dispatch(SessionReportSlice(valueToSend))} >
            Download
          </Button> : <SessionListActions session={curElement} />
        },
      },
    ],
    []
  );
  return <ReactTable columns={columns} data={data} />;

};

export default SessionList;
