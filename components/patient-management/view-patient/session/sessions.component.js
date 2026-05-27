import { useEffect, useState } from "react";
import CreateSession from "./createSession.component";
import SessionList from "./sessionList.component";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { patientIsLoading, patientSessionList, selectSessionList, tableSearch } from "../../../../store/slice/patient.slice";
import Loader from "../../../shared/loader";
import { useSelector } from "react-redux";
import DropdownComponent from "../../../shared/dropdown";
import Search from "../../../shared/search";
import { selectSearchKey, setSearchKey } from "../../../../store/slice/subscription.slice";

const Sessions = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchParam = useSelector(selectSearchKey);
  const data = useSelector(selectSessionList);
  const loading = useSelector(patientIsLoading);
  const dispatch = useDispatch();
  const router = useRouter();
  const { PatientId } = router.query;


  useEffect(() => {
    dispatch(patientSessionList(PatientId));
  }, [PatientId]);

  useEffect(() => {
    const timeOutFn = setTimeout(async () => {
      if (searchParam) {
        const searchData = data?.filter((item) =>
          item.SessionName.toLowerCase().includes(searchParam.toLowerCase())
        );
        await dispatch(tableSearch(searchData));
      } else {
        await dispatch(tableSearch(data));
      }
    }, 500);
    return () => clearTimeout(timeOutFn);
  }, [searchParam]);


  const searchHandle = async (event) => {
    let key = event.target.value;
    await dispatch(setSearchKey(key));
  };

  return (
    <>
      <div className='tab_data_header'>
        <div className='tab_title'>
          <h3>Sessions List</h3>
        </div>
        <div className='tab_actions'>
          <Search searchHandle={searchHandle} />
          <DropdownComponent color={"secondary"} name={"Export"} items={["Excel", "CSV", "JSON", "XML"]} names={"patient Session"} />
          <CreateSession />
        </div>
      </div>
      {loading ? (
          <Loader />
        ) : (
      <div className='tab_data_table table-responsive'>
        <SessionList />
      </div>
      )}
    </>
  );
};

export default Sessions;
