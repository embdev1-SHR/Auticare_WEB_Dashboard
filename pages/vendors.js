import dynamic from "next/dynamic";
import { useEffect } from "react";
import Layout from "../components/shared/layout";
import Pagetitle from "../components/shared/pagetitle";
import SortDropdown from "../components/shared/sort";
import { useDispatch } from "react-redux";
import VendorList from "../components/vendor-management/vendor-list.component";
import { changeBreadcrumb, changeTitle } from "../store/slice/layout.slice";
import withAuth from "../util/helpers/withAuth";

const DynamicSearch = dynamic(() => import("../components/shared/search"));
const DynamicVendorFilterModal = dynamic(() =>
  import("../components/vendor-management/vendor-filter.component")
);
const DynamicDropdownComponent = dynamic(() =>
  import("../components/shared/dropdown")
);
const DynamicCreateVendor = dynamic(() =>
  import("../components/vendor-management/create-vendor.component")
);

function VendorManagement(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Vendors", link: "vendor-management" },
    ];
    dispatch(changeTitle("Vendors"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
  }, [dispatch]);

  return (
    <Layout>
      <div className="page-content">
        <Pagetitle />
        <div className="main_listing">
          <div className="tab_data_header">
            <div className="tab_actions">
              <DynamicSearch />
              <DynamicVendorFilterModal />
              <div className="d-flex">
                <div className="mb-0">
                  <SortDropdown />
                </div>
              </div>
              <DynamicDropdownComponent
                color={"secondary"}
                name={"Export"}
                items={["Excel", "CSV", "JSON", "XML"]}
              />
              <DynamicCreateVendor
                modalOpen={props.modalOpen}
                setModalOpen={props.setModalOpen}
              />
            </div>
          </div>
          <VendorList />
        </div>
      </div>
    </Layout>
  );
}


export default withAuth(VendorManagement, "VendorManagement");
