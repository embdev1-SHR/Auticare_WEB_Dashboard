

const ToggleButton = () => {
  const toggleMenu = () => {
    document.body.classList.toggle("sidebar-enable");
    992 <= window.screen.width ? document.body.classList.toggle("vertical-collpsed") : document.body.classList.remove("vertical-collpsed");

    // s("body,html").click(function (e) {
    //     var t = s("#vertical-menu-btn");
    //     t.is(e.target) || 0 !== t.has(e.target).length || e.target.closest("div.vertical-menu") || s("body").removeClass("sidebar-enable");
    // }),
  };
  return (
    <button type="button" className="btn btn-sm px-3 font-size-24 header-item waves-effect" id="vertical-menu-btn" onClick={toggleMenu}>
      <i className="ri-menu-2-line align-middle"></i>
    </button>
  );
};

export default ToggleButton;
