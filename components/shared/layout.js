import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { selectUserData } from "../../store/slice/auth.slice";
import {
  loadMyClientProfile,
  selectClientProfile,
  selectClientProfileFetched,
} from "../../store/slice/client.slice";
import Footer from "./footer";
import Header from "./header/header";
import Loader from "./loader";
import LeftSidebar from "./navigation/left-sidebar";

function Layout(props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const userData = useSelector(selectUserData);
  const clientProfile = useSelector(selectClientProfile);
  const clientProfileFetched = useSelector(selectClientProfileFetched);

  useEffect(() => {
    if (userData?.RoleName !== "ClientAdmin") return;
    if (router.pathname === "/onboarding") return;
    if (!clientProfileFetched) {
      dispatch(loadMyClientProfile());
    } else if (!clientProfile?.ClientType) {
      router.replace("/onboarding");
    }
  }, [userData, clientProfile, clientProfileFetched, router.pathname]);

  const isClientAdminPending =
    userData?.RoleName === "ClientAdmin" &&
    (!clientProfileFetched || !clientProfile?.ClientType);

  return (
    <div id='layout-wrapper'>
      <Header />
      <LeftSidebar />
      {!userData || isClientAdminPending ? (
        <Loader />
      ) : (
        <div className='main-content'>
          {props.children}
          <Footer />
        </div>
      )}
    </div>
  );
}
export default Layout;
