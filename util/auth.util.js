import authConstants from "../constants/auth.constant";

module.exports.setAuth = async (accessToken, refreshToken) => {
  if (!window) return;
  // Access Token
  // localStorage.setItem(authConstants.ACCESS_TOKEN, accessToken);
  setCookie(authConstants.ACCESS_TOKEN, accessToken);
  // Refresh Token
  // localStorage.setItem(authConstants.REFRESH_TOKEN, refreshToken);
  setCookie(authConstants.REFRESH_TOKEN, refreshToken);
};

module.exports.setAccessToken = (accessToken) => {
  if (!window) return;
  // localStorage.setItem(authConstants.ACCESS_TOKEN, accessToken);
  setCookie(authConstants.ACCESS_TOKEN, accessToken);
};

module.exports.setRefreshToken = (refreshToken) => {
  if (!window) return;
  // localStorage.setItem(authConstants.REFRESH_TOKEN, refreshToken);
  setCookie(authConstants.REFRESH_TOKEN, refreshToken);
};

module.exports.getRefreshToken = () => {
  if (!window) return;
  // return localStorage.getItem(authConstants.REFRESH_TOKEN);
  return getCookie(authConstants.REFRESH_TOKEN);
};

module.exports.getAccessToken = () => {
  if (!window) return;
    // return localStorage.getItem(authConstants.ACCESS_TOKEN);
  return getCookie(authConstants.ACCESS_TOKEN);
};

module.exports.saveAuth = async (token) => {
  if (!window) return;
  // localStorage.setItem(authConstants.TOKEN_KEY, token);
  setCookie(authConstants.TOKEN_KEY, token);
};

// exports.getAuth = () => {
//   if (!window) return;
//   localStorage.getItem(authConstants.TOKEN_KEY);
// };

module.exports.clearAuth = async () => {
  if (!window) return;
  // localStorage.clear();
  deleteAllCookies();
};

function setCookie(cname, cvalue, exdays = 30) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  if (!window) return null;
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

exports.deleteCookie = async (cname) => {
  if (!window) return;
  let expires = "expires=" + new Date(0).toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

const deleteAllCookies = async () => {
  if (!window) return;
  var allCookies = document.cookie.split(";");

  // The "expire" attribute of every cookie is
  // Set to "Thu, 01 Jan 1970 00:00:00 GMT"
  for (var i = 0; i < allCookies.length; i++)
    document.cookie = allCookies[i] + "=;expires=" + new Date(0).toUTCString();
};
