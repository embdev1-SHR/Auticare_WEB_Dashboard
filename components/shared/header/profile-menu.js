import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import Loader from "../logoutLoader";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { signOut, selectUserData, LogoutLoading, logoutLoader } from "../../../store/slice/auth.slice";
import { ToastNotification } from "../toast";

function ProfileMenu() {
  const [menu, setMenu] = useState(false);

  const router = useRouter();
  const UserData = useSelector(selectUserData);
  const loading = useSelector(LogoutLoading);
  const toggle = () => {
    setMenu(!menu);
  };
  const dispatch = useDispatch();

  const setLogout = async () => {
    dispatch(logoutLoader(true));
    const originalPromiseResult = await dispatch(signOut()).unwrap();
    if (originalPromiseResult.success) {
      ToastNotification("success", originalPromiseResult.results.message);
    }
    else {
      ToastNotification("Failed", "Log Out Failed");
    }
    dispatch(logoutLoader(false));
  };

  return (
    <>
    {loading ? <Loader /> :
      <Fragment>
        <Dropdown isOpen={menu} toggle={toggle} className='d-inline-block user-dropdown'>
          <DropdownToggle tag='button' className='btn header-item waves-effect' id='page-header-user-dropdown'>
            <img className='rounded-circle header-profile-user me-1' src='/images/users/avatar_sample.jpg' alt='Header Avatar' />
            {/* <Image
            className="rounded-circle header-profile-user me-1"
            src="/images/users/avatar_sample.jpg"
            alt="Header Avatar"
            width={36}
            height={36}
          /> */}
            <span className='d-none d-xl-inline-block ms-1 text-transform'>{UserData?.EmailId}</span>
            <i className='mdi mdi-chevron-down d-none ms-1 d-xl-inline-block'></i>
          </DropdownToggle>
          <DropdownMenu className='dropdown-menu-end dropdown-menu-right'>
            {UserData?.RoleName != "SuperAdmin" && <DropdownItem onClick={() => router.push("/my-profile")}>
              <i className='ri-user-line align-middle me-1'></i> My Profile
            </DropdownItem>}
            {/* <DropdownItem className='d-block' href='#'>
            <i className='ri-settings-2-line align-middle me-1'></i> Settings
          </DropdownItem> */}
            <DropdownItem divider />
            <DropdownItem className='text-danger' onClick={(e) => setLogout()}>
              <i className='ri-shut-down-line align-middle me-1 text-danger'></i> Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Fragment>
}
    </>
  );
}

export default ProfileMenu;
