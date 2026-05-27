import { Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TabContent, TabPane } from "reactstrap";

import {
  clientUpdation,
  getClient,
  selectClient,
  selectIsLoading,
} from "../../store/slice/client.slice";
import { changeBreadcrumb } from "../../store/slice/layout.slice";

import { renderValidation } from "../../components/client-management/client-validation.component";
import BasicDetails from "../../components/client-management/view client/basicDetails.component";
import BillingDetails from "../../components/client-management/view client/billingDetails.component";
import Documents from "../../components/client-management/view client/clientDocuments.component";
import ClientFooter from "../../components/client-management/view client/clientFooter.component";
import ClientHeader from "../../components/client-management/view client/clientHeader.component";
import ContactPersonDetails from "../../components/client-management/view client/contactPerson.component";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import NavTabs from "../../components/shared/navtabs";
import withAuth from "../../util/helpers/withAuth";

function ClientDetail() {
  const [customActiveTab, setCustomActiveTab] = useState(1);
  const dispatch = useDispatch();
  const router = useRouter();
  const { clientId } = router.query;
  const IsLoad = useSelector(selectIsLoading);
  const Client = useSelector(selectClient);
  const NavArray = [
    "Basic Details",
    "Contact Person Details",
    "Documents",
    "Billing Details",
  ];

  const toggleCustomJustified = (tab) => {
    if (customActiveTab !== tab) {
      setCustomActiveTab(tab);
    }
  };

  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "/dashboard" },
      { title: "Clients", link: "/clients" },
      {
        title: `${
          Client[0] && Client[0].ClientName !== undefined
            ? Client[0].ClientName
            : ""
        }`,
      },
    ];

    dispatch(changeBreadcrumb(breadcrumb_Items));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Client]);

  useEffect(() => {
    if (clientId !== undefined) dispatch(getClient(clientId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  // Client updation
  const onSubmit = async (values) => {
    const valuesToSend = { ...values, Status: true };
    await dispatch(clientUpdation(valuesToSend)).unwrap();
    // router.back();
  };

  return (
    <Layout>
      {IsLoad || Client.length === 0 ? (
        <Loader />
      ) : (
        <div className="page-content">
          <ClientHeader />
          {/* <!-- start page title --> */}
          <Formik
            initialValues={{ ...Client[0], UpdateSubscriptionPlan: false }}
            onSubmit={onSubmit}
            validationSchema={renderValidation(customActiveTab)}
          >
            <div className="tab_data">
              <NavTabs
                customActiveTab={customActiveTab}
                toggleCustomJustified={toggleCustomJustified}
                NavigationArray={NavArray}
              />

              <TabContent activeTab={customActiveTab}>
                <TabPane tabId={1} className="p-3">
                  {/* Basic Details page to collect Basic Details to create client */}
                  <BasicDetails />
                </TabPane>
                <TabPane tabId={2} className="p-3">
                  {/* Contact PersonDetails page to collect ContactPerson Details to create client */}
                  <ContactPersonDetails />
                </TabPane>
                <TabPane tabId={3} className="p-3">
                  {/*  collect Documents to create client */}
                  <Documents />
                </TabPane>
                <TabPane tabId={4} className="p-3">
                  {/* Billing Details page to collect Billing Details to create client */}
                  <BillingDetails />
                </TabPane>
              </TabContent>
              <ClientFooter />
            </div>
          </Formik>
        </div>
      )}
    </Layout>
  );
}

export default withAuth(ClientDetail, "ClientManagement");
