
import ScreeningList from "./screeningList.component";
import StartScreening from "./startScreening.component";

const Screening = () => {
  return (
    <>
      <div className="tab_data_header">
        <div className="tab_title">
          <h3>Screening List</h3>
        </div>
        <div className="tab_actions">
          <div className="app-search">
            <div className="position-relative">
              <input type="text" className="datatable_search form-control" placeholder="Search..." />
              <span className="ri-search-line"></span>
            </div>
          </div>
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
          <StartScreening />
        </div>
      </div>
      <div className="tab_data_table table-responsive">
        <ScreeningList />
      </div>
    </>
  );
};

export default Screening;
