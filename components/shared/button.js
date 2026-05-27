function ButtonComponent(props) {
  const { children, ...other } = props;
  return (
    <button type="submit" {...other}>
      {children}
    </button>
  );
}
export default ButtonComponent;
