import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddContent from "../../components/content-management/add-content.component";
import ContentList from "../../components/content-management/content-list.component";
import DropdownComponent from "../../components/shared/dropdown";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import PageTitle from "../../components/shared/pagetitle";
import Search from "../../components/shared/search";
import { resetUploadData } from "../../store/slice/common.slice";
import { ContentMappingList, SelectSearchContentLoading, contentIsLoading, fetchAllContents } from "../../store/slice/content.slice";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import { fetchAllSkills } from "../../store/slice/skills.slice";
import { getAllTherapies } from "../../store/slice/therapies.slice";
import withAuth from "../../util/helpers/withAuth";
import { tableSearch } from "../../store/slice/payment.slice";

function ContentManagement() {
  const dispatch = useDispatch();
  const isLoading = useSelector(contentIsLoading);

  const isContentSearch = useSelector(SelectSearchContentLoading);
  const contentListState = useSelector((state) => state.content.contents);

  useEffect(() => {
    dispatch(ContentMappingList());
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Contents", link: "contents" },
    ];
    dispatch(changeTitle("Contents List"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(fetchAllContents());
    dispatch(fetchAllSkills());
    dispatch(getAllTherapies());
    // clear file upload data
    dispatch(resetUploadData());
  }, [dispatch]);

  const [searchValue, setSearchValue] = useState("");

  const searchHandle = async (event) => {
    let key = event.target.value;
    setSearchValue(key);
  };
  useEffect(() => {
    const timeOutFn = setTimeout(async () => {
      if (searchValue) {
        const searchData = contentListState.filter((item) => item.ContentActivityName.toLowerCase().includes(searchValue.toLowerCase()) || item.ContentCategory.toLowerCase().includes(searchValue.toLowerCase()));
        await dispatch(tableSearch(searchData));
      } else {
        await dispatch(tableSearch(contentListState));
      }
    }, 400);
    return () => clearTimeout(timeOutFn);
  }, [searchValue, contentListState]);



  return (
    <Layout>
      <div className='page-content'>
        <PageTitle />
        {isLoading ? (
          <Loader />
        ) : (
          <div className='main_listing'>
            <div className='tab_data_header'>
              <div className='tab_actions'>
                <Search searchHandle={searchHandle} />
                {/* <ContentFilterModal /> */}
                <DropdownComponent color={"secondary"} name={"Export"} items={["Excel", "CSV", "JSON", "XML"]} names={"content"} />
                <AddContent />
              </div>
            </div>
            {isContentSearch ? <Loader /> : <ContentList />}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default withAuth(ContentManagement, "ContentManagement");
