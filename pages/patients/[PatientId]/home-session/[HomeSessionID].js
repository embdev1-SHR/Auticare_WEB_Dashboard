import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../../components/shared/layout";
import { changeTitle } from "../../../../store/slice/layout.slice";
import { ResourceIsLoading, ViewResourcesSlice } from "../../../../store/slice/resource.slice";
import Loader from "../../../../components/shared/loader";
import ViewResource from "../../../../components/patient-management/view-patient/home-session/view-resource.component";
import { listHomeSession } from "../../../../store/slice/patient.slice";

const Details = () => {

    const loading = useSelector(ResourceIsLoading);
    const dispatch = useDispatch();
    const router = useRouter();
    const { PatientId } = router.query;
    const { HomeSessionID } = router.query;

    useEffect(() => {
        dispatch(changeTitle("Resource List"));
    }, [dispatch]);


    useEffect(() => {
        if (PatientId !== undefined){dispatch(listHomeSession(PatientId));} 
    }, [PatientId]);


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
                        <ViewResource className='mt-3' HomeSessionID={HomeSessionID} PatientId={PatientId} />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Details;
