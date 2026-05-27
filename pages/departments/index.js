import { useEffect } from "react";
import Loader from "../../components/shared/loader";
import PageTitle from "../../components/shared/pagetitle";
import Search from "../../components/shared/search";
import dynamic from "next/dynamic";
import DepartmentsList from "../../components/department-management/department-list.component";
import Layout from "../../components/shared/layout";
import { useDispatch, useSelector } from "react-redux";
import ViewDepartment from "../../components/department-management/view-department.component";
import {
  departmentSearch,
  getAllDepartments,
  selectDepartmentIsSearch,
  selectDepartmentSearchKey,
  selectIsLoading,
  selectViewModalState,
  setDepartmentSearchKey,
} from "../../store/slice/department.slice";
import { changeBreadcrumb, changeTitle } from "../../store/slice/layout.slice";
import withAuth from "../../util/helpers/withAuth";

function Departments() {
  const dispatch = useDispatch();
  const ISLoading = useSelector(selectIsLoading);
  const IsView = useSelector(selectViewModalState);
  const searchParam = useSelector(selectDepartmentSearchKey);
  const DeptSearchLoading = useSelector(selectDepartmentIsSearch);

  const DynamicDepartmentFilterModal = dynamic(() => import("../../components/department-management/department-filter.component"));
  const DynamicDropdownComponent = dynamic(() => import("../../components/shared/dropdown"));
  const DynamicAddDepartment = dynamic(() => import("../../components/department-management/add-department.component"));
  useEffect(() => {
    const breadcrumb_Items = [
      { title: "Dashboard", link: "dashboard" },
      { title: "Departments", link: "departments" },
    ];
    dispatch(changeTitle("Departments List"));
    dispatch(changeBreadcrumb(breadcrumb_Items));

    dispatch(getAllDepartments());
  }, [dispatch]);

  useEffect(() => {
    const timeOutFn = setTimeout(async () => {
      if (searchParam) {
        const result = await dispatch(departmentSearch({ DepartmentName: searchParam }));
        result.payload.length === 0 ? await dispatch(departmentSearch({ EmailId: searchParam })) : result;
      } else {
        await dispatch(getAllDepartments());
      }
    }, 500);
    return () => clearTimeout(timeOutFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam]);

  const searchHandle = async (event) => {
    let key = event.target.value;
    await dispatch(setDepartmentSearchKey(key));
  };

  return (
    <Layout>
      {IsView ? <ViewDepartment /> : null}
      <div className='page-content'>
        <PageTitle />
        {ISLoading ? (
          <Loader />
        ) : (
          <div className='main_listing'>
            <div className='tab_data_header'>
              <div className='tab_actions'>
                {/* Search To Handle Search function */}
                <Search searchHandle={searchHandle} />
                <div className='d-flex'>
                  <div className='mb-0'></div>
                </div>
                {/* Export DropDown To Handle Download The data as Different Formats*/}
                <DynamicDropdownComponent color={"secondary"} name={"Export"} items={["Excel", "CSV", "JSON", "XML"]} names={"Departments"} />
                <DynamicAddDepartment />
              </div>
            </div>
            {/* Departments List Table */}
            {DeptSearchLoading ? <Loader /> : <DepartmentsList />}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default withAuth(Departments, "DepartmentManagement");
