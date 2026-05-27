
import { Input } from "reactstrap";

export const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <div className="tab_data_header">
      <div className="tab_actions">
        <div className="app-search">
          <div className="position-relative h-5">
            <Input
              type="text"
              className="datatable_search form-control "
              placeholder="Search..."
              value={filter || ""}
              onChange={(e) => setFilter(e.target.value)}
            />
            <span className="ri-search-line"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
