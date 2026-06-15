import { useEffect, useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane, Badge } from "reactstrap";
import Layout from "../../components/shared/layout";
import Pagetitle from "../../components/shared/pagetitle";
import Search from "../../components/shared/search";
import AddCenter from "../../components/center-management/add-center/add-center.component";
import CenterListing from "../../components/center-management/center-listing.component";
import PendingCenterListing from "../../components/center-management/pending-center-listing.component";
import DropdownComponent from "../../components/shared/dropdown";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/shared/loader";
import {
  SelectSearchCenterLoading,
  centerIsLoading,
  fetchAllCenters,
  fetchPendingCenters,
  searchCenter,
  selectPendingCenterList,
} from "../../store/slice/center.slice";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import withAuth from "./../../util/helpers/withAuth";

function CenterManagement() {
  const dispatch = useDispatch();
  const isLoading = useSelector(centerIsLoading);
  const isCenterSearch = useSelector(SelectSearchCenterLoading);
  const pendingCenters = useSelector(selectPendingCenterList);
  const [activeTab, setActiveTab] = useState("active");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Center", link: "center" },
    ];
    dispatch(changeTitle("Centers List"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(fetchAllCenters());
    dispatch(fetchPendingCenters());
  }, []);

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
        <div className="main_listing">
          <Nav tabs className="mb-3">
            <NavItem>
              <NavLink
                className={activeTab === "active" ? "active" : ""}
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("active")}
              >
                Active Centers
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "pending" ? "active" : ""}
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("pending")}
              >
                Pending Approvals{" "}
                {pendingCenters && pendingCenters.length > 0 && (
                  <Badge color="warning" pill className="ms-1">
                    {pendingCenters.length}
                  </Badge>
                )}
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="active">
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  <div className="tab_data_header">
                    <div className="tab_actions">
                      <Search searchHandle={searchHandle} />
                      <DropdownComponent
                        color={"secondary"}
                        name={"Export"}
                        items={["Excel", "CSV", "JSON", "XML"]}
                        names={"center"}
                      />
                      <AddCenter />
                    </div>
                  </div>
                  {isCenterSearch ? <Loader /> : <CenterListing className="mt-3" />}
                </>
              )}
            </TabPane>

            <TabPane tabId="pending">
              <PendingCenterListing />
            </TabPane>
          </TabContent>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(CenterManagement, "CenterManagement");
