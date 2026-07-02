import Layout from "../../components/shared/layout";
import withAuth from "../../util/helpers/withAuth";

function BlueroomPage() {
  return (
    <Layout>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0">Blueroom</h4>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="ri-tv-line" style={{ fontSize: "4rem", color: "#556ee6" }}></i>
                  <h5 className="mt-3">Blueroom</h5>
                  <p className="text-muted">Content coming soon.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(BlueroomPage, "Dashboard");
