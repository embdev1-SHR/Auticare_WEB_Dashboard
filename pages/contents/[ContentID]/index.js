import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { TabContent, TabPane } from "reactstrap";
import NavTabs from "../../../components/shared/navtabs";

import ActivityInstructions from "../../../components/content-management/create-content/activityInstructions.component";
import ContentDetailsComponent from "../../../components/content-management/create-content/contentDetails.component";
import Tutorials from "../../../components/content-management/create-content/tutorials.component";
import Layout from "../../../components/shared/layout";
import { SelectContent } from "../../../store/slice/content.slice";
import withAuth from "../../../util/helpers/withAuth";

const ContentDetail = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { ContentID } = router.query;
  const [activeTab, setActiveTab] = useState(1);
  const [customActiveTab, setCustomActiveTab] = useState(1);

  useEffect(() => {
    if (ContentID !== undefined) dispatch(SelectContent(ContentID));
  }, [ContentID, dispatch]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  const toggleCustomJustified = (tab) => {
    if (customActiveTab !== tab) {
      setCustomActiveTab(tab);
    }
  };
  const TabNavArray = ["Content Details", "Activity Instructions", "Tutorials"];

  return (
    <Layout>
      <div id='layout-wrapper layout-popup-full'>
        <div className='page-content'>
          <div className='vertical_tab'>
            <TabContent activeTab={activeTab} className='p-0 text-muted' id='h-tabContent'>
              <div className='tab_data'>
                <NavTabs customActiveTab={customActiveTab} toggleCustomJustified={toggleCustomJustified} NavigationArray={TabNavArray} />
                <TabContent activeTab={customActiveTab} style={{ paddingRight: "0 !important" }}>
                  <TabPane tabId={1}>
                    <ContentDetailsComponent />
                  </TabPane>
                  <TabPane tabId={2} className='p-3'>
                    <ActivityInstructions />
                  </TabPane>
                  <TabPane tabId={3} className='p-3'>
                    {/* Tutorials link list page to handle add tutorials, tutorial list*/}
                    <Tutorials />
                  </TabPane>
                </TabContent>
              </div>
            </TabContent>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(ContentDetail, "ContentManagement");