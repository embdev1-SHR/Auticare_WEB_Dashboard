import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddMedia from "../../components/free-resource/add-resource.component";
import ResourceListing from "../../components/free-resource/resource-list.component";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import Pagetitle from "../../components/shared/pagetitle";
import { changeTitle } from "../../store/slice/layout.slice";
import { FetchAllResources, ResourceIsLoading } from "../../store/slice/resource.slice";
import { selectClient } from "../../store/slice/client.slice";

const FreeResource = () => {

  const dispatch = useDispatch();
  const loading = useSelector(ResourceIsLoading);
  
  useEffect(() => {
    dispatch(FetchAllResources());
    dispatch(changeTitle("Resource List"));
  }, [dispatch]);


  return (
    <Layout>
      <div className='page-content'>
        <Pagetitle />
        {loading ? (
          <Loader />
        ) : (
          <div className='main_listing'>
            <div className='tab_data_header'>
              <div className='tab_actions'>
                {/* add resources model to handle add resources */}
                <AddMedia />
              </div>
            </div>
            {/* Resource List Table */}
            <ResourceListing />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FreeResource;
