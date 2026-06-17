import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderList from "../../components/order-management/order-list.component";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import PageTitle from "../../components/shared/pagetitle";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import { StoreMainIsLoading, storeOrderList } from "../../store/slice/store.slice";
import withAuth from "../../util/helpers/withAuth";

const StoreOrders = () => {
  const dispatch = useDispatch();
  const loading = useSelector(StoreMainIsLoading);

  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Store Orders", link: "store-orders" },
    ];
    dispatch(changeTitle("Store Orders"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(storeOrderList());
  }, [dispatch]);

  return (
    <Layout>
      <div className="page-content">
        <PageTitle />
        <div className="main_listing">
          {loading ? <Loader /> : <OrderList />}
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(StoreOrders, "StoreOrders");
