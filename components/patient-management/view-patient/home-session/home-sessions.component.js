import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../../components/shared/layout";
import Loader from "../../../../components/shared/loader";
import Pagetitle from "../../../../components/shared/pagetitle";
import { changeTitle } from "../../../../store/slice/layout.slice";
import { FetchAllResources, ResourceIsLoading } from "../../../../store/slice/resource.slice";
import AddMedia from "./add-resource.component";
import ResourceListing from "./resource-list.component";
import { useRouter } from "next/router";
import { listHomeSession, patientIsLoading, selectHomeSessionEdit } from "../../../../store/slice/patient.slice";
import ViewResource from "./view-resource.component";

const HomeSession = () => {

  const dispatch = useDispatch();
  const loading = useSelector(patientIsLoading);

  const router = useRouter();
  const { PatientId } = router.query;

  
  useEffect(() => {
    dispatch(listHomeSession(PatientId));
  }, []);


  return (
    <>
      <div className='tab_data_header'>
        <div className='tab_title'>
          <h3>Sessions List</h3>
        </div>
        <div className='tab_actions'>
          <AddMedia PatientId={PatientId}/>
        </div>
      </div>
      <div className='tab_data_table table-responsive'>
      {loading ? (
          <Loader />
        ) : (
        <ResourceListing PatientId={PatientId}/>
        )}
      </div>
    </>
  );
};

export default HomeSession;
