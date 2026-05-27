
import { useSelector } from "react-redux";

import { selectChangeSidebarTypeState } from "../../../store/slice/layout.slice";
import PoweredBy from "../powered-by-logo";
import SimpleBarComponent from "../simplebar";
import SidebarContent from "./sidebar-content";

function LeftSidebar() {
  const left_side_bar = useSelector(selectChangeSidebarTypeState);

  return (
    /* <!-- ========== Left Sidebar Start ========== --> */
    <div className="vertical-menu">
      <div data-simplebar className="nav-area h-100">
        {left_side_bar !== "condensed" ? (
          <SimpleBarComponent style={{ maxHeight: "100%" }}>
            <SidebarContent />
          </SimpleBarComponent>
        ) : (
          <SidebarContent />
        )}
      </div>

      {/* <!-- Powered by --> */}
      <div className="powered-by">
        <span>Powered by</span>
        <PoweredBy />
      </div>
    </div>
    /* <!-- Left Sidebar End --> */
  );
}

export default LeftSidebar;
