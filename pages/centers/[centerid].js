import { useEffect } from "react";

import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import ViewCenterDetails from "../../components/center-management/view-center-details";
import Layout from "../../components/shared/layout";
import { SelectCenter } from "../../store/slice/center.slice";
import { getAllCountries } from "../../store/slice/common.slice";
import withAuth from "../../util/helpers/withAuth";

function CenterDetail() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { centerid } = router.query;

  useEffect(() => {
    centerid && dispatch(SelectCenter(centerid));
  }, [centerid]);

  useEffect(() => {
    dispatch(getAllCountries());
  }, []);
  return (
    <Layout>
      <div className="page-content">
        <div className="tab_data"></div>
        {/* view Center Details */}
        <ViewCenterDetails />
      </div>
    </Layout>
  );
}

export default withAuth(CenterDetail, "CenterManagement");
