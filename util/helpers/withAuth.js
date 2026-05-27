import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectRoleBasedModules } from "../../store/slice/auth.slice";
import Loader from "./../../components/shared/loader";

const withAuth = (WrappedComponent, Module = null) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    const roleBasedModules = useSelector(selectRoleBasedModules);
    const router = useRouter();
    const [verified, setVerified] = useState(false);

    useEffect(() => {
      async function checkAuth() {
        if (
          roleBasedModules != null &&
          Module &&
          !roleBasedModules?.some((module) => module.ModuleName === Module)
        ) {
          router.replace("/dashboard");
        } else {
          setVerified(true);
        }
      }
      checkAuth();
    }, [roleBasedModules]);

    if (verified && roleBasedModules != null) {
      return <WrappedComponent {...props} />;
    } else {
      return <Loader />;
    }
  };
};

export default withAuth;
