import { useEffect, useState } from "react";
import Layout from "../../components/shared/layout";
import Pagetitle from "../../components/shared/pagetitle";
import Search from "../../components/shared/search";
import AddCenter from "../../components/center-management/add-center/add-center.component";
import CenterListing from "../../components/center-management/center-listing.component";
import DropdownComponent from "../../components/shared/dropdown";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/shared/loader";
import {
  SelectSearchCenterLoading,
  centerIsLoading,
  fetchAllCenters,
  searchCenter,
} from "../../store/slice/center.slice";
import { getAllClients } from "../../store/slice/client.slice";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import withAuth from "./../../util/helpers/withAuth";
function CenterManagement() {
  const dispatch = useDispatch();
  const isLoading = useSelector(centerIsLoading);

  const isCenterSearch = useSelector(SelectSearchCenterLoading);
  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Center", link: "center" },
    ];
    dispatch(changeTitle("Centers List"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(fetchAllCenters());
    dispatch(getAllClients());
  }, []);
  const [searchValue, setSearchValue] = useState("");

  const searchHandle = async (event) => {
    let key = event.target.value;
    setSearchValue(key);
  };

  useEffect(() => {
    const timeOutFn = setTimeout(async () => {
      if (searchValue) {
        const result = await dispatch(
          searchCenter({ CenterName: searchValue })
        );
        result.payload.length === 0
          ? await dispatch(searchCenter({ EmailId: searchValue }))
          : result;
      } else {
        dispatch(fetchAllCenters());
      }
    }, 400);
    return () => clearTimeout(timeOutFn);
  }, [searchValue]);
  
  return (
    <Layout>
      <div className="page-content">
        <Pagetitle />
        {isLoading ? (
          <Loader />
        ) : (
          <div className="main_listing">
            <div className="tab_data_header">
              <div className="tab_actions">
                {/* Search To Handle Search function */}
                <Search searchHandle={searchHandle} />
                {/* Export DropDown To Handle Download The data as Different Formats*/}
                <DropdownComponent
                  color={"secondary"}
                  name={"Export"}
                  items={["Excel", "CSV", "JSON", "XML"]}
                  names={"center"}
                />
                {/* Add Center To Handle create new center */}
                <AddCenter />
              </div>
            </div>
            {/* Center List Table */}
            {isCenterSearch ? <Loader /> : <CenterListing className="mt-3" />}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default withAuth(CenterManagement, "CenterManagement");
