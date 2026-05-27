// import SimpleBar from "simplebar-react";

import dynamic from "next/dynamic";
const SimpleBar = dynamic(() => import("simplebar-react"), { ssr: false });
import "simplebar/dist/simplebar.min.css";

function SimpleBarComponent(props) {
  const { children, ...other } = props;
  return <SimpleBar {...other}>{children}</SimpleBar>;
}
export default SimpleBarComponent;
