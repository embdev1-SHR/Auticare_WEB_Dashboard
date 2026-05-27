import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewResource from "../../components/free-resource/view-resource.component";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import { changeTitle } from "../../store/slice/layout.slice";
import { ResourceIsLoading, ViewResourcesSlice } from "../../store/slice/resource.slice";

const Details = () => {

    const loading = useSelector(ResourceIsLoading);
    const dispatch = useDispatch();
    const router = useRouter();
    const { ResourceID } = router.query;


    useEffect(() => {
        dispatch(changeTitle("Resource List"));
    }, [dispatch]);


    useEffect(() => {
        if (ResourceID !== undefined){dispatch(ViewResourcesSlice(ResourceID));} 
    }, [ResourceID]);




    return (
        <Layout>
            <div className='page-content'>
                {loading ? (
                    <Loader />
                ) : (
                    <div className='main_listing'>
                        <div className='tab_data_header'>
                            <div className='tab_actions'>
                            </div>
                        </div>
                        <ViewResource className='mt-3' ResourceID={ResourceID} />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Details;
