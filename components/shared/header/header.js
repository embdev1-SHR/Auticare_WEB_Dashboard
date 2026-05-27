import AuticareLogo from "../auticare-logo";
// import NotificationDropdown from "./notification-dropdown";
import ProfileMenu from "./profile-menu";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { changeSidebarType, selectChangeSidebarTypeState } from "../../../store/slice/layout.slice";
import { useEffect } from "react";
import FullScreen from "./full-screen";

function Header() {
  const dispatch = useDispatch();
  const left_side_bar = useSelector(selectChangeSidebarTypeState);

  const toggleMenu = () => {
    992 <= window.screen.width ? document.body.classList.toggle("vertical-collpsed") : document.body.classList.remove("vertical-collpsed");
    if (left_side_bar === "default") {
      if (document.body) document.body.classList.remove("sidebar-enable");
      // if (document.body) document.body.setAttribute("data-sidebar-size", "");
      dispatch(changeSidebarType("condensed"));
    } else if (left_side_bar === "condensed") {
      if (document.body) document.body.classList.add("sidebar-enable");

      dispatch(changeSidebarType("default"));
    }
  };

  useEffect(() => {
    if (left_side_bar) {
      dispatch(changeSidebarType(left_side_bar));
    }
  }, [left_side_bar, dispatch]);

  return (
    /* <!-- Header --> */
    <header id='page-topbar'>
      <div className='navbar-header'>
        <div className='d-flex'>
          {/* <!-- LOGO --> */}
          <div className='navbar-brand-box'>
            <Link href='/dashboard'>
              <a className='logo logo-dark'>
                <span className='logo-sm'>
                  <AuticareLogo />
                </span>
                <span className='logo-lg'>
                  <AuticareLogo />
                  <span className='logo-text'>Auticare</span>
                </span>
              </a>
            </Link>

            <Link href='/dashboard'>
              <a className='logo logo-light'>
                <span className='logo-sm'>
                  <AuticareLogo />
                </span>
                <span className='logo-lg'>
                  <AuticareLogo />
                  <span className='logo-text'>Auticare</span>
                </span>
              </a>
            </Link>
          </div>

          <button type='button' className='btn btn-sm px-3 font-size-24 header-item waves-effect' id='vertical-menu-btn' onClick={toggleMenu}>
            <i className='ri-menu-2-line align-middle'></i>
          </button>
        </div>

        <div className='d-flex'>
          <div className='dropdown d-none d-lg-inline-block ml-1'>
            <FullScreen />
          </div>
          {/* <NotificationDropdown /> */}
          <ProfileMenu />

          {/* <div className="dropdown d-inline-block">
            <div className="mode_btn" data-toggle="buttons">
              <button
                type="button"
                className="btn header-item noti-icon waves-effect dark_light_btn"
              >
                <input type="checkbox" id="light_dark_switch" />
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </header>
    /* <!-- End Header --> */
  );
}

export default Header;
