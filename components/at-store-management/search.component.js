
import { Input } from "reactstrap";

function Search({ searchHandle }) {
    return (
        <div className="app-search">
            <div className="position-relative">
                <Input
                    type="text"
                    className="datatable_search form-control"
                    placeholder="Search..."
                    onChange={searchHandle}
                />
            </div>
        </div>
    );
}
export default Search;
