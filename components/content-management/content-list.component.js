import Link from "next/link";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "reactstrap";
import { selectContentFilterData, selectContentMapping, setContentEdit } from "../../store/slice/content.slice";
import ReactTable from "../shared/react-table";
import ContentActions from "./content-actions.component";
import { PaymentSearch } from "../../store/slice/payment.slice";

function ContentListing() {
  const dispatch = useDispatch();

  const contentListState = useSelector((state) => state.content.contents);
  const SearchData = useSelector(PaymentSearch);
  const originalData = SearchData.length != 0  ? SearchData : contentListState;

  let SelectContentBystatus = originalData.filter((content) => content.Status == 1);

  const Mapping = useSelector(selectContentMapping);

  const addMapData = (Contend, field) => {
    const data = Mapping[field]?.filter((f) => f.ContentID === Contend.ContentID);
    return { ...Contend, [field]: data };
  };

  SelectContentBystatus = SelectContentBystatus.map((contend) => addMapData(contend, "ContentSkillMappings"));
  SelectContentBystatus = SelectContentBystatus.map((contend) => addMapData(contend, "ContentTherapyMappings"));

  const filterObj = useSelector(selectContentFilterData);

  const filteredData =
    Object.keys(filterObj).length > 0
      ? SelectContentBystatus.filter((obj) =>
          obj.ContentSkillMappings?.some((item) => {
            if (filterObj.SkillID && filterObj.ContentCategory) return item.SkillID === filterObj.SkillID && obj.ContentCategory === filterObj.ContentCategory;
            else if (!filterObj.SkillID && filterObj.ContentCategory) return obj.ContentCategory === filterObj.ContentCategory;
            else return item.SkillID === filterObj.SkillID;
          })
        )
      : SelectContentBystatus;

  const data = useMemo(() => filteredData, [filteredData]);
// console.log({data});
  const columns = useMemo(
    () => [
      {
        Header: "SL NO",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Content Activity Name",
        accessor: "ContentActivityName",
        Cell: ({ row }) => (
          <>
          <Link href={`contents/${row.original.ContentID}`}>
            <a onClick={(e) => dispatch(setContentEdit(false))}>{row.original.ContentActivityName}</a>
          </Link>
          {row.original.ContentType === "Default" && "   *"}
          </>
        ),
      },
      {
        Header: "Content Category",
        accessor: "ContentCategory",
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
                <i className='mdi mdi-circle text-info align-middle'></i> Therapy Methods
              </span>
            </>
          );
        },
        accessor: (row) => {
          return (
            <>
              {row?.ContentSkillMappings?.map((Skills, key) => {
                return (
                  <Badge key={key} className={"font-size-12 badge-soft-success me-1"} color={"info"} pill>
                    {Skills.SkillName}
                  </Badge>
                );
              })}
              {row?.ContentTherapyMappings?.map((Therapies, key) => {
                return (
                  <Badge key={key} className={"font-size-12 badge-soft-info me-1"} color={"info"} pill>
                    {Therapies?.TherapyName}
                  </Badge>
                );
              })}
            </>
          );
        },
      },
      {
        Header: "",
        id: "Actions",
        accessor: (content) => <ContentActions content={content} />,
      },
    ],
    []
  );
  return <ReactTable columns={columns} data={data} />;
}

export default ContentListing;
