import { useSelector } from "react-redux";
import { selectAppointmentsList } from "../../../store/slice/appointment.slice";
import ReactTable from "../../shared/react-table";
import AppointmentListActions from "./appointmentListActions.component";
import moment from "moment";
import { selectUserData } from "../../../store/slice/auth.slice";
import { PaymentSearch } from "../../../store/slice/payment.slice";

export const AppointmentsList = () => {
  const userData = useSelector(selectUserData);
  const AppoinmentsData = useSelector(PaymentSearch);

  const appoinments = useSelector(selectAppointmentsList);
  let columns = []
  let data = []
  if (userData.RoleName === "SuperAdmin") {
    data = AppoinmentsData?.map(appoinment => ({ ...appoinment, PatientName: hideName(appoinment.PatientName) }))
    columns = [
      {
        Header: "SL.No",
        accessor: (_row, i) => {
          return i + 1;
        },
      },
      {
        Header: "Therapist Name",
        accessor: "therapistName",
      },
      {
        Header: "Patient Name",
        accessor: "PatientName",
        sortType: "string",
      },
      {
        Header: "Time Slot",
        accessor: (current) => {
          return `${new Date(current.ScheduledDate).toDateString()},  ${moment(current.StartTime, "HH:mm:ss").format("hh:mm A")} to ${moment(current.EndTime, "HH:mm:ss").format("hh:mm A")}`;
        },
      },
      {
        Header: "Actions",
        accessor: (currentValue) => <AppointmentListActions appointment={currentValue} />,
        // disableSortBy: true,
      },
    ]
  } else {
    data = AppoinmentsData
    columns = [
      {
        Header: "SL.No",
        accessor: (_row, i) => {
          return i + 1;
        },
      },
      {
        Header: "Patient Name",
        accessor: "PatientName",
        sortType: "string",
      },
      {
        Header: "Parent Name",
        accessor: "ParentName",
      },
      {
        Header: "Time Slot",
        accessor: (current) => {
          return `${new Date(current.ScheduledDate).toDateString()},  ${moment(current.StartTime, "HH:mm:ss").format("hh:mm A")} to ${moment(current.EndTime, "HH:mm:ss").format("hh:mm A")}`;
        },
      },
      {
        Header: "Actions",
        accessor: (currentValue) => <AppointmentListActions appointment={currentValue} />,
        // disableSortBy: true,
      },
    ]
  }
  function hideName(name) {
    return name[0] + "*".repeat(name.length) + name.at(-1)
  }
  return <ReactTable columns={columns} data={data.map(item => ({ ...item, Status: 1, Token: undefined, Update_By: undefined, Update_TS: undefined }))} />;
};
