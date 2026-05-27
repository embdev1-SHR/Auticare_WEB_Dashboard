
import { Button } from "reactstrap";

function FullScreen() {
  const toggleFullscreen = () => {
    console.log("clickedddddd >>>>>");
    if (!document.fullscreenElement && /* alternative standard method */ !document.mozFullScreenElement && !document.webkitFullscreenElement) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  };

  return (
    <Button color="none" type="button" className="header-item noti-icon waves-effect" onClick={toggleFullscreen} data-toggle="fullscreen">
      <i className="ri-fullscreen-line"></i>
    </Button>
  );
}
export default FullScreen;
