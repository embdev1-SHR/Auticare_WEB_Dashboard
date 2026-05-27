import { useEffect } from "react";
import { useDispatch } from "react-redux";
import StoreProductsList from "../../components/at-store-management/product-list.component";
import Layout from "../../components/shared/layout";
import Pagetitle from "../../components/shared/pagetitle";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import withAuth from "./../../util/helpers/withAuth";
import { AtStoreList, StoreIsLoading, StoreMainIsLoading } from "../../store/slice/store.slice";
import Loader from "../../components/shared/loader";
import { useSelector } from "react-redux";

function ATStore() {
  const dispatch = useDispatch();
  const loading = useSelector(StoreMainIsLoading);

  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "AT Store", link: "at-store" },
    ];
    dispatch(changeTitle("AT Store"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
  });
  useEffect(() => {
    dispatch(AtStoreList());

  }, [dispatch]);

  return (
    <Layout>
      <div className="page-content">
        <Pagetitle />
        {loading ? (
          <Loader />
        ) : (
        <div className="main_listing">
          <StoreProductsList />
        </div>
        )}
      </div>
    </Layout>
  );
}
export default withAuth(ATStore, "ATStore");
