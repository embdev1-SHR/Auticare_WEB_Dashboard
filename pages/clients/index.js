import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Nav, NavItem, NavLink, TabContent, TabPane, Badge } from "reactstrap";

import {
  clientSearch,
  fetchPendingClients,
  getAllClients,
  selectIsLoading,
  selectIsSearch,
  selectPendingClientList,
  selectSearchKey,
  setSearchKey,
} from "../../store/slice/client.slice";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";

import ClientList from "../../components/client-management/client-list.component";
import PendingClientListing from "../../components/client-management/pending-client-listing.component";
import AddClient from "../../components/client-management/create client/add-client.component";
import PageTitle from "../../components/shared/pagetitle";
import Search from "../../components/shared/search";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import withAuth from "../../util/helpers/withAuth";

const DynamicDropdownComponent = dynamic(() =>
  import("../../components/shared/dropdown")
);

function ClientManagement() {
  const dispatch = useDispatch();
  const IsLoading = useSelector(selectIsLoading);
  const isClientSearch = useSelector(selectIsSearch);
  const searchParam = useSelector(selectSearchKey);
  const pendingClients = useSelector(selectPendingClientList);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Clients", link: "client-management" },
    ];
    dispatch(changeTitle("Clients List"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(getAllClients());
    dispatch(fetchPendingClients());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchHandle = async (event) => {
    let key = event.target.value;
    await dispatch(setSearchKey(key));
  };

  useEffect(() => {
    const timeOutFn = setTimeout(async () => {
      if (searchParam) {
        const result = await dispatch(
          clientSearch({ ClientName: searchParam })
        );
        result.payload.length === 0
          ? await dispatch(clientSearch({ EmailId: searchParam }))
          : result;
      } else {
        await dispatch(getAllClients());
      }
    }, 500);
    return () => clearTimeout(timeOutFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam]);

  return (
    <Layout>
      <div className="page-content">
        <PageTitle />
        <div className="main_listing">
          <Nav tabs className="mb-3">
            <NavItem>
              <NavLink
                className={activeTab === "active" ? "active" : ""}
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("active")}
              >
                Active Clients
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "pending" ? "active" : ""}
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("pending")}
              >
                Pending Approvals{" "}
                {pendingClients && pendingClients.length > 0 && (
                  <Badge color="warning" pill className="ms-1">
                    {pendingClients.length}
                  </Badge>
                )}
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="active">
              {IsLoading ? (
                <Loader />
              ) : (
                <>
                  <div className="tab_data_header">
                    <div className="tab_actions">
                      <Search searchHandle={searchHandle} />
                      <DynamicDropdownComponent
                        color={"secondary"}
                        name={"Export"}
                        items={["Excel", "CSV", "JSON", "XML"]}
                        names={"Clients"}
                      />
                      <AddClient />
                    </div>
                  </div>
                  {isClientSearch ? <Loader /> : <ClientList />}
                </>
              )}
            </TabPane>

            <TabPane tabId="pending">
              <PendingClientListing />
            </TabPane>
          </TabContent>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(ClientManagement, "ClientManagement");
