import { useEffect, useState } from "react";
import Layout from "../../components/shared/layout";
import Pagetitle from "../../components/shared/pagetitle";

import { useDispatch } from "react-redux";
import DropdownComponent from "../../components/shared/dropdown";
import Search from "../../components/shared/search";
import PlanList from "../../components/subscription-management/plan-list.component";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import { getAllSubscriptionPlans, selectIsLoading, selectSearchKey, selectTableSearch, setSearchKey, tableSearch } from "../../store/slice/subscription.slice";

import { useSelector } from "react-redux";
import Loader from "../../components/shared/loader";
import CreateSubscriptionPlan from "../../components/subscription-management/createSubscriptionPlan.component";
import withAuth from "../../util/helpers/withAuth";

function Subscriptions() {
  const dispatch = useDispatch();
  const subscriptionsLoading = useSelector(selectIsLoading);
  const searchParam = useSelector(selectSearchKey);
  const [searchQuery, setSearchQuery] = useState("");
  const planList = useSelector(selectTableSearch);
  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Subscriptions", link: "subscriptions" },
    ];
    dispatch(changeTitle("Subscription Plans"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(getAllSubscriptionPlans());
  }, [dispatch]);
  const searchHandle = async (event) => {
    let key = event.target.value;
    await dispatch(setSearchKey(key));
  };

  useEffect(() => {
    const timeOutFn = setTimeout(async () => {
      if (searchParam) {
        const searchData = planList.filter((item) => item.PlanName.toLowerCase().includes(searchParam.toLowerCase()));
        await dispatch(tableSearch(searchData));
      } else {
        await dispatch(tableSearch(planList));
      }
    }, 500);
    return () => clearTimeout(timeOutFn);
  }, [searchParam]);

  return (
    <Layout>
      <div className='page-content'>
        <Pagetitle />
        {subscriptionsLoading ? (
          <Loader />
        ) : (
          <div className='main_listing'>
            <div className='tab_data_header'>
              <div className='tab_actions'>
                {/* Search To Handle Search function */}
                <Search searchHandle={searchHandle} />
                {/* Export DropDown To Handle Download The data as Different Formats*/}
                <DropdownComponent color={"secondary"} name={"Export"} names={"Subscriptions"} items={["Excel", "CSV", "JSON", "XML"]} />
                {/* CreateSubscriptionPlan page to create a ne subscription plan */}
                <CreateSubscriptionPlan />
              </div>
            </div>
            {/* plan list table list the plans*/}
            <PlanList />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default withAuth(Subscriptions, "SubscriptionManagement");
