import React, { createContext, useState } from "react";
import { useHistory } from "react-router";

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const userInfo = localStorage.getItem("userInfo");
  const expiresAt = localStorage.getItem("expiresAt");

  const history = useHistory();

  const [authState, setAuthState] = useState({
    token,
    expiresAt,
    userInfo: userInfo ? JSON.parse(userInfo) : {},
  });
  const setAuthInfo = ({ token, userInfo, expiresAt }) => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    localStorage.setItem("token", token);
    localStorage.setItem("expiresAt", expiresAt);
    setAuthState({
      token,
      userInfo: userInfo ? JSON.parse(userInfo) : {},
      expiresAt,
    });
  };

  // LOGOUT FUNCTION
  const logout = () => {
    // when logging out set all the info to nothing

    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    // set Auth state to nothing

    setAuthState({ token: null, expiresAt: null, userInfo: {} });
    // redirect the user to loging with useHistory

    history.push("/login");
  };

  // CHECK ADMIN ROLE
  const isAdmin = () => {
    return authState.userInfo.role === "admin";
  };

  // CHeck if the user is authenticated
  const isAuthenticated = () => {
    if (!authState.token || !authState.expiresAt) {
      return false;
    }
    return new Date().getTime() / 1000 < authState.expiresAt;
  };

  return (
    <Provider
      value={{
        authState,
        setAuthState: (authInfo) => setAuthInfo(authInfo),
        isAuthenticated,
        logout,
        isAdmin,
      }}
    >
      {children}
    </Provider>
  );
};

export { AuthContext, AuthProvider };
