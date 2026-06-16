import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import EnquiryList from "../../components/inquiry-management/inquiry-list.component";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import PageTitle from "../../components/shared/pagetitle";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import { StoreMainIsLoading, storeEnquiryList } from "../../store/slice/store.slice";
import withAuth from "../../util/helpers/withAuth";
import { useSelector } from "react-redux";

const AtstoreEnquiry = () => {
  const dispatch = useDispatch();
  const loading = useSelector(StoreMainIsLoading);
  // const memoizedData = useMemo(() => loading, []);
  
// console.log("memoizedData",memoizedData);
  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Store Enquiries", link: "store-enquiries" },
    ];
    dispatch(changeTitle("Store Enquiries"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(storeEnquiryList());
  }, [dispatch]);

  // const childComponent1 = useMemo(() => <Loader />, []);

  return (
    <Layout>
      <div className='page-content'>
        <PageTitle />
        <div className='main_listing'>
          {loading ?
            <Loader />
            : (
              // list the Enquiry
              <EnquiryList />
            )}
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(AtstoreEnquiry, "StoreInquiries");
