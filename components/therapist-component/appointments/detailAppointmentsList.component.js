import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAppointmentsList } from "../../../store/slice/appointment.slice";
import ReactTable from "../../shared/react-table";
import AppointmentListActions from "./appointmentListActions.component";

export const DetailAppointmentsList = () => {
  const dispatch = useDispatch();
  const Appointments = useSelector(selectAppointmentsList);

  const data = useMemo(() => Appointments, [Appointments]);


  const columns = useMemo(
    () => [
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
          return `${new Date(current.ScheduledDate).toDateString()},  ${current.StartTime} to ${current.EndTime}`;
        },
      },
      {
        Header: "Actions",
        accessor: (currentValue) => <AppointmentListActions appointment={currentValue} />,
        disableSortBy: true,
      },
    ],
    []
  );
  return <ReactTable columns={columns} data={data} />;
};
