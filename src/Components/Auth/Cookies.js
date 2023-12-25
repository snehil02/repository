import * as Cookies from "js-cookie";

const setSessionCookie = (session, username) => {
  Cookies.remove("session");
  Cookies.remove("username");
  Cookies.set("session", session, { expires: 1 });
  Cookies.set("username", username, { expires: 1 });
};

export const getSessionCookie = () => {
  const sessionCookie = Cookies.get("session");
  const UserCookie = Cookies.get("username");

  if (!sessionCookie || !UserCookie) {
    return {};
  } 
  else {
    return JSON.parse(JSON.stringify(sessionCookie, UserCookie));
  }
};
export default setSessionCookie;