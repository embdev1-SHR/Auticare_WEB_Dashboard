import { useMemo } from "react";
import TherapyActions from "./therapy-actions.component";
import ReactTable from "../shared/react-table";
import { useDispatch, useSelector } from "react-redux";
import { selectTherapiesList } from "../../store/slice/therapies.slice";
import { Badge } from "reactstrap";
import { getAllTherapiesSkillGoal } from "../../store/slice/therapies.slice"
import { useEffect, useState } from "react";
import { selectTherapySkillGoal } from "../../store/slice/therapies.slice"

function TherapyList() {
  let TherapiesList = useSelector(selectTherapiesList);
  //const data = useMemo(() => TherapiesList, [TherapiesList]);
  const dispatch = useDispatch();
  const TherapiesSkillGoal = useSelector(selectTherapySkillGoal);



  const addMapData = (Contend, field) => {
    const data = TherapiesSkillGoal[field]?.filter((f) => f.TherapyID === Contend.TherapyID)
    return { ...Contend, [field]: data }
  }


  TherapiesList = TherapiesList.map(contend => addMapData(contend, "Goals"))
  TherapiesList = TherapiesList.map(contend => addMapData(contend, "TherapySkillMappings"))


  const data = useMemo(() => TherapiesList, [TherapiesList]);

  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (_row, i) => {
          return i + 1;
        },
      },
      {
        Header: "Therapy Name",
        accessor: (currentVal) => {
          console.log("currentVal",currentVal);
          return (<>
            <p>{currentVal.TherapyName} {currentVal.TherapyType === "Default" && "   *"}</p>
          </>
          )
        },        // Cell: ({ row }) => (
        //   <Link href={`clients/${row.values.TherapyID}`}>
        //     <a onClick={(e) => dispatch(setEdit(true))}>{row.values.TherapyName}</a>
        //   </Link>
        // ),
        sortType: "string",
      },

      {
        Header: "Age Category",
        accessor: "AgeGroup",
      },
      {
        id: "Mapping",
        Header: () => {
          return (
            <>
              <span className='text-muted mb-0 me-3'>
                <i className='mdi mdi-circle text-success align-middle'></i> Skills
              </span>
              <span className='text-muted mb-0 me-3'>
                <i className='mdi mdi-circle text-info align-middle'></i> Goals
              </span>
            </>
          );
        },
        accessor: (row) => {
          
          return (
            <>
              {row?.TherapySkillMappings?.map((Therapies, key) => {
                return (<Badge key={key} className={"font-size-12 badge-soft-success  me-1"} color={"info"} pill>
                  {Therapies?.SkillName}
                </Badge>)
              })}
              {row?.Goals?.map((Goal, key) => {
                return (<Badge key={key} className={"font-size-12 badge-soft-info me-1"} color={"info"} pill>
                  {Goal?.GoalName}
                </Badge>)
              })}
            </>
          );
        },
      },
      {
        Header: "",
        id: "Actions",
        // accessor: () => <TherapyActions />,
        accessor: (row) => <TherapyActions Therapy={row} />,
      },
    ],
    []
  );

  return <ReactTable columns={columns} data={data} />;
}
export default TherapyList;
