import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateScale from "../../components/scale-management/create-scale.component";
import ScaleList from "../../components/scale-management/scale-list.component";
import DropdownComponent from "../../components/shared/dropdown";
import Layout from "../../components/shared/layout";
import Loader from "../../components/shared/loader";
import Pagetitle from "../../components/shared/pagetitle";
import Search from "../../components/shared/search";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import { ScaleSearchScales, fetchAllScales, selectScaleIsLoading, selectScaleList } from "../../store/slice/scale.slice";
import withAuth from "../../util/helpers/withAuth";
import { tableSearch } from "../../store/slice/payment.slice";

function ScaleCreation() {
  const dispatch = useDispatch();
  const scaleLoading = useSelector(selectScaleIsLoading);
  const [key, setKey] = useState()
  const [searchValue, setSearchValue] = useState("");
  const scaleList = useSelector(selectScaleList);

  const searchHandle = async (event) => {
    let key = event.target.value;
    setSearchValue(key);
  };



  useEffect(() => {

    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Scales", link: "scales" },
    ];
    dispatch(changeTitle("Scales"));
    dispatch(changeBreadcrumb(breadcrumb_Items));
    dispatch(fetchAllScales());
  }, [dispatch]);


  useEffect(() => {
    const timeOutFn = setTimeout(async () => {
      if (searchValue) {
        const searchData = scaleList.filter((item) => item.ScaleName.toLowerCase().includes(searchValue.toLowerCase()) || item.ScaleMetric.toLowerCase().includes(searchValue.toLowerCase()) || item.ScaleMetric.toLowerCase().includes(searchValue.toLowerCase()) || item.Accreditation.toLowerCase().includes(searchValue.toLowerCase()));
        await dispatch(tableSearch(searchData));
      } else {
        await dispatch(tableSearch(scaleList));
      }
    }, 400);
    return () => clearTimeout(timeOutFn);
  }, [searchValue, scaleList]);



  return (
    <Layout>
      <div className='page-content'>
        <Pagetitle />
        <div className='main_listing'>
          <div className='tab_data_header'>
            <div className='tab_actions'>
              {/* Search To Handle Search function */}
              <Search searchHandle={searchHandle} />
              {/* Export DropDown To Handle Download The data as Different Formats*/}
              <DropdownComponent color={"secondary"} name={"Export"} items={["Excel", "CSV", "JSON", "XML"]} names={"scale"} />
              <CreateScale />
            </div>
          </div>
          {scaleLoading ? (
            <Loader />
          ) : (
            // scale list to list the scales
            <ScaleList />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(ScaleCreation, "ScaleManagement");