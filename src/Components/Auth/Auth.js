import React, { createContext } from "react";

import { getSessionCookie } from "./Cookies"

const AuthApi = React.createContext(getSessionCookie());

export default AuthApi;