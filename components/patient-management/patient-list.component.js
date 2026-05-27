import Link from "next/link";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";
import { selectRole } from "../../store/slice/auth.slice";
import { selectPatientFilterData, selectPatientList, setPatientEdit, tableSearchDataSlice } from "../../store/slice/patient.slice";
import ReactTable from "../shared/react-table";
import PatientActions from "./patient-actions.component";


function PatientListing() {
  const dispatch = useDispatch();
  const searchData =useSelector(tableSearchDataSlice)
  const patientListState = useSelector(selectPatientList);
  const SelectPatientBystatus = searchData?.filter((patient) => patient.Status == 1);
  const role = useSelector(selectRole);
  const filterObj = useSelector(selectPatientFilterData);

  const filteredData = SelectPatientBystatus?.filter((obj) => {
    const AgeCalc = isNaN(parseInt(moment().diff(obj.DOB, "years"), 10)) ? 0 : parseInt(moment().diff(obj.DOB, "years"), 10);

    return Object.keys(filterObj).every((key) => {
      if (filterObj.Age === AgeCalc) {
        return filterObj[key];
      }
      return obj[key] === filterObj[key];
    });
  });
  let data = []



  const columns = useMemo(
    () => {
      if (role == "SuperAdmin") {
        data = filteredData?.map(item => ({ ...item, PatientName: hideName(item.PatientName) , ParentName : hideName(item.ParentName)}))

        return (
          [
            {
              Header: "SL.No",
              accessor: (row, index) => index + 1,
            },
            {
              Header: "Patient Name",
              accessor: "PatientName",
              Cell: ({ row }) => (
                <Link href={`patients/${row.original.PatientID}`}>
                  <a onClick={(e) => dispatch(setPatientEdit(false))}>{row.original.PatientName}</a>
                </Link>
              ),
              sortType: "string",
            },
            {
              Header: "Parent Name",
              accessor: "ParentName",
              sortType: "string",
            },
            {
              Header: "Age",
              accessor: (item) => {
                const AgeCalc = parseInt(moment().diff(item.DOB, "years"), 10);
                return isNaN(AgeCalc) ? 0 : AgeCalc;
              },
            },
            {
              Header: "Gender",
              accessor: "Gender",
            },
            {
              Header: "Department Name",
              accessor: "DepartmentName",
            },
            {
              Header: "Therapist Name",
              accessor: "TherapistName",
            },
            {
              Header: "App User",
              accessor: "IsAppCreated",
              Cell: ({ row }) => {
                return (row.original.IsAppCreated == 0 ? "No" : "Yes")
              }
            },
            {
              Header: "",
              id: "Actions",
              accessor: (patient) =>{
              return (<PatientActions PatientID={patient.PatientID} />)},
            },
          ])
      }
      else {

        data =  filteredData?.map(item => ({ ...item }));
        return (
          [
            {
              Header: "SL.No",
              accessor: (row, index) => index + 1,
            },
            {
              Header: "Patient Name",
              accessor: "PatientName",
              Cell: ({ row }) => {
                return (
                <Link href={`patients/${row.original?.Patient?.PatientID ? row.original?.Patient?.PatientID : row.original.PatientID}`}>
                  <a onClick={(e) => dispatch(setPatientEdit(false))}>{row.original.PatientName}</a>
                </Link>
              )},
              sortType: "string",
            },
            {
              Header: "Parent Name",
              accessor: "ParentName",
              sortType: "string",
            },
            {
              Header: "Age",
              accessor: (item) => {
                const AgeCalc = parseInt(moment().diff(item.DOB, "years"), 10);
                return isNaN(AgeCalc) ? 0 : AgeCalc;
              },
            },
            {
              Header: "Gender",
              accessor: "Gender",
            },
            {
              Header: "Department Name",
              accessor: "DepartmentName",
            },
            {
              Header: "Therapist Name",
              accessor: "TherapistName",
            },
            {
              Header: "",
              id: "Actions",
              accessor: (patient) => <PatientActions patient={patient} />,
            },
          ]
        )
      }
    },
    [filteredData]
  );
  function hideName(name) {
    return name[0] + "*".repeat(name.length) + name.at(-1)
  }
  return <ReactTable columns={columns} data={data} />;

}

export default PatientListing;
