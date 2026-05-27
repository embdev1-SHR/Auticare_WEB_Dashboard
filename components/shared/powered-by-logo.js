import Image from "next/image";
import companyLogo from "../../public/images/embright_logo.png";
function PoweredBy() {
  return (
    <Image src={companyLogo} alt="company logo" priority={true} />
  );
}
export default PoweredBy;
