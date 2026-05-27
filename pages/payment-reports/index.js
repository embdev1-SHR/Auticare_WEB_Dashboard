import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddPayment from "../../components/payments/add-payment.component";
import PaymentList from "../../components/payments/payment-list.component";
import DropdownComponent from "../../components/shared/dropdown";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import Pagetitle from "../../components/shared/pagetitle";
import Search from "../../components/shared/search";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import { fetchAllPayment, fetchAllPaymentList, paymentSliceIsLoading, tableSearch } from "../../store/slice/payment.slice";
import withAuth from "../../util/helpers/withAuth";

function PaymentReports() {
  const dispatch = useDispatch();
  const loading = useSelector(paymentSliceIsLoading);
  const data = useSelector(fetchAllPaymentList);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Payment Reports", link: "payment-reports" },
    ];
    dispatch(changeTitle("Payment Reports"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(fetchAllPayment());
  }, [dispatch]);

  const searchHandle = async (event) => {
    let key = event.target.value;
    setSearchValue(key);
  };

  useEffect(() => {
    const timeOutFn = setTimeout(async () => {
      if (searchValue) {
        const searchData = data.filter((item) => item.PaymentType.toLowerCase().includes(searchValue.toLowerCase()));
        await dispatch(tableSearch(searchData));
      } else {
        await dispatch(tableSearch(data));
      }
    }, 400);
    return () => clearTimeout(timeOutFn);
  }, [searchValue, data]);



  return (
    <Layout>
      <div className='page-content'>
        <Pagetitle />
        <div className='main_listing'>
          <div className='tab_data_header'>
            <div className='tab_actions'>
              {/* Search To Handle Search function */}
              <Search searchHandle={searchHandle}/>
              {/* Export DropDown To Handle Download The data as Different Formats*/}
              <DropdownComponent color={"secondary"} name={"Export"} items={["Excel", "CSV", "JSON", "XML"]} names={"payment Report"}/>
              <AddPayment />
            </div>
          </div>
          {/* PaymentList Table */}
          {loading ? <Loader /> : <PaymentList />}
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(PaymentReports, "PaymentReports");
