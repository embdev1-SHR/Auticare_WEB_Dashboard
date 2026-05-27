import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DropdownComponent from "../../components/shared/dropdown";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import Pagetitle from "../../components/shared/pagetitle";
import Search from "../../components/shared/search";
import AddSkill from "../../components/skill-management/add-skill.component";
import SkillList from "../../components/skill-management/skill-list.component";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import { SelectSearchSkillLoading, fetchAllSkills, fetchSkillMappings, searchSkill, selectSkillIsLoading } from "../../store/slice/skills.slice";
import withAuth from "../../util/helpers/withAuth";

function SkillManagement() {
  const dispatch = useDispatch();
  const IsLoading = useSelector(selectSkillIsLoading);

  const isSkillSearch = useSelector(SelectSearchSkillLoading);
  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Skills", link: "skills" },
    ];
    dispatch(changeTitle("Skills List"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(fetchAllSkills());
    dispatch(fetchSkillMappings());

  }, [dispatch]);
  const [searchValue, setSearchValue] = useState("");

  const searchHandle = async (event) => {
    let key = event.target.value;
    setSearchValue(key);
  };

  useEffect(() => {
    const timeOutFn = setTimeout(async () => {
      if (searchValue) {
        await dispatch(searchSkill({ SkillName: searchValue }));
      } else {
        await dispatch(searchSkill({}));
      }
    }, 400);
    return () => clearTimeout(timeOutFn);
  }, [searchValue]);

  return (
    <Layout>
      <div className='page-content'>
        <Pagetitle />
        {IsLoading ? (
          <Loader />
        ) : (
          <div className='main_listing skills'>
            <div className='tab_data_header'>
              <div className='tab_actions'>
                {/* Search To Handle Search function */}
                <Search searchHandle={searchHandle} />
                {/* Export DropDown To Handle Download The data as Different Formats*/}
                <DropdownComponent color={"secondary"} name={"Export"} items={["Excel", "CSV", "JSON", "XML"]} names={"skill"} />
                <AddSkill />
              </div>
            </div>
            {/* Skill List Table */}
            {isSkillSearch ? <Loader /> : <SkillList />}
          </div>
        )}
      </div>
    </Layout>
  );
}
export default withAuth(SkillManagement, "SkillManagement");