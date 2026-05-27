import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import Pagetitle from "../../components/shared/pagetitle";
import ViewSub from "../../components/subscription-management/view-Subscription.component";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import { SubPlanDetails, SubscriptionPlanDetails, getAllSubscriptionPlans, selectIsLoading } from "../../store/slice/subscription.slice";
import withAuth from "../../util/helpers/withAuth";

function SubscriptionsDetails() {
    const dispatch = useDispatch();
    const router = useRouter();
    const subscriptionsLoading = useSelector(selectIsLoading);
    useEffect(() => {
        const breadcrumb_Items = [
            { title: "Dashboard", link: "/dashboard" },
            { title: "Subscriptions", link: "/subscriptions" },
        ];
        dispatch(changeTitle("Subscription Plans"));
        dispatch(changeBreadcrumb(breadcrumb_Items));
        dispatch(getAllSubscriptionPlans());
    }, [dispatch]);

    const { SubscriptionPlanID } = router.query;

    useEffect(() => {
        dispatch(SubscriptionPlanDetails(SubscriptionPlanID));
    }, [dispatch]);

    const data = useSelector(SubPlanDetails);

    return (
        <Layout>
            <div className='page-content'>
                <Pagetitle />
                {subscriptionsLoading ? (
                    <Loader />
                ) : (
                    <div className='main_listing'>
                        <div className='tab_data_header'>
                        </div>
                        <ViewSub data={data[0]}/>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default withAuth(SubscriptionsDetails, "SubscriptionManagement");
