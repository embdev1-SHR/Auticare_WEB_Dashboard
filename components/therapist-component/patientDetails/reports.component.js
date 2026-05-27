

const Reports = () => {
  return (
    <>
      <div className="tab_data_header">
        <div className="tab_title">
          <h3>Reports</h3>
        </div>
        <div className="tab_actions">
          <div className="btn-group">
            <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Export <i className="mdi mdi-chevron-down"></i>
            </button>
            <div className="dropdown-menu dropdown-menu-right">
              <a className="dropdown-item" href="#">
                Excel
              </a>
              <a className="dropdown-item" href="#">
                PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
