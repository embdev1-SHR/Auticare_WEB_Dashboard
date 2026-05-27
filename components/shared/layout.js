import { useSelector } from "react-redux";
import { selectUserData } from "../../store/slice/auth.slice";
import Footer from "./footer";
import Header from "./header/header";
import Loader from "./loader";
import LeftSidebar from "./navigation/left-sidebar";

function Layout(props) {
  const userData = useSelector(selectUserData);
  return (
    <div id='layout-wrapper'>
      {/*  Header  */}
      <Header />

      {/*   Left Sidebar Start   */}
      <LeftSidebar />

      {/*  Start right Content here  */}
      {userData ? (
        <div className='main-content'>
          {props.children}

          {/*  Footer  */}
          <Footer />
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
export default Layout;
