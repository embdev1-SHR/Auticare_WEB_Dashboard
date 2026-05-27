import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SelectPatientScreeningList, fetchPatientMetrics, tableSearchScreening } from "../../../../store/slice/patient.slice";
import { selectSearchKey, setSearchKey } from "../../../../store/slice/subscription.slice";
import DropdownComponent from "../../../shared/dropdown";
import Search from "../../../shared/search";
import ScreeningList from "./screeningList.component";
import StartScreening from "./startScreening.component";

const Screening = () => {

  const searchParam = useSelector(selectSearchKey);
  const dispatch = useDispatch();
  const router = useRouter();
  const { PatientId } = router.query;
  const data = useSelector(SelectPatientScreeningList);


  useEffect(() => {
    dispatch(fetchPatientMetrics(PatientId));
  }, [dispatch]);

  useEffect(() => {
    const timeOutFn = setTimeout(async () => {
      if (searchParam) {
        const searchData = data?.filter((item) =>
          item.ScaleName.toLowerCase().includes(searchParam.toLowerCase())
        );
        await dispatch(tableSearchScreening(searchData));
      } else {
        await dispatch(tableSearchScreening(data));
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
          <h3>Screening List</h3>
        </div>
        <div className='tab_actions'>
          <div className='app-search'>
            <Search searchHandle={searchHandle} />
          </div>
          <DropdownComponent color={"secondary"} name={"Export"} items={["Excel", "CSV", "JSON", "XML"]} names={"patient Screening"} />
          <StartScreening />
        </div>
      </div>
      <div className='tab_data_table table-responsive'>
        <ScreeningList />
      </div>
    </>
  );
};

export default Screening;
