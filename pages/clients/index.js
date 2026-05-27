import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clientSearch,
  getAllClients,
  selectIsLoading,
  selectIsSearch,
  selectSearchKey,
  setSearchKey,
} from "../../store/slice/client.slice";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";

import ClientList from "../../components/client-management/client-list.component";
import AddClient from "../../components/client-management/create client/add-client.component";
import PageTitle from "../../components/shared/pagetitle";
import Search from "../../components/shared/search";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import withAuth from "../../util/helpers/withAuth";

const DynamicDropdownComponent = dynamic(() =>
  import("../../components/shared/dropdown")
);
// const DynamicFilterModal = dynamic(() =>
//   import("../../components/client-management/client-filter.component")
// );

function ClientManagement() {
  const dispatch = useDispatch();
  const IsLoading = useSelector(selectIsLoading);
  const isClientSearch = useSelector(selectIsSearch);
  const searchParam = useSelector(selectSearchKey);

  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Clients", link: "client-management" },
    ];
    dispatch(changeTitle("Clients List"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(getAllClients());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle client search key
  const searchHandle = async (event) => {
    let key = event.target.value;
    await dispatch(setSearchKey(key));
  };

  useEffect(() => {
    // Dispatch search key
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
        {IsLoading ? (
          <Loader />
        ) : (
          <div className="main_listing">
            <div className="tab_data_header">
              <div className="tab_actions">
                {/* Search To Handle Search function */}
                <Search searchHandle={searchHandle} />
                {/* <DynamicFilterModal /> */}
                <div className="d-flex">
                  <div className="mb-0">{/* <SortDropdown /> */}</div>
                </div>
                {/* Export DropDown To Handle Download The data as Different Formats*/}
                <DynamicDropdownComponent
                  color={"secondary"}
                  name={"Export"}
                  items={["Excel", "CSV", "JSON", "XML"]}
                  names={"Clients"}
                />
                {/* Add Client page to handle create new client */}
                <AddClient />
              </div>
            </div>
            {isClientSearch ? <Loader /> : <ClientList />}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default withAuth(ClientManagement, "ClientManagement");
