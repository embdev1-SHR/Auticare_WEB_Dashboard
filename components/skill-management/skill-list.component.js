import { useSelector } from "react-redux";
import ReactTable from "../shared/react-table";
import SkillActions from "./skill-actions.component";

import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Badge } from "reactstrap";
import { selectSkillList, selectSkillMappings, setSkillMappingByID } from "../../store/slice/skills.slice";

function SkillList() {
  const skillsListState = useSelector(selectSkillList);
  const skillMappings = useSelector(selectSkillMappings);

  let SelectSkillBystatus = skillsListState.filter((skill) => skill.Status == 1);


  const addMapData = (skill, field) => {
    const data = skillMappings[field]?.filter((f) => f.SkillID === skill.SkillID);
    return { ...skill, [field]: data };
  };

  SelectSkillBystatus = SelectSkillBystatus.map((skill) => addMapData(skill, "SkillContentMappings"));
  SelectSkillBystatus = SelectSkillBystatus.map((skill) => addMapData(skill, "SkillDepartmentMappings"));
  SelectSkillBystatus = SelectSkillBystatus.map((skill) => addMapData(skill, "SkillGoalMappings"));
  SelectSkillBystatus = SelectSkillBystatus.map((skill) => addMapData(skill, "SkillScaleMappings"));
  SelectSkillBystatus = SelectSkillBystatus.map((skill) => addMapData(skill, "SkillTherapyMappings"));
  SelectSkillBystatus = SelectSkillBystatus.map((skill) => addMapData(skill, "SubSkills"));

  const dispatch = useDispatch();
  const mapData = SelectSkillBystatus;
  useEffect(() => {
    dispatch(setSkillMappingByID(mapData));
  }, [mapData]);
  const data = useMemo(() => SelectSkillBystatus, [SelectSkillBystatus]);

  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Skill Name",
        accessor: (currentVal) => {
          console.log("currentVal",currentVal);
          return (<>
            <p>{currentVal.SkillName}</p>
            {currentVal.Type === "Default" && "   *"}
          </>
          )
        },
        sortType: "string",
      },

      {
        id: "Mapping",
        Header: () => {
          return (
            <>
              <span className='text-muted mb-0 me-3'>
                <i className='mdi mdi-circle text-success align-middle'></i> Sub Skills
              </span>
              <span className='text-muted mb-0 me-3'>
                <i className='mdi mdi-circle text-info align-middle'></i> Department
              </span>
              <span className='text-muted mb-0 me-3'>
                <i className='mdi mdi-circle text-danger align-middle'></i> Scale
              </span>
              <span className='text-muted mb-0 me-3'>
                <i className='mdi mdi-circle text-warning align-middle'></i> Goal
              </span>
              <span className='text-muted mb-0 me-3'>
                <i className='mdi mdi-circle text-primary align-middle'></i> Content
              </span>
              <span className='text-muted mb-0 me-3'>
                <i className='mdi mdi-circle text-secondary align-middle'></i> Therapy
              </span>
            </>
          );
        },
        accessor: (row) => {
          return (
            <>
              {row?.SubSkills?.map((subSkill, key) => {
                return (
                  <Badge key={key} className={"font-size-12 me-1 mb-1"} color={"success"} pill>
                    {subSkill?.SubSkillName}
                  </Badge>
                );
              })}
              {row?.SkillDepartmentMappings?.map((department, key) => {
                return (
                  <Badge key={key} className={"font-size-12 me-1 mb-1"} color={"info"} pill>
                    {department?.DepartmentName}
                  </Badge>
                );
              })}
              {row?.SkillScaleMappings?.map((scale, key) => {
                return (
                  <Badge key={key} className={"font-size-12 me-1 mb-1"} color={"danger"} pill>
                    {scale?.ScaleName}
                  </Badge>
                );
              })}
              {row?.SkillGoalMappings?.map((goal, key) => {
                return (
                  <Badge key={key} className={"font-size-12 me-1 mb-1"} color={"warning"} pill>
                    {goal?.GoalName}
                  </Badge>
                );
              })}

              {row?.SkillContentMappings?.map((content, key) => {
                return (
                  <Badge key={key} className={"font-size-12 me-1 mb-1"} color={"primary"} pill>
                    {content?.ContentActivityName}
                  </Badge>
                );
              })}
              {row?.SkillTherapyMappings?.map((therapy, key) => {
                return (
                  <Badge key={key} className={"font-size-12 badge-soft-dark me-1 mb-1"} color={"secondary"} pill>
                    {therapy?.TherapyName}
                  </Badge>
                );
              })}
            </>
          );
        },
      },
      {
        Header: "Video",
        id: "ReferenceVideoURL",
        accessor: (curElement) => {
          return (
            <a href={curElement.ReferenceVideoURL} target='_blank' rel='noreferrer' className='d-flex justify-content-center font-weight-bold'>
              View
            </a>
          );
        },
      },
      {
        Header: "",
        id: "Actions",
        accessor: (skill) => <SkillActions skill={skill} />,
        maxWidth: "40vh",
      },
    ],
    []
  );
  return <ReactTable columns={columns} data={data} />;
}
export default SkillList;
