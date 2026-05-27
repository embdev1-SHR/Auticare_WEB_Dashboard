import SidebarListitem from "./sidebar-listitem";
import { Menuitems } from "./menu-items";
import { useRouter } from "next/router";
// MetisMenu
import MetisMenu from "metismenujs";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectRoleBasedModules } from "../../../store/slice/auth.slice";
import SidebarSkeleton from "./sidebar-skeleton";

function SidebarContent(props) {
  const router = useRouter();
  const roleBasedModules = useSelector(selectRoleBasedModules);
  useEffect(() => {
    new MetisMenu("#side-menu");

    var matchingMenuItem = null;
    var ul = document.getElementById("side-menu");
    var items = ul.getElementsByTagName("a");
    for (var i = 0; i < items.length; ++i) {
      if (router.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      } else if (router.pathname.includes(items[i].pathname)) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [router.pathname, roleBasedModules]);

  const activateParentDropdown = (item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add("active");
      const parent2 = parent.parentElement;
      if (parent2) {
        parent2.classList.add("show");
        const parent3 = parent2.parentElement;
        if (parent3) {
          parent3.classList.add("active"); // li
          parent3.childNodes[0].classList.add("active"); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("active");
          }
        }
      }
      return false;
    }
    return false;
  };

  return (
    <div id='sidebar-menu'>
      {/* <!-- Left Menu Start --> */}
      <ul className='metismenu list-unstyled' id='side-menu'>
        <li className='menu-title'>Menu</li>
        {!roleBasedModules ? (
          <SidebarSkeleton /> // TODO: Add Shimmer Effect
        ) : (
          Menuitems.map((menu, key) => {
            if (roleBasedModules.some((module) => module.ModuleName === menu.tag)) {
              return <SidebarListitem key={key} title={menu.title} location={menu.location} iconClass={menu.icon} />;
            }
          })
        )}
      </ul>
    </div>
  );
}
export default SidebarContent;
