function Copyright() {
  const getYear = () => {
    return new Date().getFullYear();
  };
  return (
    <p className="copyright">
      © {getYear()} Embright Infotech. All rights reserved.
    </p>
  );
}
export default Copyright;
